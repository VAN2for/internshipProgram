/**
 * @author wudm
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 各资源的打包方法
 */

var fs = fsExtra;
var fsEx = FS_EXPAND_D;
var chalk = require('chalk');

// 打包文件的规则（loadDir 时填充）
var PACK_RULE = {};
var PACK_RULE_KEYS = [];

var VALID_EXTS = [];
var metaContentHash = {};

// 读取文件的规则
var readRule = {
    '.png' : 'base64',
    '.gif' : 'base64',
    '.jpeg' : 'base64',
    '.jpg' : 'base64',
    '.mp3' : null,
    '.ogg' : null
};

/**
 * 打包某个目录下的某个文件
 * list指明了额外的文件列表，例如json文件、meta文件等
 */
function toBin(dir, name, list)
{
    if (G.lock) {
        return;
    }
    // 获取匹配的规则
    var packRules = PACK_RULE;
    var ruleNames = PACK_RULE_KEYS;
    var packOkFlag = false;

    for (var idx = 0, len = ruleNames.length; idx < len; idx++) {
        var rule = packRules[ruleNames[idx]];

        // 检测 require 的元素是不是都存在
        var contain = true;
        var requireList = [];
        var mainExt = '';

        // require 在子模块 mod 中配置，形如：
        // [
        //     a,
        //     [ b, c ],
        //     [ d, undefined ],
        //     [ e, '' ]
        // ]
        // 表示需要 4 个文件组成，第一个 a, 第二个是 b 或 c，第三个是 d 或者空（即 d 是可选），第四个是 e 或者空
        // 其中 undefined 跟 '' 的差别是 '' 后续序列化的时候会写入一个 {} 作为占位，而 undefined 直接略过
        for (var idxRequire = 0, ruleLen = rule.require.length; idxRequire < ruleLen; idxRequire++) {
            var extRules = rule.require[idxRequire];
            if (typeof(extRules) !== 'object')
                extRules = [ extRules ];

            var found = false;
            for (var subIdx = 0, extsLen = extRules.length; subIdx < extsLen; subIdx++) {
                var ext = extRules[subIdx];
                if (!ext || !ext.length || list.indexOf(ext) >= 0) {
                    found = true;
                    requireList.push(ext);

                    if ([ undefined, '', '.meta', '.json'].indexOf(ext) < 0)
                    // 记录第一个非 meta/json 的有效文件，其名字（比如 AjaX.png ）将用作 bin 的名字（保留大小写）
                        mainExt = ext;

                    break;
                }
            }
            if (!found) {
                // 这条规则不匹配
                contain = false;
                break;
            }
        }
        if (!contain)
            continue;

        // 指明了有独立的过滤器规则，那么额外检测
        if (typeof(rule.filter) === 'function' && !rule.filter(dir, name, list)) {
            // 过滤器判定不通过
            continue;
        }

        var packStartTime = new Date();

        // 先尝试获取文件名，跟主文件后缀一致（例如 AjaX.png、ajax.atlas 打包出来的 bin 赋名 AjaX.bin）
        var currentDirFiles = fs.readdirSync(dir);
        for (var findex = 0, length = currentDirFiles.length; findex < length; findex++) {
            var fileName = currentDirFiles[findex];
            if (fileName.toLowerCase() === name + mainExt) {
                name = path.parse(fileName).name;
                break;
            }
        }

        // 生成 bin 的名字
        var binRawName;
        if (typeof(rule.binName) === 'function')
            binRawName = rule.binName(name, requireList);
        else
            binRawName = name;

        // 第一个文件的 meta 存活，并且吸收 metaInfo 中的元素
        var binName = path.join(dir, binRawName + '.bin');
        var metaFullPath = binName + '.meta';

        // ctime 界定
        var binTime = fs.existsSync(binName) ? fs.statSync(binName).ctime : undefined;
        var resTime = fs.existsSync(metaFullPath) ? fs.statSync(metaFullPath).ctime : undefined;
        requireList.forEach(function(ext) {
            if (typeof(ext) === 'undefined' || !ext.length)
                return;

            // 读取文本数据
            var iTime = fs.statSync(path.join(dir, name + ext)).ctime;
            if (!resTime || iTime > resTime)
                resTime = iTime;
        });
        if (binTime && resTime && binTime > resTime) {
            if (rule.continuePacking)
                continue;
            else
                break;
        }

        trace("try pack bin : {0}/{1}, list {2}", dir, name, list);

        var metaContent;
        try {
            metaContent = fs.readJsonSync(metaFullPath, {throws: false});
        }
        catch (e) {
            metaContent = null;
        }

        if (!metaContent) {
            metaContent = {};
            if (rule.uuidGenerator)
                metaContent.uuid = rule.uuidGenerator(binName);
            else
                metaContent.uuid = UUID_GENERATOR_D.resUUID(binName);
        }
        var metaContentBackup = JSON.stringify(metaContent);

        metaContent.type = rule.type;
        if (rule.metaInfo) {
            var metaInfo;
            if (typeof(rule.metaInfo) === 'function')
                metaInfo = rule.metaInfo(dir, name, requireList);
            else
                metaInfo = rule.metaInfo;

            if (metaInfo) {
                Object.keys(metaInfo).forEach(function(key) {
                    metaContent[key] = metaInfo[key];
                });
            }
        }

        // 组成成分也需要记录一下
        metaContent.source = cleanList(requireList);

        // 新版ps的龙骨用ani依赖文件
        if (G.config.project.isNewPS && metaContent.animationType === 2) {
            metaContent.source = ['.json', '.png', '.ani'];
        }

        // 新的 meta 文件需回写
        var metaStringifyContent = JSON.stringify(metaContent);
        PACK_D.metaContentHash[metaFullPath] = calcMD5(metaStringifyContent);

        if (metaStringifyContent === metaContentBackup) {
        } else {
            fsEx.writeJsonSync(metaFullPath, metaContent);
        }

        // 写入完毕，编辑器专用的 meta 信息需删除
        delete metaContent.editor;

        // 读取文件
        var contents = [ metaStringifyContent ];
        requireList.forEach(function(ext) {
            if (typeof(ext) === 'undefined') {
                // undefined，不获取内容
                return;
            }
            else if (!ext.length) {
                // 空字符串，需要使用 {} 占位
                contents.push('{}');
            }
            else if (rule.parser) {
                // 有自己的解析规则
                contents.push(rule.parser.call(this, path.join(dir, name + ext), metaContent));
            }
            else {
                // 默认规则
                var style;
                var fileContent;
                var readType;
                if (Object.keys(readRule).indexOf(ext) >= 0)
                    readType = readRule[ext];
                else
                // utf-8 是不配置的时候默认打包方式
                    readType = 'utf-8';

                // 读取文本数据
                fileContent = fs.readFileSync(path.join(dir, name + ext), readType);

                // 去除 bom 头
                if (readType === 'utf-8' &&
                    fileContent.charCodeAt(0) === 0xFEFF)
                    contents.push(fileContent.slice(1));
                else
                    contents.push(fileContent);
            }
        });

        // 打包最终文件
        var finalContent;
        switch (rule.serialize) {
        case 'JSON' : finalContent = SERIALIZER_D.packString(contents); break;
        case 'CONCAT' : finalContent = SERIALIZER_D.packBinary('CONCAT', contents); break;
        case 'DEFLATE' : finalContent = SERIALIZER_D.packBinary('DEFLATE', contents); break;
        }

        // 写入文件中
        fs.writeFileSync(binName, finalContent);
        packOkFlag = true;

        if (!rule.continuePacking)
            // 默认成功打包即退出，除非显式指定 continuePacking
            break;
    }

    // 执行失败
    return packOkFlag;
};

