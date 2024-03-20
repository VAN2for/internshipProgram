/**
 * Base64接口集
 * @author JingBin
 */
/**
 * 获取base64资源
 * @emphasis 改函数多处用到，无特殊需求勿改名
 */
function assetsBase64() {
    return window["assetsPackage"];
}
var _hasBase64 = void 0;
/**
 * 有base64资源
 * @emphasis 改函数多处用到，无特殊需求勿改名
 */
function hasBase64() {
    if (_hasBase64 == void 0)
        _hasBase64 = !ps.Tools.objIsNull(assetsBase64());
    return _hasBase64;
}
var dco = 0;
var dcoConfig = void 0;
var _getDcoConfiged = void 0;
/** 打印DCO信息 */
var args = [
    '%c %c %c 已支持 DCO 功能 %c %c ',
    'background: #6fbf64',
    'background: #4aa23e',
    'color: #ffffff; background: #0f7817;',
    'background: #4aa23e',
    'background: #6fbf64'
];
console.log.apply(console, args);
/**
 * 获取DCO配置
 */
function getDcoConfig() {
    if (_getDcoConfiged)
        return;
    _getDcoConfiged = true;
    var value = getQueryString("dco_gid");
    if (dco != value) {
        dco = value;
    }
    if (window["HttpAPI"] && !isSendDone) {
        isSendDone = true;
        window["HttpAPI"].sendPoint("dco&cls=" + dco);
    }
    if (hasBase64())
        dcoConfig = ps.Tools.strToJson(assetsBase64()["dco_config_json"]);
}
var _hasDcoConfig = void 0;
/**
 * 有DCO配置
 */
function hasDcoConfig() {
    if (_hasDcoConfig == void 0) {
        getDcoConfig();
        _hasDcoConfig = !ps.Tools.objIsNull(dcoConfig);
    }
    return _hasDcoConfig;
}
var dcoData = void 0;
var _getDcoDataed = void 0;
/**
 * 获取DCO数据
 */
function getDcoData() {
    if (_getDcoDataed)
        return;
    _getDcoDataed = true;
    if (hasDcoConfig()) {
        dcoData = dcoConfig[dco];
        if (ps.Tools.objIsNull(dcoData))
            dcoData = dcoConfig[Object.keys(dcoConfig)[0]]; //默认取配置中第一个
    }
}
var _hasDcoData = void 0;
/**
 * 有DCO数据
 */
function hasDcoData() {
    if (_hasDcoData == void 0) {
        getDcoData();
        _hasDcoData = !ps.Tools.objIsNull(dcoData);
    }
    return _hasDcoData;
}
var dcoRes = void 0;
var _getDcoResed = void 0;
/**
 * 获取DCO资源
 */
function getDcoRes() {
    if (_getDcoResed)
        return;
    _getDcoResed = true;
    if (hasDcoData())
        dcoRes = dcoData["res"];
}
var _hasDcoRes = void 0;
/**
 * 有DCO资源
 */
function hasDcoRes() {
    if (_hasDcoRes == void 0) {
        getDcoRes();
        _hasDcoRes = !ps.Tools.objIsNull(dcoRes);
    }
    return _hasDcoRes;
}
/**
 * 获取DCO中的Key
 * @param {string} key 资源的Key
 */
function getDcoKey(key) {
    var dcoKey = key;
    if (hasDcoRes() && dcoRes[key])
        dcoKey = dcoRes[key];
    return dcoKey;
}
/**
 * 通过资源URL获取资源的Key
 * @param {string} url 资源URL
 * @emphasis 改函数多处用到，无特殊需求勿改名
 */
function getKeyByUrl(url) {
    var arr = url.split("\/");
    url = arr[arr.length - 1];
    var key = url.replace(".", "_");
    return key;
}
/**
 * 通过资源的Key获取64位资源
 * @param {string} key 资源的Key
 * @emphasis 改函数多处用到，无特殊需求勿改名
 */
function getAssestByKey(key) {
    if (hasBase64()) {
        key = getDcoKey(key);
        return assetsBase64()[key];
    }
    return key;
}
/**
 * 通过资源URL获取64位资源
 * @param {string} url 资源URL
 * @emphasis 改函数多处用到，无特殊需求勿改名
 */
function getAssestByUrl(url) {
    if (hasBase64()) {
        var arr = url.split("\/");
        url = arr[arr.length - 1];
        var key = url.replace(".", "_");
        if (url.indexOf("mp4") > -1) {
            url = "data:video/mp4;base64," + getAssestByKey(key);
        }
        else if (url.indexOf("ttf") > -1) {
            url = "data:font/ttf;base64," + getAssestByKey(key);
        }
        /* else if (url.indexOf("mp3") > -1) {
            url = "data:audio/mp3;base64," + getAssestByKey(key);
        } */
        else {
            url = getAssestByKey(key);
        }
    }
    return url;
}
/**
 * base64转二进制
 */
function basedecode(base64) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var lookup = new Uint8Array(256);
    for (var i = 0; i < chars.length; i++) {
        lookup[chars.charCodeAt(i)] = i;
    }
    var bufferLength = base64.length * 0.75;
    var len = base64.length;
    var p = 0;
    var encoded1 = 0;
    var encoded2 = 0;
    var encoded3 = 0;
    var encoded4 = 0;
    if (base64[base64.length - 1] === '=') {
        bufferLength--;
        if (base64[base64.length - 2] === '=') {
            bufferLength--;
        }
    }
    var arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
    for (var i = 0; i < len; i += 4) {
        encoded1 = lookup[base64.charCodeAt(i)];
        encoded2 = lookup[base64.charCodeAt(i + 1)];
        encoded3 = lookup[base64.charCodeAt(i + 2)];
        encoded4 = lookup[base64.charCodeAt(i + 3)];
        bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
        bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
        bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }
    return arraybuffer;
}
var isSendDone = false;
/**
 * 获取查询字符串
 * @param {string} name 需要查询的字符串
 */
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r)
        return r[2];
}
//# sourceMappingURL=Base64.js.map