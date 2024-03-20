namespace ps {
  /**
   * 游戏配置管理类
   */
  export class GameConfig {
    /** 初始化游戏配置数据 */
    static init() {
      if (ps.playerRetry) {
        ps.playerRetry = false;
        return;
      }
      if (!ps.Tools.objIsNull(this.config)) {
        GAME_CFG = {} as any;
        for (let key in this.config) {
          let item = this.config[key];
          if (item.items && item.items.length) {
            for (let i = 0; i < item.items.length; i++) {
              // value.push(item.items[i].value);
              GAME_CFG[item.items[i]["pl_key"]] = item.items[i].value;
            }
          } else {
            GAME_CFG[key] = item.value;
          }
        }
      }
      GAME_CFG["playAgain"] = GameConfig.playAgain;
      if (GameConfig.autoEndTime !== void 0) GAME_CFG["autoEndTime"] = GameConfig.autoEndTime;

      //颜色数据
      // if (this.colorConfig) {
      //   COLOR_CFG = {} as any;
      //   for (let key in this.colorConfig) {
      //     let item = this.colorConfig[key];
      //     COLOR_CFG[key] = item.value;
      //   }
      // }
    }

    static getConfig(key: string) {
      if (this.config[key]) return this.config[key];
      else {
        for (const k in this.config) {
          if (this.config[k].items && this.config[k].items) {
            for (const con of this.config[k].items) {
              if (con.pl_key === key) return con;
            }
          }
        }
      }
    }

    /** 整个数据 */
    static get data() {
      const config = game.cache.getJSON("gameConfig");
      if (ps.Tools.objIsNull(config)) {
        console.warn("没有gameConfig文件 或 gameConfig文件配置为空");
        return config;
      }
      let data = config;
      if (dcoData) {
        if (!dcoData.param) {
          data = ps.Tools.strToJson(config[Object.keys(config)[0]]);
        } else {
          data = ps.Tools.strToJson(config[dcoData.param]);
          if (ps.Tools.objIsNull(data)) data = ps.Tools.strToJson(config[Object.keys(config)[0]]);
        }
        // if (!ps.Tools.objIsNull(data) && !ps.Tools.objIsNull(data.value)) {
        //     data = data.value;
        // } else {
        //     data = config;
        // }
      }
      // else if (config.gameConfig == void 0) {
      //     data = ps.Tools.strToJson(config[Object.keys(config)[0]]);
      // }
      return data;
    }

    /** 获取颜色配置数据 */
    static get colorConfig(): Object {
      let data = this.data;
      if (data == void 0) return;
      let colorConfig = data.colorConfig;
      return colorConfig;
    }

    /** 获取当前难度配置数据 */
    static get config(): Object {
      let data = this.data;
      if (data == void 0) return;
      let gameConfig = data.gameConfig;
      if (!gameConfig || typeof gameConfig != "object") {
        console.warn("游戏配置gameConfig字段有误！gameConfig == " + gameConfig);
        return;
      }
      return gameConfig;
    }

    /** 游戏自动结束时间，0代表不会自动结束 */
    static get autoEndTime(): number {
      let data = this.data;
      if (data == void 0) return;
      if (data.autoEndTime < 0) return 0;
      return data.autoEndTime;
    }

    /** 游戏可重玩次数，大于等于0为指定次数，-1为无限次数 */
    static get playAgain(): number {
      let data = this.data;
      if (data == void 0 || !data.playAgain) return 0;
      return data.playAgain;
    }

    /**
     * [已过时，请使用GAME_CFG.key] 获取值
     * @param key 参数名
     * @param rounding 取整，默认不取整
     */
    @ObsoleteMethod("GAME_CFG.key", "GameConfig.getValue")
    static getValue(key: string, rounding = false) {
      if (!this.config[key]) {
        console.error(`动态参数里面没有${key}字段`);
        return;
      }
      if (rounding) return Math.round(this.config[key].value);
      return this.config[key].value;
    }

    /** 创建动态参数模板 */
    static createTemplete() {
      let gb: any = {};
      gb.autoEndTime = GAME_CFG["autoEndTime"];
      gb.playAgain = GAME_CFG["playAgain"];
      // if (window["COLOR_CFG"]) gb.colorConfig = this.exportColor();
      if (window["GAME_CFG"]) gb.gameConfig = this.exportConfig();

      console.log(ps.Tools.jsonToStr(gb));
      console.log("可使用用户代码片段创建，指令如下");
      console.log("cfgSlider,cfgInput,cfgSwitch,cfgRadio,cfgCheckbox,cfgArray");
      console.log("说明文档：http://confluence.mobvista.com/pages/viewpage.action?pageId=30346816");
    }

    /** 生成动态参数 gameConfig 模板 */
    static exportConfig() {
      const config = this.config;
      let gb: any = {};
      let i = 0;

      for (let key in GAME_CFG) {
        if (key === "playAgain") continue;
        i++;
        let value = GAME_CFG[key];
        //旧数据
        let min = 0;
        let max = value * 2;
        let interval = 1;
        let desc = "";
        let title = "";
        if (config[key]) {
          if (config[key].min != void 0) min = config[key].min;
          if (config[key].max != void 0) max = config[key].max;
          if (config[key].interval != void 0) interval = config[key].interval;
          desc = config[key].desc;
          title = config[key].title;
        }
        //读取GAME_CFG_DESC信息
        if (window["GAME_CFG_DESC"] && window["GAME_CFG_DESC"][key]) {
          var cfgDesc = window["GAME_CFG_DESC"][key];
          if (cfgDesc.min != void 0) min = cfgDesc.min;
          if (cfgDesc.max != void 0) max = cfgDesc.max;
          if (cfgDesc.interval != void 0) interval = cfgDesc.interval;
          desc = cfgDesc.desc;
          title = cfgDesc.title;
        }
        switch (typeof value) {
          /** Slider */
          case "number":
            gb[key] = {
              type: "slider",
              value: value,
              min: min,
              max: max,
              interval: interval,
              desc: desc,
              title: title,
              priority: i,
            };
            break;

          /** 字符串 */
          case "string":
            /** 单选 */
            gb[key] = {
              type: "radio",
              value: value,
              options: [value],
              desc: desc,
              title: title,
              priority: i,
            };
            /** 文本输入框 */
            gb[key + "_input"] = {
              type: "input:text",
              value: value,
              desc: desc,
              title: title,
              priority: i,
            };
            break;

          /** 开关 */
          case "boolean":
            gb[key] = {
              type: "switch",
              value: value,
              desc: desc,
              title: title,
              priority: i,
            };
            break;

          /** 数组 */
          case "object":
            if (Array.isArray(value)) {
              if (value.length <= 0) {
                value[0] = 0;
              }
              switch (typeof value[0]) {
                /** Slider数组 */
                case "number":
                  const minVal = Math.min(...value);
                  const maxVal = Math.max(...value);
                  gb[key] = {
                    type: "array",
                    subtype: "slider",
                    min: minVal,
                    max: maxVal,
                    value: value,
                    desc: desc,
                    title: title,
                    priority: i,
                  };
                  break;

                /** 字符串数组 */
                case "string":
                  /** 文本输入框数组 */
                  gb[key] = {
                    type: "array",
                    subtype: "input:text",
                    value: value,
                    desc: desc,
                    title: title,
                    priority: i,
                  };

                  /** 复选 */
                  gb[key + "_checkbox"] = {
                    type: "checkbox",
                    value: value,
                    options: value,
                    desc: desc,
                    title: title,
                    priority: i,
                  };
                  break;
              }
            }
            break;

          default:
        }
      }
      return gb;
    }

    /** 生成动态参数 colorConfig 模板 */
    // static exportColor() {
    //   let gb: any = {};
    //   //生成动态参数模板
    //   let i = 0;
    //   for (let key in COLOR_CFG) {
    //     let desc = "";
    //     let title = "";
    //     if (this.colorConfig && this.colorConfig[key]) {
    //       desc = this.colorConfig[key].desc;
    //       title = this.colorConfig[key].title;
    //     }
    //     if (window["COLOR_CFG_DESC"] && window["COLOR_CFG_DESC"][key]) {
    //       desc = window["COLOR_CFG_DESC"][key].desc;
    //       title = window["COLOR_CFG_DESC"][key].title;
    //     }
    //     //
    //     gb[key] = {
    //       value: COLOR_CFG[key],
    //       desc: desc,
    //       title: title,
    //       priority: i,
    //     };
    //     i++;
    //   }
    //   return gb;
    // }
  }
}
