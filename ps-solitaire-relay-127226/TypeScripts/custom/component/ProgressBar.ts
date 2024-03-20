namespace ps {
    class ProgressBar extends ps.Behaviour {

        perChange: number
        /** 序列化 */
        private serializableFields: Object = {
            perChange: qc.Serializer.NUMBER
        }
        constructor(gameObject: qc.Node) {
            super(gameObject);
            this.progressBar = gameObject as qc.ProgressBar
        }


        onStart() {

            this.changeByDelta()
        }

        progressBar: qc.ProgressBar
        changeByDelta() {
            let i = 0
            const loop = () => {
                if (i++ > 20) ps.timer.removeFrameLoop(loop)
                console.log(i);
            }
            ps.timer.frameLoop(loop)
        }

        changeToTarget() {

        }


        update() {
            // this.progressBar.value += this.perChange
        }

    }
    qc.registerBehaviour('ps.ProgressBar', ProgressBar);
}