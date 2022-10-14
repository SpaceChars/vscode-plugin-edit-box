import { Disposable, ExtensionContext, TreeDataProvider, TreeItem, TreeView, useApp } from ".";

let _context: ExtensionContext;

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
export function registerCommand(command: string, callback: () => void): Disposable {
    const c = useApp().commands.registerCommand(command, () => {
        callback();
    });
    useExtensionContext().subscriptions.push(c);
    return c;
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
    return useApp().window.createTreeView(viewId, {
        treeDataProvider: provider
    });
}
