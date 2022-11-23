import { ExtensionContext } from "vscode";
import { RepositoryType } from "./Enums";

export * from "vscode";

/**
 * 命令配置信息
 */
export interface CommandOptions {
    id: string;
    event(context: ExtensionContext, ...args: any[]): void;
}

// export type RepositoryType = "Local" | "Remote";

/**
 * 返回结果
 */
export interface Result<T> {

    /**
     * 编码
     */
    code?: string;

    /**
     * 结果
     */
    data?: T;

    /**
     * 描述
     */
    message?: string;
}

/**
 * 工作空间仓库配置信息
 */
export interface WorkRepositoryOptions {
    name: string;
    folder?: string;
    master?: boolean;
    // type: RepositoryType;
}

/**
 * 储存模块配置信息
 */
export interface StoreModuleOptions {
    namespace?: boolean;
    state: { [propName: string]: any };
    mutations?: {
        [propName: string]: (
            store: {
                state: { [propName: string]: any };
                commit: (prop: string, ...args: any) => any;
            },
            ...args: any
        ) => any;
    };
    actions?: {
        [propName: string]: (
            store: {
                state: { [propName: string]: any };
                commit: (prop: string, ...args: any) => any;
                dispatch: (prop: string, ...args: any) => Promise<any | Promise<any>>;
            },
            ...args: any
        ) => Promise<any>;
    };
}

/**
 * 储存全局配置信息
 */
export interface StoreConfigOptions {
    modules: { [propName: string]: StoreModuleOptions };
}
