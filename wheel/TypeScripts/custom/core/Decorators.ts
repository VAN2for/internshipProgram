/**
 * 标记一个类是过时的
 * @param newName 新类名称
 */
function ObsoleteClass(newName: string) {
    return function replace<T extends { new(...args: any[]): {} }>(target: T) {
        return class extends target {
            constructor(...args: any[]) {
                super(...args);
                let fun = target as any;
                if (ps.ENV === "DEBUG") console.error(`${fun.name} 已过时，请使用 ${newName}`);
            }
        }
    }
}
/**
 * 标记一个方法是过时的
 * @param newName 新方法名称
 * @param oldName (可选)旧方法名称,可自动识别，识别有问题的需手动输入
 */
function ObsoleteMethod(newName: string, oldName?: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const oldFunction = target[propertyKey];
        const newFunction = function (...args: any[]) {
            if (ps.ENV === "DEBUG") console.error(`${oldName} 已过时，请使用 ${newName}`);
            return oldFunction.call(target, ...args);
        }
        descriptor.value = newFunction; // 替换原声明
    }
}
// /**
//  * 标记一个属性是过时的
//  * @param newMethodName 新方法名称
//  * @param oldMethodName (可选)旧方法名称,可自动识别，识别有问题的需手动输入
//  */
// function ObsoleteV() {

// }
// let listt = {};
// function sumCount(name: string) {
//     if (listt[name] != undefined) {
//         listt[name]++;
//     } else {
//         listt[name] = 1;
//     }
//     console.log(listt);
// }

// function useCount<T extends { new(...args: any[]): {} }>(target: T) {
//     return class extends target {
//         constructor(...args: any[]) {
//             super(...args);
//             if (ps.ENV === "DEBUG") {
//                 sumCount(target.name);
//             }
//         }
//     }
// }
