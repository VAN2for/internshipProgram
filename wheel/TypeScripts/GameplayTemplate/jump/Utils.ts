namespace ps.jumpUtils {
    export function getTrueBoxSize(node: any) {
        const verts = node._body._rawVertices;
        const nodeW = node.width;
        const nodeH = node.height;
        let xMax = 0;
        let yMax = 0;
        let yMin = 1;
        let xMin = 1;
        verts.forEach((v: Phaser.Point) => {
            xMax = Math.max(v.x, xMax);
            yMax = Math.max(v.y, yMax);
            xMin = Math.min(v.x, xMin);
            yMin = Math.min(v.y, yMin);
        })
        return {
            l: nodeW * xMin,
            r: nodeW - nodeW * xMax,
            t: nodeH * yMin,
            b: nodeH - nodeH * yMax
        }
    }
}