/**
 * Base64接口集
 * @author JingBin
 */
/**
 * 获取base64资源
 * @emphasis 改函数多处用到，无特殊需求勿改名
 */
declare function assetsBase64(): any;
declare let _hasBase64: any;
/**
 * 有base64资源
 * @emphasis 改函数多处用到，无特殊需求勿改名
 */
declare function hasBase64(): any;
declare let dco: any;
declare let dcoConfig: any;
declare let _getDcoConfiged: any;
/** 打印DCO信息 */
declare var args: string[];
/**
 * 获取DCO配置
 */
declare function getDcoConfig(): void;
declare let _hasDcoConfig: any;
/**
 * 有DCO配置
 */
declare function hasDcoConfig(): any;
declare let dcoData: any;
declare let _getDcoDataed: any;
/**
 * 获取DCO数据
 */
declare function getDcoData(): void;
declare let _hasDcoData: any;
/**
 * 有DCO数据
 */
declare function hasDcoData(): any;
declare let dcoRes: any;
declare let _getDcoResed: any;
/**
 * 获取DCO资源
 */
declare function getDcoRes(): void;
declare let _hasDcoRes: any;
/**
 * 有DCO资源
 */
declare function hasDcoRes(): any;
/**
 * 获取DCO中的Key
 * @param {string} key 资源的Key
 */
declare function getDcoKey(key: string): string;
/**
 * 通过资源URL获取资源的Key
 * @param {string} url 资源URL
 * @emphasis 改函数多处用到，无特殊需求勿改名
 */
declare function getKeyByUrl(url: string): string;
/**
 * 通过资源的Key获取64位资源
 * @param {string} key 资源的Key
 * @emphasis 改函数多处用到，无特殊需求勿改名
 */
declare function getAssestByKey(key: string): any;
/**
 * 通过资源URL获取64位资源
 * @param {string} url 资源URL
 * @emphasis 改函数多处用到，无特殊需求勿改名
 */
declare function getAssestByUrl(url: string): string;
/**
 * base64转二进制
 */
declare function basedecode(base64: any): ArrayBuffer;
declare let isSendDone: boolean;
/**
 * 获取查询字符串
 * @param {string} name 需要查询的字符串
 */
declare function getQueryString(name: string): string;
