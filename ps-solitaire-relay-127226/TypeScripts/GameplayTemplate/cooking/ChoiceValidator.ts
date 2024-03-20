namespace ps {
    /**
     * 答案，选项编号（从`0`开始的整数）在答案中的位置
     *
     * 数组长度会认为是答案总长度
     *
     * ```text
     * No.0 No.1 No.2 No.3  No.4
     * [  5,   3,   1,   0,   2]
     * ```
     */
    export type Answer = number[];

    type Choice = {
        /** 位置是否占用 */
        chosen: boolean;
        /** 选项编号 */
        id: number;
    };

    /**
     * 目前选择中有哪些内容
     */
    type Choices = Choice[];

    export type ChooseResult = {
        /** 选择最终放入选项空位的编号 */
        choiceIdx: number;
        /** 是否还有空位 */
        isFull: boolean;
    };

    export type ChoiceCurrentStatus = {
        /** 选择是否正确 */
        isCorrect: boolean;
        /** 选择是否部分正确 */
        partialCorrect: boolean;
    };
    /**
     * ChoiceValidator
     * @description ChoiceValidator
     * @author bin
     * @date 2022/12/19 23:20:31
     */
    export class ChoiceValidator extends Behaviour {
        constructor(gameObject: qc.Node) {
            super(gameObject);
        }

        private serializableFields: unknown = {};

        public set answer(next: Answer) {
            this.answer_ = next;
            this.clearChoices();
        }

        public clearChoices() {
            this.choices = Array.from(
                { length: this.answer_.length },
                (_v, _k) => ({
                    chosen: false,
                    id: -1,
                })
            );
            this.chosenSize_ = 0;
        }

        private answer_: Answer = [];
        private choices: Choices = [];
        private chosenSize_: number = 0;

        /**
         * 选择编号为`id`的选项
         * @param id 选项编号，从`0`开始
         * @returns 最终放入空位的结果
         */
        public choose(id: number): ChooseResult {
            debugAssert(id >= 0, "选项编号 %d 不符合要求", id);

            if (this.chosenSize_ === this.answer_.length) {
                return {
                    choiceIdx: -1,
                    isFull: true,
                };
            }

            const availableRecords = this.getAvailableChoices(id);
            if (availableRecords.length === 0) {
                // 对应编号的所有答案中的位置都被占用或者选项不在答案中
                return this.placeInNextEmptyChoice(id);
            }

            const [fst] = availableRecords;
            return this.placeInChoice(id, fst.choiceIdx);
        }

        private placeInNextEmptyChoice(id: number) {
            let nextEmptyChoiceIdx = -1;
            const n = this.choices.length;
            for (let i = 0; i < n; i++) {
                if (this.choices[i].chosen) {
                    continue;
                }

                nextEmptyChoiceIdx = i;
                break;
            }

            return this.placeInChoice(id, nextEmptyChoiceIdx);
        }

        private placeInChoice(id: number, choiceIdx: number) {
            const choice = this.choices[choiceIdx];
            choice.chosen = true;
            choice.id = id;
            this.chosenSize_ += 1;

            return {
                choiceIdx,
                isFull: false,
            };
        }

        private getAvailableChoices(id: number) {
            return this.answer_
                .map((id, i) => ({
                    id,
                    choiceIdx: i,
                }))
                .filter(
                    ({ id: answerId, choiceIdx }) =>
                        answerId === id && !this.choices[choiceIdx].chosen
                );
        }

        /**
         * 返回当前选择是否正确
         */
        public get currentStatus(): ChoiceCurrentStatus {
            if (this.chosenSize_ > this.answer_.length) {
                return {
                    isCorrect: false,
                    partialCorrect: false,
                };
            }

            const counter: Map<number, number> = new Map();
            this.answer_.forEach((ans) => {
                counter.set(ans, (counter.get(ans) ?? 0) + 1);
            });

            for (const { id } of this.choices.filter(
                (choice) => choice.chosen
            )) {
                if (!counter.has(id) || counter.get(id) === 0) {
                    return {
                        isCorrect: false,
                        partialCorrect: false,
                    };
                }

                counter.set(id, counter.get(id) - 1);
            }

            const partialCorrect = [...counter.values()].some((n) => n > 0);
            return {
                isCorrect: true,
                partialCorrect,
            };
        }

        /**
         * 获取下一个正确答案
         *
         * 如果没有下一个正确答案，则返回`-1`
         */
        public get nextAnswer() {
            const answerCounter: Map<number, number> = new Map();
            this.answer_.forEach((ans) => {
                answerCounter.set(ans, (answerCounter.get(ans) ?? 0) + 1);
            });

            const choiceCounter: Map<number, number> = new Map();
            this.choices
                .filter((choice) => choice.chosen)
                .forEach(({ id }) => {
                    choiceCounter.set(id, (choiceCounter.get(id) ?? 0) + 1);
                });

            for (const [id, count] of choiceCounter) {
                if (!answerCounter.has(id)) {
                    continue;
                }

                answerCounter.set(id, answerCounter.get(id) - count);
            }

            for (const [id, count] of answerCounter) {
                if (count > 0) {
                    return id;
                }
            }
            return -1;
        }

        /**
         * 当前已选择数量
         */
        public get chosenSize() {
            return this.chosenSize_;
        }
    }
    qc.registerBehaviour("ps.ChoiceValidator", ChoiceValidator);

    function debugAssert(cond: boolean, ...data: unknown[]) {
        if (ps.ENV === "DEBUG") {
            console.assert(cond, ...data);
        }
    }
}
