namespace ps {

    /**
     * Element GUI 接口文件
     * @author bin
     * @date 2023/03/23 20:35:28
     * @see https://confluence.mobvista.com/pages/viewpage.action?pageId=82914678
     * @see https://gitlab.mobvista.com/playable/el-schema-form
     * @see https://element.eleme.cn
     */
    export interface ElementGui {
        createGui(): GuiType;
    }

    export type GuiType = Record<
        string,
        GuiTypeInt |
        GuiTypeInts |
        GuiTypeNumber |
        GuiTypeNumbers |
        GuiTypeBoolean |
        GuiTypeBooleans |
        GuiTypeString |
        GuiTypeStrings |
        GuiTypeMapping |
        GuiTypeTexture |
        GuiTypeTextures |
        // 暂不支持
        // GuiTypeAudio |
        // GuiTypeAudios |
        GuiTypeColor |
        GuiTypeColors |
        GuiTypePrefab |
        GuiTypePrefabs |
        GuiTypeNode |
        GuiTypeNodes |
        // 暂不支持
        // GuiTypeScript |
        // GuiTypeScripts |
        // GuiTypeGeom |
        // GuiTypeGeoms |
        GuiTypePoint |
        GuiTypePoints |
        // 暂不支持
        // GuiTypeRectangle |
        // GuiTypeCircle |
        // GuiTypeEllipse |
        // GuiTypeFont |
        // GuiTypeFonts |
        // GuiTypeFilter |
        // GuiTypeFilters |
        // GuiTypeTextasset |
        // GuiTypeTextassets |
        // GuiTypeExcelasset |
        // GuiTypeExcelassets |
        GuiTypeSelect |
        GuiTypeCustomEvent
    >;

    /** 输入框控件（字符串/数字） */
    type ComponentInput = "input";
    /** 整数控件 */
    type ComponentInt = "int";
    /** 整数数组控件 */
    type ComponentInts = "ints";
    /** 开关控件 */
    type ComponentSwitch = "switch";
    /** 开关控件数组 */
    type ComponentSwitches = "switches";
    /** 数值对控件 */
    type ComponentMapping = "mapping";
    /** 纹理控件 */
    type ComponentTexture = "texture";
    /** 纹理数组控件 */
    type ComponentTextures = "textures";
    // 暂不支持
    // /** 声音控件 */
    // type ComponentAudio = "audio";
    // /** 声音数组控件 */
    // type ComponentAudios = "audios";
    /** 颜色控件 */
    type ComponentColorPicker = "color-picker";
    /** 颜色数组控件 */
    type ComponentColorsPicker = "colors-picker";
    /** 预制控件 */
    type ComponentPrefab = "prefab";
    /** 预制数组控件 */
    type ComponentPrefabs = "prefabs";
    /** 节点控件 */
    type ComponentNode = "node";
    /** 节点数组控件 */
    type ComponentNodes = "nodes";
    // 暂不支持
    // /** 逻辑脚本控件 */
    // type ComponentScript = "script";
    // /** 逻辑脚本数组控件 */
    // type ComponentScripts = "scripts";
    // /** 几何体控件 */
    // type ComponentGeom = "geom";
    // /** 几何体数组控件 */
    // type ComponentGeoms = "geoms";
    /** 点控件 */
    type ComponentPoint = "point";
    /** 点数组控件 */
    type ComponentPoints = "points";
    // 暂不支持
    // /** 矩形控件 */
    // type ComponentRectangle = "rectangle";
    // /** 圆控件 */
    // type ComponentCircle = "circle";
    // /** 椭圆控件 */
    // type ComponentEllipse = "ellipse";
    // /** 字体控件 */
    // type ComponentFont = "font";
    // /** 字体数组控件 */
    // type ComponentFonts = "fonts";
    // /** 着色器控件 */
    // type ComponentFilter = "filter";
    // /** 着色器数组控件 */
    // type ComponentFilters = "filters";
    // /** 文本资源控件 */
    // type ComponentTextasset = "textasset";
    // /** 文本资源数组控件 */
    // type ComponentTextassets = "textassets";
    // /** Excel文件资源控件 */
    // type ComponentExcelasset = "excelasset";
    // /** Excel文件资源数组控件 */
    // type ComponentExcelassets = "excelassets";
    /** 下拉列表控件 */
    type ComponentSelect = "select";
    /** 自定义事件控件 */
    type ComponentCustomEvent = "customEvent";


