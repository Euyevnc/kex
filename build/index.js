'use strict';

var fs = require('fs');

function setPrototypeOf(obj, proto) {
    if (Object.setPrototypeOf) {
        Object.setPrototypeOf(obj, proto);
    }
    else {
        obj.__proto__ = proto;
    }
}
function Err(message) {
    const err = new Error(message);
    setPrototypeOf(err, Err.prototype);
    return err;
}
Err.prototype = Object.create(Error.prototype, {
    name: { value: "Error", enumerable: false },
});
function ParseErr(message, str, indx) {
    const whitespace = str.slice(0, indx).split(/\n/);
    const lineNo = whitespace.length;
    const colNo = whitespace[lineNo - 1].length + 1;
    message +=
        " at line " +
            lineNo +
            " col " +
            colNo +
            ":\n\n" +
            "  " +
            str.split(/\n/)[lineNo - 1] +
            "\n" +
            "  " +
            Array(colNo).join(" ") +
            "^";
    throw Err(message);
}

function trimLeft(str) {
    if (!!String.prototype.trimLeft) {
        return str.trimLeft();
    }
    else {
        return str.replace(/^\s+/, "");
    }
}
function trimRight(str) {
    if (!!String.prototype.trimRight) {
        return str.trimRight();
    }
    else {
        return str.replace(/\s+$/, "");
    }
}

