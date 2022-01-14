const renderLogs =  require("./render").logs;
const compileLogs = require("./compile").logs;

renderLogs("il <%=it.girl%> <%+ string, {word: 'alles'} %>", {girl: 'kate'});
compileLogs("il <%=it.girl%> <%+ string, {word: 'alles'} %>");