import { Disposable, ExtensionContext, CommandOptions } from "@/common/Types";

import Repository from "./Repository";
import Documents from "./Documents";
import Git from "./Git";
import File from "./File";

import { registerCommand } from "@/Function/System";

/**
 * 命令配置列表
 */
const _commands: CommandOptions[] = [...Repository, ...Documents, ...Git, ...File];

/**
 * 命令实例列表
 */
const _commandInstance: Map<string, Disposable> = new Map();

/**
 * 批量注册命令
 */
export function registerAllCommand(context: ExtensionContext) {
    _commands.forEach((item, index) => {
        const instance = registerCommand(item.id, (...args) => {
            item.event(context, args);
        });
        _commandInstance.set(item.id, instance);
    });
}
