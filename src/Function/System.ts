import { ConfigurationTarget } from "vscode";

import {
    ExtensionContext,
    WorkspaceConfiguration,
    Disposable,
    TreeItem,
    TreeDataProvider,
    TreeView
} from "@/common/Types";

import * as vscode from "vscode";
import { StoreModule } from "@/store/core";
import { useStore } from "@/store";

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
 * @param command
 * @returns
 */
export function registerCommand(command: string, callback: (...args: any[]) => any): Disposable {
    const c = useApp().commands.registerCommand(command, callback);
    useExtensionContext().subscriptions.push(c);
    return c;
}

let _treeViewProviderMap: Map<string, TreeDataProvider<TreeItem>> = new Map();

/**
 * 根据视图id获取视图Provider
 * @param viewId 视图id
 * @returns
 */
export function getTreeViewProvider<T extends TreeDataProvider<TreeItem>>(
    viewId: string
): T | undefined {
    return <T>_treeViewProviderMap.get(viewId);
}

/**
 * 注册树型视图
 * @param command
 * @returns
 */
export function registerTreeView(
    viewId: string,
    provider: TreeDataProvider<TreeItem>
): TreeView<TreeItem> {
    _treeViewProviderMap.set(viewId, provider);

    return useApp().window.createTreeView(viewId, {
        treeDataProvider: provider
    });
}