function trimWS(str, config, wsLeft, wsRight) {
    let leftTrim;
    let rightTrim;
    if (Array.isArray(config.autoTrim)) {
        leftTrim = config.autoTrim[1];
        rightTrim = config.autoTrim[0];
    }
    else {
        leftTrim = rightTrim = config.autoTrim;
    }
    if (wsLeft || wsLeft === false) {
        leftTrim = wsLeft;
    }
    if (wsRight || wsRight === false) {
        rightTrim = wsRight;
    }
    if (!rightTrim && !leftTrim) {
        return str;
    }
    if (leftTrim === "slurp" && rightTrim === "slurp") {
        return str.trim();
    }
    if (leftTrim === "_" || leftTrim === "slurp") {
        str = trimLeft(str);
    }
    else if (leftTrim === "-" || leftTrim === "nl") {
        str = str.replace(/^(?:\r\n|\n|\r)/, "");
    }
    if (rightTrim === "_" || rightTrim === "slurp") {
        str = trimRight(str);
    }
    else if (rightTrim === "-" || rightTrim === "nl") {
        str = str.replace(/(?:\r\n|\n|\r)$/, "");
    }
    return str;
}
const escMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
};
function replaceChar(s) {
    return escMap[s];
}
function XMLEscape(str) {
    const newStr = String(str);
    if (/[&<>"']/.test(newStr)) {
        return newStr.replace(/[&<>"']/g, replaceChar);
    }
    else {
        return newStr;
    }
}

const templateLitReg = /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})*}|(?!\${)[^\\`])*`/g;
const singleQuoteReg = /'(?:\\[\s\w"'\\`]|[^\n\r'\\])*?'/g;
const doubleQuoteReg = /"(?:\\[\s\w"'\\`]|[^\n\r"\\])*?"/g;
function escapeRegExp(string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
}
function parse(str, config) {
    let buffer = [];
    let trimLeftOfNextStr = false;
    let lastIndex = 0;
    const parseOptions = config.parse;
    if (config.rmWhitespace) {
        str = str.replace(/[\r\n]+/g, "\n").replace(/^\s+|\s+$/gm, "");
    }
    templateLitReg.lastIndex = 0;
    singleQuoteReg.lastIndex = 0;
    doubleQuoteReg.lastIndex = 0;
    function pushString(strng, shouldTrimRightOfString) {
        if (strng) {
            strng = trimWS(strng, config, trimLeftOfNextStr, shouldTrimRightOfString);
            if (strng) {
                strng = strng.replace(/\\|'/g, "\\$&").replace(/\r\n|\n|\r/g, "\\n");
                buffer.push(strng);
            }
        }
    }
    const prefixes = [
        parseOptions.exec,
        parseOptions.interpolate,
        parseOptions.raw,
        parseOptions.include,
        parseOptions.layout,
    ].reduce(function (accumulator, prefix) {
        if (accumulator && prefix) {
            return accumulator + "|" + escapeRegExp(prefix);
        }
        else if (prefix) {
            return escapeRegExp(prefix);
        }
        else {
            return accumulator;
        }
    }, "");
    const parseOpenReg = new RegExp("([^]*?)" +
        escapeRegExp(config.tags[0]) +
        "(-|_)?\\s*(" +
        prefixes +
        ")?\\s*", "g");
    const parseCloseReg = new RegExp("'|\"|`|\\/\\*|(\\s*(-|_)?" + escapeRegExp(config.tags[1]) + ")", "g");
    let m;
    while ((m = parseOpenReg.exec(str))) {
        lastIndex = m[0].length + m.index;
        const precedingString = m[1];
        const wsLeft = m[2];
        const prefix = m[3] || "";
        pushString(precedingString, wsLeft);
        parseCloseReg.lastIndex = lastIndex;
        let closeTag;
        let currentObj = false;
        while ((closeTag = parseCloseReg.exec(str))) {
            if (closeTag[1]) {
                let content = str.slice(lastIndex, closeTag.index);
                parseOpenReg.lastIndex = lastIndex = parseCloseReg.lastIndex;
                trimLeftOfNextStr = closeTag[2];
                const currentType = prefix === parseOptions.exec
                    ? "e"
                    : prefix === parseOptions.raw
                        ? "r"
                        : prefix === parseOptions.interpolate
                            ? "i"
                            : prefix === parseOptions.include
                                ? "inc"
                                : prefix === parseOptions.layout
                                    ? "lay"
                                    : "";
                currentObj = { t: currentType, val: content };
                break;
            }
            else {
                const char = closeTag[0];
                if (char === "/*") {
                    const commentCloseInd = str.indexOf("*/", parseCloseReg.lastIndex);
                    if (commentCloseInd === -1) {
                        ParseErr("unclosed comment", str, closeTag.index);
                    }
                    parseCloseReg.lastIndex = commentCloseInd;
                }
                else if (char === "'") {
                    singleQuoteReg.lastIndex = closeTag.index;
                    const singleQuoteMatch = singleQuoteReg.exec(str);
                    if (singleQuoteMatch) {
                        parseCloseReg.lastIndex = singleQuoteReg.lastIndex;
                    }
                    else {
                        ParseErr("unclosed string", str, closeTag.index);
                    }
                }
                else if (char === '"') {
                    doubleQuoteReg.lastIndex = closeTag.index;
                    const doubleQuoteMatch = doubleQuoteReg.exec(str);
                    if (doubleQuoteMatch) {
                        parseCloseReg.lastIndex = doubleQuoteReg.lastIndex;
                    }
                    else {
                        ParseErr("unclosed string", str, closeTag.index);
                    }
                }
                else if (char === "`") {
                    templateLitReg.lastIndex = closeTag.index;
                    const templateLitMatch = templateLitReg.exec(str);
                    if (templateLitMatch) {
                        parseCloseReg.lastIndex = templateLitReg.lastIndex;
                    }
                    else {
                        ParseErr("unclosed string", str, closeTag.index);
                    }
                }
            }
        }
        if (currentObj) {
            buffer.push(currentObj);
        }
        else {
            ParseErr("unclosed tag", str, m.index + precedingString.length);
        }
    }
    pushString(str.slice(lastIndex, str.length), false);
    return buffer;
}

function getInclusionPath(name, config) {
    const options = config;
    const path = `${options.inclusionsPath}/${name}/index.kex`;
    return path;
}
function getLayoutPath(name, config) {
    const options = config;
    const path = `${options.layoutsPath}/${name}/index.kex`;
    return path;
}
function getViewPath(name, config) {
    const options = config;
    const path = `${options.viewsPath}/${name}/index.kex`;
    return path;
}
function readFile(filePath) {
    try {
        return fs.readFileSync(filePath).toString();
    }
    catch (_a) {
        throw new Error("Failed to read template at '" + filePath + "'");
    }
}

function compileToString(str, config, cache) {
    const buffer = parse(str, config);
    let res = "let tR=''\n" +
        (config.useWith ? "with(" + config.varName + "||{}){" : "") +
        compileScope(buffer, config, cache) +
        "return tR" +
        (config.useWith ? "}" : "");
    if (cache)
        return res;
    return res;
}
function compileScope(buff, config, cache) {
    let i = 0;
    const buffLength = buff.length;
    let returnStr = "";
    let layoutContent = "";
    for (i; i < buffLength; i++) {
        const currentBlock = buff[i];
        if (typeof currentBlock === "string") {
            const str = currentBlock;
            returnStr += "tR+='" + str + "'\n";
        }
        else {
            const type = currentBlock.t;
            let content = currentBlock.val || "";
            if (type === "r") {
                returnStr += "tR+=" + content + "\n";
            }
            else if (type === "i") {
                if (config.autoEscape) {
                    const fnIsCached = cache.checkCache("escape");
                    if (!fnIsCached) {
                        cache.addToCache("escape", () => config.escape);
                    }
                    content = `cache.escape(${content})`;
                }
                returnStr += "tR+=" + content + "\n";
            }
            else if (type === "inc") {
                const match = content.match(/\s*([\w-]+)\s*(,\s*({.+}))?/);
                const inclusionName = (match === null || match === void 0 ? void 0 : match[1]) || "";
                const inclusionArgs = match === null || match === void 0 ? void 0 : match[3];
                const fnIsCached = cache.checkCache(inclusionName);
                if (!fnIsCached)
                    cache.addToCache(inclusionName, () => compile(readFile(getInclusionPath(inclusionName, config)), config, cache).compiled);
                content = `cache["${inclusionName}"](${inclusionArgs}, cache)`;
                returnStr += "tR+=" + content + "\n";
            }
            else if (type === "lay") {
                layoutContent = content;
            }
            else if (type === "e") {
                returnStr += content + "\n";
            }
        }
    }
    if (layoutContent) {
        const match = layoutContent.match(/\s*([\w-]+)\s*(,\s*({.+}))?/);
        const layoutName = (match === null || match === void 0 ? void 0 : match[1]) || "";
        const layoutArgs = match === null || match === void 0 ? void 0 : match[3];
        const fnIsCached = cache.checkCache(layoutName);
        if (!fnIsCached)
            cache.addToCache(layoutName, () => compile(readFile(getLayoutPath(layoutName, config)), config, cache)
                .compiled);
        returnStr += `tR = cache["${layoutName}"](Object.assign(${config.varName}, {body: tR}, ${layoutArgs}), cache)\n`;
    }
    return returnStr;
}

function compile(str, config, cache) {
    const compileCache = cache || new Cache();
    try {
        const compileFn = new Function(config.varName, "cache", compileToString(str, config, compileCache));
        return { compiled: compileFn, cache: compileCache.getStore() };
    }
    catch (e) {
        if (e instanceof SyntaxError) {
            throw Err("Bad template syntax\n\n" +
                e.message +
                "\n" +
                Array(e.message.length + 1).join("=") +
                "\n" +
                compileToString(str, config, compileCache) +
                "\n");
        }
        else {
            throw e;
        }
    }
}
class Cache {
    constructor() {
        this.addToCache = (name, fnMaker) => {
            this.store[name] = () => "";
            this.store[name] = fnMaker();
        };
        this.checkCache = (name) => this.store.hasOwnProperty(name);
        this.getStore = () => this.store;
        this.store = {};
    }
}

class Config {
    constructor(props) {
        this.escape = XMLEscape;
        this.autoEscape = true;
        this.autoTrim = [false, "nl"];
        this.parse = {
            exec: "",
            interpolate: "=",
            raw: "~",
            include: "+",
            layout: "#",
        };
        this.rmWhitespace = false;
        this.tags = ["<%", "%>"];
        this.useWith = false;
        this.varName = "it";
        this.layoutsPath = "src/layouts";
        this.inclusionsPath = "src/includes";
        this.viewsPath = "src/views";
    }
}

class Kex {
    constructor(option) {
        this.getConfig = () => {
            return this.config;
        };
        this.setConfig = (newParams) => {
            this.config = Object.assign(Object.assign({}, this.config), newParams);
        };
        this.compileString = (template) => {
            const { compiled, cache } = compile(template, this.config);
            return (data) => compiled(data, cache);
        };
        this.compileView = (viewName) => {
            const viewTemplate = readFile(getViewPath(viewName, this.config));
            const { compiled, cache } = compile(viewTemplate, this.config);
            console.log(compiled.toString());
            return (data) => compiled(data, cache);
        };
        this.renderString = (tempalte, data) => {
            const { compiled, cache } = compile(tempalte, this.config);
            return compiled(data, cache);
        };
        this.renderView = (viewName, data) => {
            const { compiled, cache } = compile(viewName, this.config);
            return compiled(data, cache);
        };
        this.config = new Config();
    }
}

module.exports = Kex;
