'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs');

function setPrototypeOf(obj, proto) {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    if (Object.setPrototypeOf) {
        Object.setPrototypeOf(obj, proto);
    }
    else {
        obj.__proto__ = proto;
    }
}
// This is pretty much the only way to get nice, extended Errors
// without using ES6
/**
 * This returns a new Error with a custom prototype. Note that it's _not_ a constructor
 *
 * @param message Error message
 *
 * **Example**
 *
 * ```js
 * throw EtaErr("template not found")
 * ```
 */
function EtaErr(message) {
    const err = new Error(message);
    setPrototypeOf(err, EtaErr.prototype);
    return err;
}
EtaErr.prototype = Object.create(Error.prototype, {
    name: { value: 'Eta Error', enumerable: false }
});
/**
 * Throws an EtaErr with a nicely formatted error and message showing where in the template the error occurred.
 */
function ParseErr(message, str, indx) {
    const whitespace = str.slice(0, indx).split(/\n/);
    const lineNo = whitespace.length;
    const colNo = whitespace[lineNo - 1].length + 1;
    message +=
        ' at line ' +
            lineNo +
            ' col ' +
            colNo +
            ':\n\n' +
            '  ' +
            str.split(/\n/)[lineNo - 1] +
            '\n' +
            '  ' +
            Array(colNo).join(' ') +
            '^';
    throw EtaErr(message);
}

/**
 * @returns The global Promise function
 */
new Function("return this")()
    .Promise;
/**
 * str.trimLeft polyfill
 *
 * @param str - Input string
 * @returns The string with left whitespace removed
 *
 */
function trimLeft(str) {
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!String.prototype.trimLeft) {
        return str.trimLeft();
    }
    else {
        return str.replace(/^\s+/, "");
    }
}
/**
 * str.trimRight polyfill
 *
 * @param str - Input string
 * @returns The string with right whitespace removed
 *
 */
function trimRight(str) {
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!String.prototype.trimRight) {
        return str.trimRight();
    }
    else {
        return str.replace(/\s+$/, ""); // TODO: do we really need to replace BOM's?
    }
}

/**
 * Takes a string within a template and trims it, based on the preceding tag's whitespace control and `config.autoTrim`
 */
function trimWS(str, config, wsLeft, wsRight) {
    let leftTrim;
    let rightTrim;
    if (Array.isArray(config.autoTrim)) {
        // kinda confusing
        // but _}} will trim the left side of the following string
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
        // full slurp
        str = trimLeft(str);
    }
    else if (leftTrim === "-" || leftTrim === "nl") {
        // nl trim
        str = str.replace(/^(?:\r\n|\n|\r)/, "");
    }
    if (rightTrim === "_" || rightTrim === "slurp") {
        // full slurp
        str = trimRight(str);
    }
    else if (rightTrim === "-" || rightTrim === "nl") {
        // nl trim
        str = str.replace(/(?:\r\n|\n|\r)$/, ""); // TODO: make sure this gets \r\n
    }
    return str;
}

