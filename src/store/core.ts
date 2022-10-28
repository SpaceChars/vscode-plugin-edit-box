import { StoreConfigOptions, StoreModuleOptions } from "@/common/Types";

/**
 * 储存类
 */
export class Store {
    constructor(private config: StoreConfigOptions) {}

    create(): StoreInstance {
        return new StoreInstance(this.config);
    }
}

/**
 * 储存实例
 */
export class StoreInstance {
    /**
     * 全局模块标识名
     */
    private GLOBAL_KEY = "global";

    /**
     * 解析后的modules
     */
    _modules: { [propName: string]: StoreModule } = {};

    constructor(private configOpt: StoreConfigOptions) {
        this.parseModules(configOpt.modules);
    }

    /**
     * 解析各模块
     * @param modules
     */
    parseModules(modules: { [propName: string]: StoreModuleOptions }) {
        Object.keys(modules).forEach((key) => {
            const options = modules[key];
            const moduleName = options.namespace ? key : this.GLOBAL_KEY;

            const module =
                this._modules[moduleName] || new StoreModule(moduleName, this, { state: {} });
            module.update(options);
            this._modules[moduleName] = module;
        });
    }

    /**
     * 获取指定缓存模块
     * @param module 模块命名空间 （不填默认全局模块）
     * @returns
     */
    public getStoreModule(module?: string): StoreModule {
        module ||= this.GLOBAL_KEY;
        return this._modules[module];
    }
}

/**
 * 储存模块
 */
export class StoreModule {
    constructor(
        private module: string,
        private instace: StoreInstance,
        private options: StoreModuleOptions
    ) {}

    /**
     * 设置属性getter、setter
     */
    private statedefineProperty() {
        Object.keys(this.options.state).forEach((prop) => {
            Object.defineProperty(this.options.state, prop, {
                set: function (val) {
                    prop = val;
                },
                get: function () {
                    return prop;
                }
            });
        });
    }

    /**
     * 更新配置
     * @param opt
     */
    public update(opt: StoreModuleOptions) {
        const options = this.options || {};

        options["state"] = Object.assign({}, options.state, opt.state);

        options["mutations"] = Object.assign({}, options.mutations, opt.mutations);
        options["actions"] = Object.assign({}, options.actions, opt.actions);

        this.options = options;

        this.statedefineProperty();
    }

    /**
     *mutations event
     * @param prop 字段
     * @param args 参数
     */
    public commit(prop: string, ...args: any): any {
        const mutations = this.options.mutations || {};
        const event = mutations[prop];

        if (!event) {
            throw new Error("mutation Event Method undefind.");
        }

        return event(this.options.state, this.commit, ...args);
    }

    /**
     * action event
     * @param prop 字段
     * @param args 参数
     */
    public dispatch(prop: string, ...args: any): Promise<any | Promise<any | void> | void> {
        return new Promise<any>((resolve, reject) => {
            const actions = this.options.actions || {};
            const event = actions[prop];

            if (!event) {
                throw new Error("Action Event Method undefind.");
            }

            try {
                const result = event(this.options.state, this.commit, this.dispatch, args);

                //如果返回结果为Promise
                if (result && Object.prototype.toString.call(result) === "[object Promise]") {
                    result.then((res) => resolve(res)).catch((err) => reject(err));
                } else {
                    resolve(result);
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}