/**
 * 从文件列表中判定当前应该是什么类型的 Asset （用于客户端导入资源的时候询问）
 */
function judgeAssetType(fileNames)
{
    // 只保留所有文件的后缀
    var exts = fileNames;
    for (var idx = 0, len = fileNames.length; idx < len; idx++) {
        exts[idx] = fsEx.extname(fileNames[idx]);
    }

    var packRules = PACK_RULE;
    var ruleNames = PACK_RULE_KEYS;

    // 获取匹配的规则
    for (var idx = 0, len = ruleNames.length; idx < len; idx++) {
        var rule = packRules[ruleNames[idx]];

        // 检测 require 的元素是不是都存在
        var contain = true;
        var requireList = [];
        for (var idxRequire = 0, ruleLen = rule.require.length; idxRequire < ruleLen; idxRequire++) {
            var extRules = rule.require[idxRequire];
            if (typeof(extRules) !== 'object')
                extRules = [ extRules ];

            var found = false;
            for (var subIdx = 0, extsLen = extRules.length; subIdx < extsLen; subIdx++) {
                var ext = extRules[subIdx];
                if (!ext || !ext.length || exts.indexOf(ext) >= 0) {
                    found = true;
                    requireList.push(ext);
                    break;
                }
            }
            if (!found) {
                // 这条规则不匹配
                contain = false;
                break;
            }
        }
        if (contain) {
            return {
                type: rule.type,
                source: cleanList(requireList)
            };
        }
    }

    // 返回未知类型
    return { type : G.ASSET_TYPE.ASSET_UNKNOWN };
};

