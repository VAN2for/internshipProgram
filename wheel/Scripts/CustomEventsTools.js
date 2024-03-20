var CustomEventsTools;
(function (CustomEventsTools) {
    CustomEventsTools.getEventDelayTime = function (param) {
        var delayTime = 0;
        var event = ps.getCustomEventByParam(param);
        event.action.forEach(function (item) {
            if (item.method === "vpWaitTime") {
                delayTime += Number(item.param.ms);
            }
        });
        return delayTime;
    };
    CustomEventsTools.showEventInfo = function (param) {
        var event = ps.getCustomEventByParam(param);
        console.log(event);
    };
    CustomEventsTools.showSceneEventsInfo = function (scene) {
        var vpAsts = scene.getScript("playsmart.editor.data").vpAst;
        // for (const key in vpAsts) {
        //     console.log(vpAsts[key])
        // }
        console.log(vpAsts);
    };
    CustomEventsTools.getEventParticles = function (param) {
        var pars = [];
        var event = ps.getCustomEventByParam(param);
        event.action.forEach(function (par) {
            if (par.method === "vpPlayParticle") {
                pars.push(qc_game.nodePool.find(par.node));
            }
        });
        return pars;
    };
    CustomEventsTools.cloneEvent = function (pos, parent, param) {
        if (!pos)
            pos = new qc.Point(0, 0);
        var eventDate = {
            tweenNodes: [], pars: [], audios: []
        };
        var event = ps.getCustomEventByParam(param);
        event.action.forEach(function (par) {
            if (!par.node)
                return;
            var node = qc_game.nodePool.find(par.node);
            // console.log(par.method);
            switch (par.method) {
                case "vpPlayTween":
                    eventDate.tweenNodes.push(node);
                    break;
                case "vpPlayParticle":
                    eventDate.pars.push(node);
                    break;
                case "vpReplaySound":
                    eventDate.audios.push(node);
                    break;
            }
        });
        eventDate.tweenNodes.forEach(function (node) {
            var cloneNode = qc_game.add.clone(node, parent);
            cloneNode.visible = true;
            cloneNode.x = pos.x;
            cloneNode.y = pos.y;
            var cloneNodeTween = cloneNode.getScripts("qc.Tween");
            cloneNodeTween.forEach(function (tween) {
                tween.playForward();
            });
        });
        eventDate.pars.forEach(function (par) {
            var clonePar = qc_game.add.clone(par, parent);
            clonePar.visible = true;
            clonePar.x = pos.x;
            clonePar.y = pos.y;
            clonePar.vpPlayParticle();
        });
        eventDate.audios.forEach(function (audio) {
            audio.getScript('ps.AudioNode').vpReplaySound({ loop: false });
        });
        return eventDate;
    };
})(CustomEventsTools || (CustomEventsTools = {}));
//# sourceMappingURL=CustomEventsTools.js.map