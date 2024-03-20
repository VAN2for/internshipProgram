/* eslint-disable @typescript-eslint/no-explicit-any */
namespace ps {

    export type XY = {
        x: number;
        y: number;
    };


    /**
     * 
     * @author: hs.lin
     * @date: 2021/01/29 00:11:49
     */
    export class PSUtils {
        public static addClick($node: qc.Node, $onClick: ($target: unknown) => void, $scope?: any) {
            $node.interactive = true;
            $node.onClick.add($onClick, $scope);
        }

        public static displayOnStage($node: qc.Node) {
            // eslint-disable-next-line no-constant-condition
            while (true) {
                if ($node.alpha < 0.01 || !$node.visible) return false;
                $node = $node.parent;
                if (!$node) {
                    return false;
                } else if ($node === UIRoot) {
                    return true;
                }
            }
        }

        /**
         * 递归播放tween group，简易编辑器上用group来进行标识
         * @param $node 
         * @param $group 
         */
        public static playTweenGroupDeep($node: qc.Node, $group = 1, $reset2Beginning = true) {
            this.setTweenGroupPlayingDeep($node, true, $group, $reset2Beginning);
        }

        public static scale2Root($node: qc.Node): number {
            let scale = 1;
            while ($node && $node.scaleX !== undefined) {
                scale *= $node.scaleX;
                $node = $node.parent;
            }
            return scale;
        }

        public static rotation2Root($node: qc.Node): number {
            let rotation = 0;
            while ($node && $node.rotation !== undefined) {
                rotation += $node.rotation;
                $node = $node.parent;
            }
            return rotation;
        }

        public static getUrlParamsObj(): any {
            const result = {};
            const url: string = window.location?.href || "";
            const paramstrs = (url.split("?")[1] || "").split("&");
            paramstrs.forEach($p => {
                if ($p && $p.indexOf("=") !== -1) {
                    const prop = $p.split("=");
                    result[prop[0]] = prop[1];
                }
            });
            return result;
        }

        public static scale($n: qc.Node, $scale: number) {
            $n.scaleX = $n.scaleY = $scale;
        }

        public static pos($n: qc.Node, { x, y }: XY) {
            $n.x = x;
            $n.y = y;
        }

        public static holdScaleAndRotationBeforeSwitchParent($child: qc.Node, $parent: qc.Node) {
            this.holdScaleBeforeSwitchParent($child, $parent);
            this.holdRotationBeforeSwitchParent($child, $parent);
        }

        public static holdScaleBeforeSwitchParent($child: qc.Node, $parent: qc.Node) {
            const c = this.scale2Root($child);
            const p = this.scale2Root($parent);
            $child.scaleX = $child.scaleY = c / p;
        }

        public static holdRotationBeforeSwitchParent($child: qc.Node, $parent: qc.Node) {
            const c = this.rotation2Root($child);
            const p = this.rotation2Root($parent);
            $child.rotation = c - p;
        }

        public static setTweenGroupPlayingDeep($node: qc.Node, isPlaying: boolean, $group = 1, $reset2Beginning = true) {
            const tweens = $node.getScripts(qc.Tween) as qc.Tween[];
            if (tweens && tweens.length) {
                tweens.every($t => {
                    if ($t.tweenGroup === $group) {
                        if (isPlaying) {
                            $t.playGroupForward($reset2Beginning);
                        } else {
                            $reset2Beginning && $t.resetGroupToBeginning();
                            $t.stopGroup();
                        }
                        return false;
                    }
                    return true;
                });
            }
            $node.children.forEach($c => this.setTweenGroupPlayingDeep($c, isPlaying, $group));
        }

        /**
        * 假设parent中有属性item1,item2,item3,...，此方法能返回所有相关item的数组
        * @param $parent 
        * @param $nameSection 
        * @param $beginIndex 
        */
        public static getChildrenByNameSection<CHILD>($parent: any, $nameSection: string, $beginIndex = 1, $filterClass?: any, $isGetChildByName = false): CHILD[] {
            const result: CHILD[] = [];
            // eslint-disable-next-line no-constant-condition
            while (true) {
                const name = $nameSection + $beginIndex;
                const child: CHILD = $isGetChildByName ? $parent.getChildByName(name) : $parent[name];
                if (child) {
                    if (!$filterClass || child instanceof $filterClass) {
                        result.push(child);
                        $beginIndex++;
                    }
                } else {
                    break;
                }
            }
            return result;
        }


        public static bringChild2Top($parent: qc.Node, $childName: string) {
            const child = $parent.getChildByName($childName);
            if (!child) return;
            $parent.setChildIndex(child, Number.MAX_VALUE);
        }

    }
}