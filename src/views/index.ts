import { ViewType } from "@/common/Enums";
import { ExtensionContext, registerTreeView, TreeView, Webview } from "@/common/Function";
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
        id: "editbox.views.storeRepository",
        type: ViewType.TreeView,
        getInstance(context) {
            return registerTreeView(this.id, new NodeStorageRepositoryTreeViewProvider());
        }
    },
    {
        id: "editbox.views.documents",
        type: ViewType.TreeView,
        getInstance(context) {
            return registerTreeView(this.id, new NodeDocumentsTreeViewProvider());
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