    /** 数字类型字段 */
    type FieldTypeNumber = "number";
    /** 数字类型数组字段 */
    type FieldTypeNumbers = "numbers";
    /** 字符串类型字段 */
    type FieldTypeString = "string";
    /** 字符串类型数组字段 */
    type FieldTypeStrings = "strings";


    /** 控件标题 */
    interface GuiTitle {
        /** @property 标题名称 */
        title: string
    }

    /** 控件描述 */
    interface GuiTail {
        /** @property 描述名称 */
        tail?: string
    }

    /** 输入框控件 */
    interface GuiInput {
        /** @property 控件类型 */
        component?: ComponentInput
    }

    /** 数字控件字段信息 */
    interface GuiFieldNumber {
        /** @property 字段信息 */
        field: {
            type: FieldTypeNumber
        }
    }

    /** 数字数组控件字段信息 */
    interface GuiFieldNumbers {
        /** @property 字段信息 */
        field: {
            type: FieldTypeNumbers
        }
    }

    /** 整数控件 */
    interface GuiInt {
        /** @property 控件类型 */
        component?: ComponentInt
    }

    /** 整数数组控件 */
    interface GuiInts {
        /** @property 控件类型 */
        component?: ComponentInts
    }

    /** 整数控件字段信息 */
    interface GuiFieldInt {
        /** @property 字段信息 */
        field?: {
            /**
             * @property 最小值
             * @default 0
             */
            min?: number,
            /**
             * @property 最大值
             * @default 10
             */
            max?: number,
            /**
             * @property 步长
             * @description 每个整型数字间隔
             * @default 1
             */
            step?: number
        }
    }

    /** 整数数组控件字段信息 */
    interface GuiFieldInts {
        /** @property 字段信息 */
        field?: {
            /**
             * @property 最小值
             * @default 0
             */
            min?: number,
            /**
             * @property 最大值
             * @default 10
             */
            max?: number,
            /**
             * @property 步长
             * @description 每个整型数字间隔
             * @default 1
             */
            step?: number
        }
    }

    /** 开关控件 */
    interface GuiSwitch {
        /** @property 控件类型 */
        component?: ComponentSwitch
    }

    /** 开关数组控件 */
    interface GuiSwitches {
        /** @property 控件类型 */
        component?: ComponentSwitches
    }

    /** 字符串控件 */
    interface GuiFieldString {
        /** @property 字段信息 */
        field?: {
            type?: FieldTypeString
        }
    }

    /** 字符串数组控件 */
    interface GuiFieldStrings {
        /** @property 字段信息 */
        field?: {
            type?: FieldTypeStrings
        }
    }

    /** 数值对控件 */
    interface GuiMapping {
        /** @property 控件类型 */
        component?: ComponentMapping
    }

    /** 图集控件 */
    interface GuiTexture {
        /** @property 控件类型 */
        component?: ComponentTexture
    }

    /** 图集数组控件 */
    interface GuiTextures {
        /** @property 控件类型 */
        component?: ComponentTextures
    }

    // 暂不支持

    // /** 声音控件 */
    // interface GuiAudio {
    //     /** @property 控件类型 */
    //     component?: ComponentAudio
    // }

    // /** 声音数组控件 */
    // interface GuiAudios {
    //     /** @property 控件类型 */
    //     component?: ComponentAudios
    // }

    /** 颜色控件 */
    interface GuiColor {
        /** @property 控件类型 */
        component?: ComponentColorPicker
    }

    /** 颜色数组控件 */
    interface GuiColors {
        /** @property 控件类型 */
        component?: ComponentColorsPicker
    }

    /** 预制控件 */
    interface GuiPrefab {
        /** @property 控件类型 */
        component?: ComponentPrefab
    }

