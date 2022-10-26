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
import { getRepositoryList } from "@/common/Function/Repository";

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
        private name: string,
        private folder: string,
        private isMaster: boolean,
        public readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        this.iconPath = new ThemeIcon("icon-repository", new ThemeColor("logo.color"));
        this.description = folder;
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
        const repositoryList = getRepositoryList();
        return repositoryList.map<StorageRepositoryTreeItem>((item) => {
            return new StorageRepositoryTreeItem(
                item.name,
                item.name,
                item.folder,
                item.master,
                TreeItemCollapsibleState.Collapsed
            );
        });
    }

    resolveTreeItem(
        item: TreeItem,
        element: StorageRepositoryTreeItem,
        token: CancellationToken
    ): ProviderResult<TreeItem> {
        return item;
    }
}
