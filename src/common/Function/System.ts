import { ConfigurationTarget } from "vscode";
import {
    Disposable,
    ExtensionContext,
    TreeDataProvider,
    TreeItem,
    TreeView,
    useApp,
    WorkspaceConfiguration
} from ".";

let _context: ExtensionContext;

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

export function useExtensionContext(): ExtensionContext {
    return _context;
}

export function setExtensionContext(context: ExtensionContext): void {
    _context = context;
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
