var ps;
(function (ps) {
    var jumpUtils;
    (function (jumpUtils) {
        function getTrueBoxSize(node) {
            var verts = node._body._rawVertices;
            var nodeW = node.width;
            var nodeH = node.height;
            var xMax = 0;
            var yMax = 0;
            var yMin = 1;
            var xMin = 1;
            verts.forEach(function (v) {
                xMax = Math.max(v.x, xMax);
                yMax = Math.max(v.y, yMax);
                xMin = Math.min(v.x, xMin);
                yMin = Math.min(v.y, yMin);
            });
            return {
                l: nodeW * xMin,
                r: nodeW - nodeW * xMax,
                t: nodeH * yMin,
                b: nodeH - nodeH * yMax
            };
        }
        jumpUtils.getTrueBoxSize = getTrueBoxSize;
    })(jumpUtils = ps.jumpUtils || (ps.jumpUtils = {}));
})(ps || (ps = {}));
//# sourceMappingURL=Utils.js.map