import { Disposable, ExtensionContext, registerCommand } from "../Function";
import Repository from "./Repository";

/**
 * 命令配置列表
 */
const _commands: CommandOptions[] = [...Repository];

/**
 * 命令实例列表
 */
const _commandInstance: Map<string, Disposable> = new Map();

export interface CommandOptions {
    id: string;
    event: (context: ExtensionContext) => void;
}

/**
 * 批量注册命令
 */
export function registerAllCommand(context: ExtensionContext) {
    _commands.forEach((item, index) => {
        const instance = registerCommand(item.id, () => {
            item.event(context);
        });
        _commandInstance.set(item.id, instance);
    });
}
