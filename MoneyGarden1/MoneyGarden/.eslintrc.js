module.exports = {
    "env": {
        "browser": true,
        "es2020": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        // "plugin:react/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        // "plugin:react-hooks/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 11,
        "sourceType": "module"
    },
    "plugins": [
        // "react",
        "@typescript-eslint"
    ],
    "rules": {
        "@typescript-eslint/ban-ts-comment": "off",//允许使用//@ts-ignore
        "@typescript-eslint/no-namespace": "off",//暂时先允许用命名空间吧
        "@typescript-eslint/explicit-module-boundary-types": "off",//关闭返回值判断
        "@typescript-eslint/no-empty-function": "warn",
        "@typescript-eslint/semi": "warn",
        "@typescript-eslint/no-this-alias": "off",
        "@typescript-eslint/class-name-casing": "off",//去掉类名命名要求（驼峰，帕斯卡都行）
        "no-throw-literal": "warn",
        "semi": "off",
        "no-async-promise-executor": "off",
        "no-self-assign": "off",
        // "react-hooks/rules-of-hooks": "error",
        // "react-hooks/exhaustive-deps": "warn",
        // "react/display-name": "off",
        "curly": "off"
    }
};
