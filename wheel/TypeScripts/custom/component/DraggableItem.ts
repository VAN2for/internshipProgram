namespace ps {
    export enum DraggableItemEvent {
        onDown = "onDown", //触控按下
        onUp = "onUp", //触控抬起
        onClick = "onClick", //点击
        onDragStart = "onDragStart", //拖拽开始
        onDragEnd = "onDragEnd", //拖拽结束
        TriggerTarget = "TriggerTarget", //命中目标
        MissTarget = "MissTarget", //错过目标
        toOrgComplete = "toOrgComplete", //返回原处完成时
        toTargetComplete = "toTargetComplete", //返回目标完成时
        HitTarget = "HitTarget", //触碰到目标
        AwayTarget = "AwayTarget", //触碰到目标后离开
    }
    export enum DragSpace {
        World = "World",
        Local = "Local",
    }
    export enum Triggered {
        NORMAL = 0, //无操作
        SET_TO_ORG = 1, //设置到原处
        RETURN_TO_ORG = 2, //缓动到原处
    }
    export enum Missed {
        NORMAL = 0, //无操作
        SET_TO_ORG = 1, //设置到原处
        RETURN_TO_ORG = 2, //缓动到原处
    }

    export let DraggableItemEventId: number;

    /**
     * 拖拽组件
     */
    export class DraggableItem extends Behaviour {
        public itemEvent: EventDispatcher = new EventDispatcher();

        /** 所有可命中目标，用于拖拽检查是否命中，可存在多个目标，遍历命中一个则返回 */
        public allTriggerTargets: qc.Node[];
        /** 目标对象（用于缓动或设置到目标的对象） */
        public targetObj: qc.Node;
        private _worldObj: qc.Node;
        public get worldObj(): qc.Node {
            return this.isDargSpaceWorld
                ? this.game.world
                : this._worldObj || this.game.world;
        }
        public set worldObj(value: qc.Node) {
            this._worldObj = value;
        }

        /** 缓动动画耗时(ms) */
        public returnAnimDuration = 100;
        /** 拖拽时x偏移值 */
        public diffX = 0;
        /** 拖拽时y偏移值 */
        public diffY = 0;
        /** 拖拽时缩放倍数 */
        public diffS = 1;

        public triggered: Triggered = Triggered.SET_TO_ORG; //命中目标后的操作
        public triggerHide = true; //命中目标后，是否自动隐藏

        public missed: Missed = Missed.RETURN_TO_ORG; //错过目标后的操作
        public missHide = false; //错过目标后，是否自动隐藏

        private _dragSpace: DragSpace = DragSpace.World;
        public get dragSpace(): DragSpace {
            return this._dragSpace;
        }
        public set dragSpace(value: DragSpace) {
            this._dragSpace = value;
        }

        public orgX: number;
        public orgY: number;
        public orgS: number;
        public get newS(): number {
            return this.isDargSpaceWorld
                ? this.gameObject.getWorldScale().x
                : this.orgS;
        }
        public orgParent: qc.Node;
        public orgIndex: number;

        public get isDargSpaceWorld() {
            return this.dragSpace === DragSpace.World;
        }

        public get isDargSpaceLocal() {
            return this.dragSpace === DragSpace.Local;
        }

        /** 序列化 */
        public serializableFields = {
            allTriggerTargets: qc.Serializer.NODES,
            targetObj: qc.Serializer.AUTO,
            worldObj: qc.Serializer.AUTO,
            returnAnimDuration: qc.Serializer.AUTO,
            diffX: qc.Serializer.AUTO,
            diffY: qc.Serializer.AUTO,
            diffS: qc.Serializer.AUTO,
            triggered: qc.Serializer.AUTO,
            triggerHide: qc.Serializer.AUTO,
            missed: qc.Serializer.AUTO,
            missHide: qc.Serializer.AUTO,
            dragSpace: qc.Serializer.AUTO,
        };
        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        private set interactive(bol: boolean) {
            this.gameObject.interactive = bol;
        }

        public onInit() {
            if (!this.orgParent) {
                this.orgParent = this.gameObject.parent;
            }
            if (this.orgIndex == void 0) {
                this.orgIndex = this.gameObject.parent.getChildIndex(
                    this.gameObject
                );
            }

            this.interactive = true;
            this.orgX = this.gameObject.x;
            this.orgY = this.gameObject.y;
            this.orgS = this.gameObject.scaleX;

            if (!this.allTriggerTargets?.length) {
                console.info(
                    `当前节点${this.gameObject.name}没配置拖拽目标，请确认是否正确`
                );
            }

            this.gameObject.onDown.add(this._onDown, this);
        }

        private checkAllowTouch(e: qc.PointerEvent) {
            if (DraggableItemEventId != void 0) {
                if (DraggableItemEventId !== e.source.eventId) {
                    return false;
                }
            } else {
                DraggableItemEventId = e.source.eventId;
            }
            return true;
        }

        private _onDown(target: qc.Node, e: qc.PointerEvent) {
            // console.log("onDown", e);
            if (!this.checkAllowTouch(e)) {
                return;
            }

            // if (this.isDargSpaceWorld) {
            // const pos = this.gameObject.parent.toGlobal(new qc.Point(this.gameObject.x, this.gameObject.y));
            // pos = this.worldObj.toLocal(pos);
            this.gameObject.scaleX = this.gameObject.scaleY =
                this.newS * this.diffS;
            this.worldObj.addChild(this.gameObject);
            // this.gameObject.x = pos.x + this.diffX;
            // this.gameObject.y = pos.y + this.diffY;
            // this.gameObject.scaleX = this.gameObject.scaleY = this.orgS * this.diffS;

            const pointer = e.source;
            const gP = new qc.Point(pointer.x, pointer.y);
            const p = this.gameObject.parent.toLocal(gP);
            this.gameObject.x = p.x + this.diffX;
            this.gameObject.y = p.y + this.diffY;
            // this.gameObject.scaleX = this.gameObject.scaleY = this.newS * this.diffS;
            Tween.to(
                this.gameObject,
                {
                    scale: this.newS * this.diffS,
                },
                this.returnAnimDuration,
                Phaser.Easing.Cubic.Out
            );
            // }

            this._hasDradEnd = false;
            this.itemEvent.dispatch(DraggableItemEvent.onDown, e);

            this.addOtherEvent();
        }

        private addOtherEvent() {
            this.gameObject.onDragStart.addOnce(this._onDragStart, this);
            this.gameObject.onDrag.add(this._onDrag, this);
            this.gameObject.onDragEnd.addOnce(this._onDragEnd, this);
            this.gameObject.onClick.addOnce(this._onClick, this);
            this.gameObject.onUp.addOnce(this._onUp, this);
        }

        private removeOtherEvent() {
            this.gameObject.onDragStart.remove(this._onDragStart, this);
            this.gameObject.onDrag.remove(this._onDrag, this);
            this.gameObject.onDragEnd.remove(this._onDragEnd, this);
            this.gameObject.onClick.remove(this._onClick, this);
            this.gameObject.onUp.remove(this._onUp, this);
        }

        private _onDragStart(target: qc.Node, e: qc.DragStartEvent) {
            // console.log("_onDragStart", target, e);
            if (!this.checkAllowTouch(e)) {
                return;
            }
            // if (this.isDargSpaceWorld) {
            //     const target = this.gameObject
            //     let pos = target.parent.toGlobal(new qc.Point(target.x, target.y))
            //     pos = this.worldObj.toLocal(pos)
            //     this.worldObj.addChild(target)
            //     target.x = pos.x + this.diffX
            //     target.y = pos.y + this.diffY
            //     target.scaleX = target.scaleY = this.orgS * this.diffS
            // }
            this.itemEvent.dispatch(DraggableItemEvent.onDragStart, e);
        }

        private _onDrag(target: qc.Node, e: qc.DragEvent) {
            // console.log("_onDrag", target.parent.name, e);
            if (!this.checkAllowTouch(e)) {
                return;
            }
            const pointer = e.source as qc.Pointer;
            const gP = new qc.Point(pointer.x, pointer.y);
            const p: qc.Point = target.parent.toLocal(gP);
            target.x = p.x + this.diffX;
            target.y = p.y + this.diffY;

            const hitTarget = this.checkHitTargetArea(gP);
            if (hitTarget) {
                if (this.lastHitTarget && this.lastHitTarget != hitTarget) {
                    this.itemEvent.dispatch(
                        DraggableItemEvent.AwayTarget,
                        e,
                        this.lastHitTarget
                    );
                    this.lastHitTarget = null;
                }
                this.lastHitTarget = hitTarget;
                this.itemEvent.dispatch(
                    DraggableItemEvent.HitTarget,
                    e,
                    hitTarget
                );
            } else if (this.lastHitTarget) {
                this.itemEvent.dispatch(
                    DraggableItemEvent.AwayTarget,
                    e,
                    this.lastHitTarget
                );
                this.lastHitTarget = null;
            }
        }

        private lastHitTarget: qc.Node;

        public checkHitTargetArea(globalPoint: qc.Point) {
            if (!this.allTriggerTargets?.length) {
                return;
            }
            for (const target of this.allTriggerTargets) {
                if (!target || !target.parent) continue;
                if (target.rectContains(globalPoint)) return target;
            }
        }

        private _onDragEnd(target: qc.Node, e: qc.DragEndEvent) {
            // console.log("_onDragEnd", target, e);
            if (!this.checkAllowTouch(e)) {
                return;
            }
            this.dragEnd(e);
            this.itemEvent.dispatch(DraggableItemEvent.onDragEnd, e);
            if (this.lastHitTarget) {
                this.itemEvent.dispatch(
                    DraggableItemEvent.AwayTarget,
                    e,
                    this.lastHitTarget
                );
                this.lastHitTarget = null;
            }

            DraggableItemEventId = null;
            this.removeOtherEvent();
        }

        private _onUp(target: qc.Node, e: qc.PointerEvent) {
            // console.log("_onUp", target, e);
            if (!this.checkAllowTouch(e)) {
                return;
            }
            this.dragEnd(e);
            this.itemEvent.dispatch(DraggableItemEvent.onUp, e);
            if (this.lastHitTarget) {
                this.itemEvent.dispatch(
                    DraggableItemEvent.AwayTarget,
                    e,
                    this.lastHitTarget
                );
                this.lastHitTarget = null;
            }

            DraggableItemEventId = null;
            this.removeOtherEvent();
        }

        private _onClick(target: qc.Node, e: qc.ClickEvent) {
            // console.log("_onClick", target, e);
            if (!this.checkAllowTouch(e)) {
                return;
            }
            this.itemEvent.dispatch(DraggableItemEvent.onClick, e);
        }

        private _hasDradEnd = false;

        public dragEnd(e: qc.DragEndEvent | qc.PointerEvent) {
            if (this._hasDradEnd) {
                return;
            }
            this._hasDradEnd = true;
            this.interactive = false;

            /** 命中目标后 */
            const triggered = () => {
                switch (this.triggered) {
                    case Triggered.NORMAL:
                        this.interactive = true;
                        break;
                    case Triggered.SET_TO_ORG:
                        this.setToOrgPos();
                        break;
                    case Triggered.RETURN_TO_ORG:
                        this.returnToOrgPos();
                        break;
                }
                if (this.triggerHide) this.gameObject.visible = false;
                this.itemEvent.dispatch(
                    DraggableItemEvent.TriggerTarget,
                    e,
                    hitTarget
                );
            };

            /** 错过目标后 */
            const missed = () => {
                switch (this.missed) {
                    case Missed.NORMAL:
                        break;
                    case Missed.SET_TO_ORG:
                        this.setToOrgPos();
                        break;
                    case Missed.RETURN_TO_ORG:
                        this.returnToOrgPos();
                        break;
                }
                if (this.missHide) this.gameObject.visible = false;
                this.itemEvent.dispatch(DraggableItemEvent.MissTarget, e);
            };

            if (!this.allTriggerTargets) {
                missed();
                return;
            }
            const hitTarget = this.checkHitTargetArea(
                this.gameObject.getWorldPosition()
            );
            if (e instanceof qc.DragEndEvent && hitTarget) {
                triggered();
                // console.log('TriggerTarget');
            } else {
                missed();
                // console.log('MissTarget');
            }
        }

        /** 缓动到原处 */
        public returnToOrgPos() {
            const target = this.gameObject;
            let orgX = this.orgX;
            let orgY = this.orgY;
            const orgS = this.newS;

            const onComplete = () => {
                this.interactive = true;
                // if (this.isDargSpaceWorld) {
                this.setToOrgPos();
                // }
                this.itemEvent.dispatch(DraggableItemEvent.toOrgComplete);
            };

            // if (this.isDargSpaceWorld) {
            let pos = this.orgParent.toGlobal(new qc.Point(orgX, orgY));
            pos = target.parent.toLocal(pos);
            orgX = pos.x;
            orgY = pos.y;
            // }

            if (target.x !== orgX || target.y !== orgY) {
                Tween.to(
                    target,
                    { x: orgX, y: orgY, scale: orgS },
                    this.returnAnimDuration
                ).onComplete.addOnce(onComplete);
            } else {
                target.x = orgX;
                target.y = orgY;
                onComplete();
            }
        }

        /** 设置到原处 */
        public setToOrgPos() {
            const target = this.gameObject;
            // if (this.isDargSpaceWorld) {
            this.orgParent.addChildAt(
                target,
                Math.min(this.orgIndex, this.orgParent.children.length)
            );
            // }
            target.x = this.orgX;
            target.y = this.orgY;
            target.scaleX = target.scaleY = this.orgS;
        }

        /** 缓动到目标处 */
        public returnToTarget(offset?: qc.Node, target = this.targetObj) {
            if (!target || !target.parent) return;
            let targetX = target.x;
            let targetY = target.y;

            const onComplete = () => {
                this.gameObject.scaleX = scale;
                this.gameObject.scaleY = scale;
                this.setToTarget(offset, target);
                this.itemEvent.dispatch(
                    DraggableItemEvent.toTargetComplete,
                    target
                );
            };

            // if (this.isDargSpaceWorld) {
            let pos = this.gameObject.parent.toGlobal(
                new qc.Point(this.gameObject.x, this.gameObject.y)
            );
            pos = this.worldObj.toLocal(pos);
            const scale = this.worldObj.getWorldScale().x * this.diffS;
            this.worldObj.addChild(this.gameObject);
            this.gameObject.x = pos.x;
            this.gameObject.y = pos.y;
            // }

            // let pos = target.parent.toGlobal(new qc.Point(targetX, targetY));
            // pos = this.gameObject.parent.toLocal(pos);
            targetX = pos.x;
            targetY = pos.y;

            if (offset) {
                targetX += offset.x;
                targetY += offset.y;
            }

            if (
                this.gameObject.x !== targetX ||
                this.gameObject.y !== targetY
            ) {
                Tween.to(
                    this.gameObject,
                    { x: targetX, y: targetY, scale },
                    this.returnAnimDuration
                ).onComplete.addOnce(onComplete);
            } else {
                onComplete();
            }
        }

        /** 设置到目标处 */
        public setToTarget(offset?: qc.Node, target = this.targetObj) {
            if (!target || !target.parent) return;
            target.parent.addChildAt(
                this.gameObject,
                target.parent.getChildIndex(target) + 1
            );
            let targetX = target.x;
            let targetY = target.y;

            if (offset) {
                targetX += offset.x;
                targetY += offset.y;
            }
            this.gameObject.x = targetX;
            this.gameObject.y = targetY;
        }
    }

    qc.registerBehaviour("DraggableItem", DraggableItem);
    DraggableItem["__menu"] = "Custom/DraggableItem";
}