/* END TYPES */
const templateLitReg = /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})*}|(?!\${)[^\\`])*`/g;
const singleQuoteReg = /'(?:\\[\s\w"'\\`]|[^\n\r'\\])*?'/g;
const doubleQuoteReg = /"(?:\\[\s\w"'\\`]|[^\n\r"\\])*?"/g;
function escapeRegExp(string) {
    // From MDN
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
function parse(str, config) {
    let buffer = [];
    let trimLeftOfNextStr = false;
    let lastIndex = 0;
    const parseOptions = config.parse;
    /* Adding for EJS compatibility */
    if (config.rmWhitespace) {
        // Code taken directly from EJS
        // Have to use two separate replaces here as `^` and `$` operators don't
        // work well with `\r` and empty lines don't work well with the `m` flag.
        // Essentially, this replaces the whitespace at the beginning and end of
        // each line and removes multiple newlines.
        str = str.replace(/[\r\n]+/g, "\n").replace(/^\s+|\s+$/gm, "");
    }
    /* End rmWhitespace option */
    templateLitReg.lastIndex = 0;
    singleQuoteReg.lastIndex = 0;
    doubleQuoteReg.lastIndex = 0;
    function pushString(strng, shouldTrimRightOfString) {
        if (strng) {
            // if string is truthy it must be of type 'string'
            strng = trimWS(strng, config, trimLeftOfNextStr, // this will only be false on the first str, the next ones will be null or undefined
            shouldTrimRightOfString);
            if (strng) {
                // replace \ with \\, ' with \'
                // we're going to convert all CRLF to LF so it doesn't take more than one replace
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
            // accumulator is falsy
            return escapeRegExp(prefix);
        }
        else {
            // prefix and accumulator are both falsy
            return accumulator;
        }
    }, "");
    const parseOpenReg = new RegExp("([^]*?)" +
        escapeRegExp(config.tags[0]) +
        "(-|_)?\\s*(" +
        prefixes +
        ")?\\s*", "g");
    const parseCloseReg = new RegExp("'|\"|`|\\/\\*|(\\s*(-|_)?" + escapeRegExp(config.tags[1]) + ")", "g");
    // TODO: benchmark having the \s* on either side vs using str.trim()
    let m;
    while ((m = parseOpenReg.exec(str))) {
        lastIndex = m[0].length + m.index;
        const precedingString = m[1];
        const wsLeft = m[2];
        const prefix = m[3] || ""; // by default either ~, =, or empty
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

var defineConfig = {
    layoutsPath: "src/layouts",
    inclusionsPath: "src/includes",
    parse: {
        exec: "",
        interpolate: "=",
        raw: "~",
        include: "+",
        layout: "#",
    },
    rmWhitespace: false,
    tags: ["<%", "%>"],
    useWith: false,
    varName: "it",
};

var config = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': defineConfig
});

/* END TYPES */
function compile(str, config) {
    const options = config || defineConfig;
    try {
        return new Function(options.varName, "E", // Config
        compileToString(str, options)); // eslint-disable-line no-new-func
    }
    catch (e) {
        if (e instanceof SyntaxError) {
            throw EtaErr("Bad template syntax\n\n" +
                e.message +
                "\n" +
                Array(e.message.length + 1).join("=") +
                "\n" +
                compileToString(str, options) +
                "\n" // This will put an extra newline before the callstack for extra readability
            );
        }
        else {
            throw e;
        }
    }
}

function getInclusionPath(name, config) {
    const options = config || defineConfig;
    const path = `${options.inclusionsPath}/${name}/index.kex`;
    return path;
}
function getLayoutPath(name, config) {
    const options = config || defineConfig;
    const path = `${options.layoutsPath}/${name}/index.kex`;
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

/* END TYPES */
/**
 * Compiles a template string to a function string. Most often users just use `compile()`, which calls `compileToString` and creates a new function using the result
 *
 * **Example**
 *
 * ```js
 * compileToString("Hi <%= it.user %>", eta.config)
 * // "var tR='',include=E.include.bind(E),includeFile=E.includeFile.bind(E);tR+='Hi ';tR+=E.e(it.user);if(cb){cb(null,tR)} return tR"
 * ```
 */
function compileToString(str, config) {
    const buffer = parse(str, config);
    let res = "let tR='',__l,__lP" +
        "\nfunction layout(p,d){__l=p;__lP=d}\n" +
        (config.useWith ? "with(" + config.varName + "||{}){" : "") +
        compileScope(buffer, config) +
        "return tR" +
        (config.useWith ? "}" : "");
    return res;
}
function compileScope(buff, config) {
    let i = 0;
    const buffLength = buff.length;
    let returnStr = "";
    let layoutCall = "";
    for (i; i < buffLength; i++) {
        const currentBlock = buff[i];
        if (typeof currentBlock === "string") {
            const str = currentBlock;
            // we know string exists
            returnStr += "tR+='" + str + "'\n";
        }
        else {
            const type = currentBlock.t;
            let content = currentBlock.val || "";
            if (type === "r") {
                // raw
                if (config.filter) {
                    content = "E.filter(" + content + ")";
                }
                returnStr += "tR+=" + content + "\n";
            }
            else if (type === "i") {
                // interpolate
                if (config.filter) {
                    content = "E.filter(" + content + ")";
                }
                if (config.autoEscape) {
                    content = "E.e(" + content + ")";
                }
                returnStr += "tR+=" + content + "\n";
                // reference
            }
            else if (type === "inc") {
                const match = content.match(/\s*(\w+)\s*,\s*({.+})/);
                const inclusionName = (match === null || match === void 0 ? void 0 : match[1]) || "";
                const inclusionArgs = match === null || match === void 0 ? void 0 : match[2];
                const filePath = getInclusionPath(inclusionName);
                const fileTemplate = readFile(filePath);
                content = `(${compile(fileTemplate)})(${inclusionArgs})`;
                returnStr += "tR+=" + content + "\n";
            }
            else if (type === "lay") {
                layoutCall = content;
            }
            else if (type === "e") {
                // execute
                returnStr += content + "\n"; // you need a \n in case you have <% } %>
            }
        }
    }
    if (layoutCall) {
        const match = layoutCall.match(/\s*(\w+)\s*,\s*({.+})/);
        const layoutName = (match === null || match === void 0 ? void 0 : match[1]) || "";
        const layoutArgs = match === null || match === void 0 ? void 0 : match[2];
        const layoutPath = getLayoutPath(layoutName);
        const fileTemplate = readFile(layoutPath);
        returnStr = `tR = (${compile(fileTemplate)})(Object.assign(${config.varName}, {body: tR}, ${layoutArgs}))\n`;
    }
    return returnStr;
}

/* TYPES */
// import type { EtaConfig, PartialConfig } from './config'
/* END TYPES */
function render(template, data, config) {
    return compile(template, config)(data);
}

exports.compile = compile;
exports.compileToString = compileToString;
exports.defaultConfig = config;
exports.parse = parse;
exports.render = render;
