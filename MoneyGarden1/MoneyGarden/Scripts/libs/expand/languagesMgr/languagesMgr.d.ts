/**
 * 多语言系统接口，描述文件
 * @version 当前版本: 1.7.0
 * @description 多语言自适应Playable，所有处理接口管理器
 * @author JingBin.Zhu
 */
declare namespace languagesMgr {

    /** 版本号 */
    const version: string;

    /**
     * 获取资源
     * @method getQueryString
     * @param {string} name 需要查询的参数
     * @returns {string} 查询到的参数值
     */
    const getQueryString: (name: string) => string;

    /** 当前使用语言 */
    const language: string;

    /**
     * 当前兜底语言
     * @private
     */
    const _fallbackLocale: string;

    /** 当前使用语言 */
    const fallbackLocale: string;

    /**
     * 资源接口异常警告
     * @method _notFoundResWarn
     * @returns {void}
     * @private
     */
    const _notFoundResWarn: () => void;

    /**
     * 配置中Key异常警告
     * @method _notCfgForKeyWarn
     * @param {string} lang 当前语言
     * @param {string} key 对应文案，配置中的key
     * @returns {void}
     * @private
     */
    const _notCfgForKeyWarn: (lang: string, key: string) => void;

    /**
     * 图片资源URL或Key异常警告
     * @method _notImgForUrlWarn
     * @param {string} lang 当前语言
     * @param {string} url 当前语言图片资源URL或Key
     * @returns {void}
     * @private
     */
    const _notImgForUrlWarn: (lang: string, url: string) => void;

    /**
     * 配置中无对应语言信息打印
     * @method _notLangCfgInfo
     * @param {string} lang 当前语言
     * @param {string} _lang 备用语言
     * @returns {void}
     * @private
     */
    const _notLangCfgInfo: (lang: string, _lang: string) => void;

    /**
     * 配置中无对应语言，使用兜底语言信息打印
     * @method _notLangUseFallbackInfo
     * @param {string} lang 当前语言
     * @returns {void}
     * @private
     */
    const _notLangUseFallbackInfo: (lang: string) => void;

    /**
     * 获取多语言配置
     * @method getRes
     * @returns {Object} 当前多语言配置
     */
    const getRes: () => Object;

    /** 
     * 获取当前使用语言
     * @method getLang
     * @param {srting} lang 指定语言，一版用于调试，如有传值，优先使用该语言
     * @param {boolean} hasLog 是否需要打印日志提示，默认为：false
     * @returns {string} 当前使用语言
     */
    const getLang: (lang?: string, hasLog?: boolean) => string;

    /** 
     * 获取对应语言版本配置
     * @method getLangCfg
     * @param {string} key 对应文案，配置中的key
     * @param {string} lang 语言
     * @param {boolean} hasLog 是否需要打印日志提示，默认为：false
     * @returns {Object} 对应语言版本配置
     */
    const getLangCfg: (key: string, lang: string, hasLog?: boolean) => {
        value: string, // 当前配置项的值
        style: {
            fontSize: number, // 字体大小
            color: string | number[], // 字体颜色 / '#rgb'('#000000') | [r, g, b]
            alpha: number, // 字体透明度 / 0 ~ 1
            stroke: number, // 边框大小
            strokeColor: string | number[], // 边框颜色 / '#rgb'('#000000') | [r, g, b] | '#argb'('#ff000000') | [r, g, b, a]
            bold: boolean, // 是否为粗体
            italic: boolean, // 是否为斜体
            enableShadow: boolean, // 是否启用阴影
            shadowColor: string | number[], // 阴影颜色 / '#rgb'('#000000') | [r, g, b] | '#argb'('#ff000000') | [r, g, b, a]
            shadowBlur: number, // 阴影模糊大小
            shadowOffsetX: number, // 阴影偏移量X
            shadowOffsetY: number, // 阴影偏移量Y
            gradient: boolean, // 是否启用渐变颜色
            startColor: string | number[], // 渐变开始颜色 / '#rgb'('#000000') | [r, g, b] | '#argb'('#ff000000') | [r, g, b, a]
            endColor: string | number[], // 渐变结束颜色 / '#rgb'('#000000') | [r, g, b] | '#argb'('#ff000000') | [r, g, b, a]
            enableGlow: boolean, // 是否启用外发光
            glowColor: string | number[], // 外发光颜色 / '#rgb'('#000000') | [r, g, b] | '#argb'('#ff000000') | [r, g, b, a]
            glowBlur: number, // 外发光模糊大小
        }
    };