    /** 预制数组控件 */
    interface GuiPrefabs {
        /** @property 控件类型 */
        component?: ComponentPrefabs
    }

    /** 节点控件 */
    interface GuiNode {
        /** @property 控件类型 */
        component?: ComponentNode
    }

    /** 节点数组控件 */
    interface GuiNodes {
        /** @property 控件类型 */
        component?: ComponentNodes
    }

    // 暂不支持

    // /** 逻辑脚本控件 */
    // interface GuiScript {
    //     /** @property 控件类型 */
    //     component?: ComponentScript
    // }

    // /** 逻辑脚本数组控件 */
    // interface GuiScripts {
    //     /** @property 控件类型 */
    //     component?: ComponentScripts
    // }

    // /** 几何体控件 */
    // interface GuiGeom {
    //     /** @property 控件类型 */
    //     component?: ComponentGeom
    // }

    // /** 几何体数组控件 */
    // interface GuiGeoms {
    //     /** @property 控件类型 */
    //     component?: ComponentGeoms
    // }

    /** 点控件 */
    interface GuiPoint {
        /** @property 控件类型 */
        component?: ComponentPoint
    }

    /** 点数组控件 */
    interface GuiPoints {
        /** @property 控件类型 */
        component?: ComponentPoints
    }

    // 暂不支持

    // /** 矩形控件 */
    // interface GuiRectangle {
    //     /** @property 控件类型 */
    //     component?: ComponentRectangle
    // }

    // /** 圆控件 */
    // interface GuiCircle {
    //     /** @property 控件类型 */
    //     component?: ComponentCircle
    // }

    // /** 椭圆控件 */
    // interface GuiEllipse {
    //     /** @property 控件类型 */
    //     component?: ComponentEllipse
    // }

    // /** 字体控件 */
    // interface GuiFont {
    //     /** @property 控件类型 */
    //     component?: ComponentFont
    // }

    // /** 字体数组控件 */
    // interface GuiFonts {
    //     /** @property 控件类型 */
    //     component?: ComponentFonts
    // }

    // /** 着色器控件 */
    // interface GuiFilter {
    //     /** @property 控件类型 */
    //     component?: ComponentFilter
    // }

    // /** 着色器数组控件 */
    // interface GuiFilters {
    //     /** @property 控件类型 */
    //     component?: ComponentFilters
    // }

    // /** 文本资源控件 */
    // interface GuiTextasset {
    //     /** @property 控件类型 */
    //     component?: ComponentTextasset
    // }

    // /** 文本资源数组控件 */
    // interface GuiTextassets {
    //     /** @property 控件类型 */
    //     component?: ComponentTextassets
    // }

    // /** Excel文件资源控件 */
    // interface GuiExcelasset {
    //     /** @property 控件类型 */
    //     component?: ComponentExcelasset
    // }

    // /** Excel文件资源数组控件 */
    // interface GuiExcelassets {
    //     /** @property 控件类型 */
    //     component?: ComponentExcelassets
    // }

    /** 下拉列表控件 */
    interface GuiSelect {
        /** @property 控件类型 */
        component: ComponentSelect
    }

    /** 下拉列表控件字段信息 */
    interface GuiFieldSelect {
        /** @property 字段信息 */
        field: {
            /** @property 下拉选项 */
            options: Array<{
                value: number | string,
                label: string
            }>,
            /** @property 下拉框没数据时的提示文案 */
            placeholder?: string
        }
    }

    /** 自定义事件控件 */
    interface GuiCustomEvent {
        /** @property 控件类型 */
        component?: ComponentCustomEvent
    }

