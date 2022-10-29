import { ConfigurationTarget } from "vscode";

import {
    ExtensionContext,
    WorkspaceConfiguration,
    Disposable,
    TextEditor,
    TextEditorEdit,
    TreeView
} from "@/common/Types";

import * as vscode from "vscode";
import { StoreModule } from "@/store/core";
import { useStore } from "@/store";

/**
 * 调用应用
 * @returns
 */
export function useApp() {
    return vscode;
}

/**
 * 获取系统储存模块
 * @returns
 */
export function getSystemStoreModule(): StoreModule {
    return useStore().getStoreModule("system");
}

/**
 * 获取全局配置
 * @returns
 */
export function getGlobalConfiguration(key?: string): WorkspaceConfiguration {
    key ||= "editbox";
    return useApp().workspace.getConfiguration(key);
}

/**
 * 根据配置key获取配置值
 * @param key
 * @returns
 */
export function getConfiguration<T>(key: string, defaultValue: T): T {
    const config = getGlobalConfiguration();
    return config.get<T>(key, defaultValue);
}

/**
 * 设置配置属性值
 * @param key
 * @param value
 */
export function setConfiguration(
    key: string,
    value: any,
    scope?: ConfigurationTarget
): Thenable<void> {
    const config = getGlobalConfiguration();
    scope ||= ConfigurationTarget.Global;

    return config.update(key, value, scope);
}

/**
 * 获取扩展上下文信息
 * @returns
 */
export function useExtensionContext(): ExtensionContext {
    const store = getSystemStoreModule();
    return store.commit("getActiveContext");
}

/**
 * 设置扩展上下文信息
 * @param context
 */
export function setExtensionContext(context: ExtensionContext): void {
    const store = getSystemStoreModule();
    store.commit("setActiveContext", context);
}

/**
 * 注册命令
 * @param command 命令id
 * @param callback 回调
 * @returns
 */
export function registerCommand(command: string, callback: (...args: any[]) => any): Disposable {
    const c = useApp().commands.registerCommand(command, callback);
    useExtensionContext().subscriptions.push(c);
    return c;
}

/**
 * 注册文本编辑命令
 * @param command 命令id
 * @param callback 回调
 * @returns
 */
export function registerTextEditorCommand(
    command: string,
    callback: (textEditor: TextEditor, edit: TextEditorEdit, ...args: any[]) => void
): Disposable {
    const c = useApp().commands.registerTextEditorCommand(command, callback);
    useExtensionContext().subscriptions.push(c);
    return c;
}
