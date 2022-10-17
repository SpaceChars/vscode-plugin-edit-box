import {
    CancellationToken,
    Event,
    EventEmitter,
    ProviderResult,
    registerTreeView,
    ThemeColor,
    ThemeIcon,
    TreeDataProvider,
    TreeItem,
    TreeItemCollapsibleState
} from "@/common/Function";

export class StorageRepositoryTreeItem extends TreeItem {
    /**
     *
     * @param label 仓库别名
     * @param repository 仓库地址
     * @param username 用户名
     * @param password 密码
     * @param collapsibleState 是否展开
     */
    constructor(
        public readonly label: string,
        private repository: string,
        private username: string,
        private password: string,
        public readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        this.iconPath = new ThemeIcon("icon-repository", new ThemeColor("logo.color"));
        this.description = "测试";
    }
}

export class NodeStorageRepositoryTreeViewProvider
    implements TreeDataProvider<StorageRepositoryTreeItem>
{
    private _onDidChangeTreeData: EventEmitter<
        void | StorageRepositoryTreeItem | StorageRepositoryTreeItem[] | null | undefined
    > = new EventEmitter<StorageRepositoryTreeItem | undefined | null | void>();

    readonly onDidChangeTreeData: Event<
        void | StorageRepositoryTreeItem | StorageRepositoryTreeItem[] | null | undefined
    > = this._onDidChangeTreeData.event;

    onRefresh() {
        this._onDidChangeTreeData.fire();
    }

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
            // new StorageRepositoryTreeItem("仓库", "", "", "", TreeItemCollapsibleState.Collapsed)
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