    /** 整数 */
    type GuiTypeInt = GuiTitle & GuiTail & GuiInt & GuiFieldInt;
    /** 整数数组 */
    type GuiTypeInts = GuiTitle & GuiTail & GuiInts & GuiFieldInts;
    /** 数字 */
    type GuiTypeNumber = GuiTitle & GuiTail & GuiInput & GuiFieldNumber;
    /** 数字数组 */
    type GuiTypeNumbers = GuiTitle & GuiTail & GuiInput & GuiFieldNumbers;
    /** 布尔 */
    type GuiTypeBoolean = GuiTitle & GuiTail & GuiSwitch;
    /** 布尔数组 */
    type GuiTypeBooleans = GuiTitle & GuiTail & GuiSwitches;
    /** 字符串 */
    type GuiTypeString = GuiTitle & GuiTail & GuiInput & GuiFieldString;
    /** 字符串数组 */
    type GuiTypeStrings = GuiTitle & GuiTail & GuiInput & GuiFieldStrings;
    /** 数值对 */
    type GuiTypeMapping = GuiTitle & GuiTail & GuiMapping;
    /** 图集 */
    type GuiTypeTexture = GuiTitle & GuiTail & GuiTexture;
    /** 图集数组 */
    type GuiTypeTextures = GuiTitle & GuiTail & GuiTextures;
    // 暂不支持
    // /** 声音 */
    // type GuiTypeAudio = GuiTitle & GuiDesc & GuiAudio;
    // /** 声音数组 */
    // type GuiTypeAudios = GuiTitle & GuiDesc & GuiAudios;
    /** 颜色 */
    type GuiTypeColor = GuiTitle & GuiTail & GuiColor;
    /** 颜色数组 */
    type GuiTypeColors = GuiTitle & GuiTail & GuiColors;
    /** 预制 */
    type GuiTypePrefab = GuiTitle & GuiTail & GuiPrefab;
    /** 预制数组 */
    type GuiTypePrefabs = GuiTitle & GuiTail & GuiPrefabs;
    /** 节点 */
    type GuiTypeNode = GuiTitle & GuiTail & GuiNode;
    /** 节点数组 */
    type GuiTypeNodes = GuiTitle & GuiTail & GuiNodes;
    // 暂不支持
    // /** 逻辑脚本 */
    // type GuiTypeScript = GuiTitle & GuiDesc & GuiScript;
    // /** 逻辑脚本数组 */
    // type GuiTypeScripts = GuiTitle & GuiDesc & GuiScripts;
    // /** 几何体，例如：点、线、矩形、圆等 */
    // type GuiTypeGeom = GuiTitle & GuiDesc & GuiGeom;
    // /** 几何体数组 */
    // type GuiTypeGeoms = GuiTitle & GuiDesc & GuiGeoms;
    /** 点 */
    type GuiTypePoint = GuiTitle & GuiTail & GuiPoint;
    /** 点数组 */
    type GuiTypePoints = GuiTitle & GuiTail & GuiPoints;
    // 暂不支持
    // /** 矩形 */
    // type GuiTypeRectangle = GuiTitle & GuiDesc & GuiRectangle;
    // /** 圆 */
    // type GuiTypeCircle = GuiTitle & GuiDesc & GuiCircle;
    // /** 椭圆 */
    // type GuiTypeEllipse = GuiTitle & GuiDesc & GuiEllipse;
    // /** 字体 */
    // type GuiTypeFont = GuiTitle & GuiDesc & GuiFont;
    // /** 字体数组 */
    // type GuiTypeFonts = GuiTitle & GuiDesc & GuiFonts;
    // /** 着色器 */
    // type GuiTypeFilter = GuiTitle & GuiDesc & GuiFilter;
    // /** 着色器数组 */
    // type GuiTypeFilters = GuiTitle & GuiDesc & GuiFilters;
    // /** 文本资源 */
    // type GuiTypeTextasset = GuiTitle & GuiDesc & GuiTextasset;
    // /** 文本资源数组 */
    // type GuiTypeTextassets = GuiTitle & GuiDesc & GuiTextassets;
    // /** Excel文件资源 */
    // type GuiTypeExcelasset = GuiTitle & GuiDesc & GuiExcelasset;
    // /** Excel文件资源数组 */
    // type GuiTypeExcelassets = GuiTitle & GuiDesc & GuiExcelassets;
    /** 下拉列表 */
    type GuiTypeSelect = GuiTitle & GuiTail & GuiSelect & GuiFieldSelect;
    /** 自定义事件 */
    type GuiTypeCustomEvent = GuiTitle & GuiTail & GuiCustomEvent;
}