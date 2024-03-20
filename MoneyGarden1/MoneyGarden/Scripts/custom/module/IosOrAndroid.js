var ps;
(function (ps) {
    /**
     * 判断是ios系统还是安卓系统 返回值为true代表安卓系统 否则是ios系统
     */
    function IosOrAndroid() {
        var u = navigator.userAgent, app = navigator.appVersion;
        var is_Android = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
        var is_IOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        var result;
        if (is_Android) {
            console.log("Andriod");
            result = true;
        }
        if (is_IOS) {
            console.log("iOS");
            result = false;
        }
        return result;
    }
    ps.IosOrAndroid = IosOrAndroid;
})(ps || (ps = {}));
