import { ExtensionContext } from "vscode";

export * from "vscode";

/**
 * 命令配置信息
 */
export interface CommandOptions {
    id: string;
    event(context: ExtensionContext, ...args: any[]): void;
}

/**
 * 设置仓库属性结果
 */
export interface SetRepositoryPropertyResult {
    /**
     * 仓库名
     */
    name: string;

    /**
     * 值
     */
    value?: string;

    /**
     * 结果类型
     * 0：新值重复
     * 1：修改——有值
     * 2：新增——有值
     * 3：修改——没值
     * 4：新增——没值
     * 5: 仓库不存在
     */
    result: number;
}

/**
 * 工作空间仓库配置信息
 */
export class WorkRepositoryOptions {
    name: string;
    folder: string;
    master: boolean;

    constructor(name: string, folder: string, master: boolean) {
        this.name = name;
        this.folder = folder;
        this.master = master;
    }
}

/**
 * 储存模块配置信息
 */
export interface StoreModuleOptions {
    namespace?: boolean;
    state: { [propName: string]: any };
    mutations?: {
        [propName: string]: <T>(
            state: { [propName: string]: any },
            commit: (prop: string, ...args: any) => any,
            ...args: any
        ) => T | void;
    };
    actions?: {
        [propName: string]: <T>(
            state: { [propName: string]: any },
            commit: (prop: string, ...args: any) => any,
            dispatch: (prop: string, ...args: any) => Promise<any | Promise<any>>,
            ...args: any
        ) => Promise<T | void>;
    };
}

/**
 * 储存全局配置信息
 */
export interface StoreConfigOptions {
    modules: { [propName: string]: StoreModuleOptions };
}
