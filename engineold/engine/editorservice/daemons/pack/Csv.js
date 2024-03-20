/**
 * @author chenx
 * 2018.5.14
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * CSV打包规则，直接采用 text 的打包规则
 */

PACK_D.PACK_RULE.csv = {
    type : G.ASSET_TYPE.ASSET_TEXT,
    require : [
        '.csv'
    ],
    serialize : 'JSON'
};
