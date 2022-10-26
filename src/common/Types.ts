import { ExtensionContext } from "vscode";

export interface CommandOptions {
    id: string;
    event: (context: ExtensionContext, ...args: any[]) => void;
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

export class WorkProjectOptions {
    name: string;
    folder: string;
    master: boolean;

    constructor(name: string, folder: string, master: boolean) {
        this.name = name;
        this.folder = folder;
        this.master = master;
    }
}
