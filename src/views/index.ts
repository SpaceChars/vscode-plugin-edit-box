import { ViewType } from "@/common/Enums";
import { ExtensionContext, TreeView, Webview } from "@/common/Types";
import { getSystemStoreModule } from "@/Function/System";
import { TreeItem } from "vscode";
import { NodeDocumentsTreeViewProvider } from "./Documents";
import { NodeStorageRepositoryTreeViewProvider } from "./Repository";

export interface ViewConfigOptions {
    id: string;
    type: ViewType;
    getInstance: (context: ExtensionContext) => Webview | TreeView<TreeItem>;
}

const _viewConfigList: ViewConfigOptions[] = [
    {
        id: "editbox.views.Repository",
        type: ViewType.TreeView,
        getInstance(context) {
            return getSystemStoreModule().commit(
                "registerTreeView",
                this.id,
                new NodeStorageRepositoryTreeViewProvider()
            );
        }
    },
    {
        id: "editbox.views.documents",
        type: ViewType.TreeView,
        getInstance(context) {
            return getSystemStoreModule().commit(
                "registerTreeView",
                this.id,
                new NodeDocumentsTreeViewProvider()
            );
        }
    }
];

const _viewInstance: Map<string, Webview | TreeView<TreeItem>> = new Map();

/**
 * 注册所有页面
 * @param context
 */
export function registerAllViews(context: ExtensionContext) {
    _viewConfigList.forEach((item, index) => {
        if (item.type === ViewType.TreeView) {
            _viewInstance.set(item.id, item.getInstance(context));
        }
    });
}
