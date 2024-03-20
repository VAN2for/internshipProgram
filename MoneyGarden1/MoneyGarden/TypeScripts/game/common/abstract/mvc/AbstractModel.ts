namespace ps {
    import BaseEventDispatcher = ps.BaseEventDispatcher;
    /**
     * mvc中model的抽象类，主要抽象出事件处理逻辑。使用方法：class MarryArenaModel extends AbstractModel<MarryArenaModel>
     * @author: sen
     * @date: 2020/04/08 23:19:18
     * @template SUB_MODEL_CLASS 继承AbstractModel的子类，一般传当前定义的model的类，其实主要是用来做事件类型（EVENT）的代码提示和编译时类型验证，on，off，try2ChangeValueNEmitEvent，emit时用到。
     * @template OMIT_EVENT 不希望被监听的事件类型，一般不用传，除非想事件类型需要增加更精确的额外过滤，如果传，则为为如下格式："on"|"off"。
     * @template EXTRA_EVENT 希望额外被监听的事件类型，一般不用传，除非想事件类型需要增加更精确的判断类型，如果传，则为为如下格式："on"|"off"。
     * @template EVENT 本model支持的事件类型，一般不用传，因为默认依据SUB_MODEL_CLASS做了过滤。
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export abstract class AbstractModel<SUB_MODEL_CLASS extends AbstractModel<any>, OMIT_EVENT extends keyof SUB_MODEL_CLASS = never, EXTRA_EVENT = never, EVENT = keyof Omit<SUB_MODEL_CLASS, (keyof AbstractModel<any, never, never, any>) | OMIT_EVENT> | EXTRA_EVENT> extends BaseEventDispatcher<EVENT> {
        /**
         * 修改属性。修改前会进行全等(===)判断，不全等才会进行赋值并且派发事件，事件名字和属性setter getter名字一样。
         */
        public try2Set($propName: EVENT, $value: unknown, $force = false) {
            if (!this.isValid) return;
            const localPropName = `_${$propName}`;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const thiz: any = this;
            if (thiz[localPropName] !== $value || $force) {
                thiz[localPropName] = $value;
                this.emit($propName, $value);
            }
        }
    }
}