/**
 * 将列表中的非有效元素过滤
 */
function cleanList(list)
{
    var newList = [];
    list.forEach(function(p) {
        if (p && p.length)
            newList.push(p);
    });
    return newList;
}

/**
 * 当前的后缀名是否是配置中的可识别的文件后缀名
 */
function isValideExt(ext)
{
    return VALID_EXTS.indexOf(ext) >= 0;
}

/**
 * 从 bin 文件中抽取 meta 信息
 */
function extractMetaFromBin(binPath)
{
    if (! fs.existsSync(binPath))
        return;

    var content = fs.readFileSync(binPath);
    if (!content) return {};

    var list;
    if (G.ASSET.IsSound(binPath))
        list = SERIALIZER_D.unpackBinary(content);
    else
        list = SERIALIZER_D.unpackString(content);

    if (!list) return;

    // 解码meta文件
    return JSON.parse(list[0]);
};

// 模块析构函数
function destruct()
{
}

// 模块构造函数
function create()
{
    // 载入子模块
    loadDir('daemons/pack');

    // 所有的资源打包规则，按照 priority 排序（priority 高的优先）
    var packRules = Object.keys(PACK_RULE);
    packRules.sort(function(a, b) {
        var aPriority = PACK_RULE[a].priority || 0;
        var bPriority = PACK_RULE[b].priority || 0;
        return bPriority - aPriority;
    });
    PACK_RULE_KEYS = packRules;

    // 收集当前所有有效的后缀名
    var validExts = [ '.bin', '.meta' ];
    packRules.forEach(function(ext) {
        var rule = PACK_RULE[ext];
        if (!rule.require) return;
        rule.require.forEach(function(require) {
            if (typeof(require) !== 'object')
                require = [ require ];
            require.forEach(function(ext) {
                if (!ext) return;
                if (validExts.indexOf(ext) >= 0) return;
                validExts.push(ext);
            });
        });
    });
    VALID_EXTS = validExts;
}

// 导出模块
global.PACK_D = module.exports = {
    toBin : toBin,
    judgeAssetType : judgeAssetType,
    isValideExt : isValideExt,
    extractMetaFromBin : extractMetaFromBin,
    PACK_RULE : PACK_RULE,
    metaContentHash : metaContentHash,
    destruct : destruct,
    create : create,
}

// 执行模块构造函数
create();
