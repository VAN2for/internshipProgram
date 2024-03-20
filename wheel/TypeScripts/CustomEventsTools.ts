namespace CustomEventsTools {
    export const getEventDelayTime = (param: ps.CustomEventParamType) => {
        let delayTime = 0;
        const event = ps.getCustomEventByParam(param);
        event.action.forEach(item => {
            if (item.method === "vpWaitTime") {
                delayTime += Number(item.param.ms);
            }
        })
        return delayTime;
    }

    export const showEventInfo = (param: ps.CustomEventParamType) => {
        const event = ps.getCustomEventByParam(param);
        console.log(event);
    }

    export const showSceneEventsInfo = (scene: qc.Node) => {
        const vpAsts: {} = scene.getScript("playsmart.editor.data").vpAst
        // for (const key in vpAsts) {
        //     console.log(vpAsts[key])
        // }
        console.log(vpAsts);
    }

    export const getEventParticles = (param: ps.CustomEventParamType) => {
        const pars: qc.Node[] = [];
        const event = ps.getCustomEventByParam(param);
        event.action.forEach(par => {
            if (par.method === "vpPlayParticle") {
                pars.push(qc_game.nodePool.find(par.node))
            }
        })
        return pars
    }


    export const cloneEvent = (pos: qc.Point, parent: qc.Node, param: ps.CustomEventParamType) => {
        if (!pos) pos = new qc.Point(0, 0);
        const eventDate: {
            tweenNodes: qc.Node[],
            pars: qc.Node[],
            audios: qc.Node[]
        } = {
            tweenNodes: [], pars: [], audios: []
        }
        const event = ps.getCustomEventByParam(param);
        event.action.forEach(par => {
            if (!par.node) return;
            const node = qc_game.nodePool.find(par.node)
            // console.log(par.method);
            switch (par.method) {
                case "vpPlayTween": eventDate.tweenNodes.push(node); break;
                case "vpPlayParticle": eventDate.pars.push(node); break;
                case "vpReplaySound": eventDate.audios.push(node); break;
            }
        })

        eventDate.tweenNodes.forEach(node => {
            const cloneNode = qc_game.add.clone(node, parent)
            cloneNode.visible = true;
            cloneNode.x = pos.x;
            cloneNode.y = pos.y;
            const cloneNodeTween: qc.Tween[] = cloneNode.getScripts("qc.Tween") as qc.Tween[];
            cloneNodeTween.forEach(tween => {
                tween.playForward();
            })
        })
        eventDate.pars.forEach(par => {
            const clonePar = qc_game.add.clone(par, parent);
            clonePar.visible = true;
            clonePar.x = pos.x;
            clonePar.y = pos.y;
            (clonePar as any).vpPlayParticle()
        })
        eventDate.audios.forEach(audio => {
            audio.getScript('ps.AudioNode').vpReplaySound({ loop: false })
        })
        return eventDate
    }
}