    /** 
     * 获取当前语言版本配置
     * @method getCfg
     * @param {string} key 对应文案，配置中的key
     * @param {boolean} hasLog 是否需要打印日志提示，默认为：false
     * @param {srting} lang 指定语言，一版用于调试，如有传值，优先使用该语言
     * @returns {Object} 当前语言版本配置
     */
    const getCfg: (key: string, hasLog?: boolean, lang?: string) => {
        value: string, // 当前配置项的值
        style: {
            fontSize: number, // 字体大小
            color: string | number[], // 字体颜色 / '#rgb'('#000000') | [r, g, b]
            alpha: number, // 字体透明度 / 0 ~ 1
            stroke: number, // 边框大小
            strokeColor: string | number[], // 边框颜色 / '#rgb'('#000000') | [r, g, b] | '#argb'('#ff000000') | [r, g, b, a]
            bold: boolean, // 是否为粗体
            italic: boolean, // 是否为斜体
            enableShadow: boolean, // 是否启用阴影
            shadowColor: string | number[], // 阴影颜色 / '#rgb'('#000000') | [r, g, b] | '#argb'('#ff000000') | [r, g, b, a]
            shadowBlur: number, // 阴影模糊大小
            shadowOffsetX: number, // 阴影偏移量X
            shadowOffsetY: number, // 阴影偏移量Y
            gradient: boolean, // 是否启用渐变颜色
            startColor: string | number[], // 渐变开始颜色 / '#rgb'('#000000') | [r, g, b] | '#argb'('#ff000000') | [r, g, b, a]
            endColor: string | number[], // 渐变结束颜色 / '#rgb'('#000000') | [r, g, b] | '#argb'('#ff000000') | [r, g, b, a]
            enableGlow: boolean, // 是否启用外发光
            glowColor: string | number[], // 外发光颜色 / '#rgb'('#000000') | [r, g, b] | '#argb'('#ff000000') | [r, g, b, a]
            glowBlur: number, // 外发光模糊大小
        }
    };

    /**
     * 返回指定单个颜色通道值的16进制字符串。
     * @method componentToHex
     * @param {number} color - 要获取的16进制值的颜色通道，范围必须是 0 到 255 之间
     * @returns {string} 长度为 2 个字符的字符串，即 255 = ff，100 = 64
     */
    const componentToHex: (color: number) => string;

    /**
     * 格式化Hex值
     * @method _formatHex
     * @param {string} hex - 16进制颜色，格式为：rgb | rgba | #rgb | #argb
     * @returns {string} 少位补0，最多位只取前面8位。格式为：#rgb | #argb
     * #faa         -> #000faa
     * #ffaaa       -> #0ffaaa
     * #0fffaaa     -> #00fffaaa
     * #fffaaa000   -> #fffaaa00
     * @private
     */
    const _formatHex: (hex: string) => string;

    /**
     * 格式化Alpha值
     * @method _formatAlpha
     * @param {number} alpha - 待格式化Alpha值
     * @returns {number} 格式化后的Alpha值，范围：0 ~ 1
     * @private
     */
    const _formatAlpha: (alpha: number) => number;

    /**
     * Hex值转换16进制数值
     * @method _hexTo16
     * @param {string} hex - 待转换Hex值
     * @returns {number} 转换后的Hex值，范围：0 ~ 255
     * @private
     */
    const _hexTo16: (hex: string) => number;

    /**
     * 转换16进制的字符串为rgba
     * @method _hexToColor
     * @param {string} hex - 16进制颜色，格式为：#rgb | #argb
     * @returns {{ r: number, g: number, b: number, a?: number }} 如：{r: 255, g: 255, b: 255, a: 1}
     * @private
     */
    const _hexToColor: (hex: string) => { r: number, g: number, b: number, a?: number };

    /**
     * 颜色值转换
     * '0xrgb'  -> 0xFFFFFF
     * '#rgb'   -> #FFFFFF
     * '#argb'  -> #80FFFFFF
     * '#rgba'  -> #FFFFFF80
     * 'rgb'    -> RGB(100, 100, 100)
     * 'rgba'   -> RGBA(100, 100, 100, 0.5)
     * @method colorTransform
     * @param {string|number[]} color 待转换颜色值
     * color 支持以下格式：
     * FFFFFF
     * #FFFFFF
     * [100, 100, 100]
     * [100, 100, 100, 0.5]
     * @param {'0xrgb'|'#rgb'|'#rgba'|'#argb'|'rgb'|'rgba'} patten 转换格式
     * @return {string|number} 颜色值对应格式转换结果
     */
    const colorTransform: (color: string | number[], patten: '0xrgb' | '#rgb' | '#rgba' | '#argb' | 'rgb' | 'rgba') => string | number;

    /**
     * 根据配置中的key，更新当前文本控件
     * @method updateLabel
     * @param {eui.Label|Laya.Label|laya.display.Text|qc.UIText|Phaser.Text} label 需要更新的文本控件
     * @param {string} key 对应文案，配置中的key
     * @param {boolean} hasLog 是否需要打印日志提示，默认为：false
     * @param {srting} lang 指定语言，一版用于调试，如有传值，优先使用该语言
     * @returns {boolean} 是否更新成功
     */
    const updateLabel: (label, key: string, hasLog?: boolean, lang?: string) => boolean;

    /**
     * 根据图片名称前缀，更新当前图片控件
     * @method updateImage
     * @param {eui.Image|Laya.Image} image 需要更新的图片控件
     * @param {boolean} hasLog 是否需要打印日志提示，默认为：false
     * @param {srting} lang 指定语言，一版用于调试，如有传值，优先使用该语言
     * @returns {boolean} 是否更新成功
     */
    const updateImage: (image, hasLog?: boolean, lang?: string) => boolean;

}