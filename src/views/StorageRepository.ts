import {
    CancellationToken,
    ProviderResult,
    registerTreeView,
    ThemeColor,
    ThemeIcon,
    TreeDataProvider,
    TreeItem,
    TreeItemCollapsibleState
} from "@/common/Function";
import { RepositoryType } from "@/common/Enums";

export class StorageRepositoryTreeItem extends TreeItem {

    /**
     * 
     * @param label 仓库别名
     * @param repository 仓库地址
     * @param username 用户名
     * @param password 密码
     * @param collapsibleState 是否展开
     * @param type 仓库类型
     */
    constructor(
        public readonly label: string,
        private repository: string,
        private username: string,
        private password: string,
        public readonly collapsibleState: TreeItemCollapsibleState,

        private type?: RepositoryType
    ) {
        super(label, collapsibleState);
        this.iconPath = new ThemeIcon("icon-repository", new ThemeColor("logo.color"));
        this.description = "测试";
    }
}


export class NodeStorageRepositoryTreeViewProvider
    implements TreeDataProvider<StorageRepositoryTreeItem>
{
    getTreeItem(element: StorageRepositoryTreeItem): TreeItem | Thenable<TreeItem> {
        return element;
    }

    getChildren(
        element?: StorageRepositoryTreeItem | undefined
    ): ProviderResult<StorageRepositoryTreeItem[]> {
        if (!element) {
            return this.getRootNodes();
        } else {
            return [];
        }
    }

    private getRootNodes(): StorageRepositoryTreeItem[] {
        return [
            new StorageRepositoryTreeItem("仓库", "", "", "", TreeItemCollapsibleState.Collapsed)
        ];
    }

    resolveTreeItem(
        item: TreeItem,
        element: StorageRepositoryTreeItem,
        token: CancellationToken
    ): ProviderResult<TreeItem> {
        return item;
    }
}
