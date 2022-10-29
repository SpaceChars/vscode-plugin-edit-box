import {
    CancellationToken,
    Event,
    EventEmitter,
    ProviderResult,
    ThemeColor,
    ThemeIcon,
    TreeDataProvider,
    TreeItem,
    TreeItemCollapsibleState,
    Uri
} from "@/common/Types";
import { getRepositoryList } from "@/Function/Repository";

export class StorageRepositoryTreeItem extends TreeItem {
    /**
     *
     * @param label 仓库别名
     * @param name 仓库别名
     * @param folder 仓库文件夹
     * @param isMaster 是否主仓库
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
        this.iconPath = isMaster
            ? new ThemeIcon("icon-master-repository", new ThemeColor("logo.color"))
            : new ThemeIcon("globe");

        this.resourceUri = Uri.file(folder);
        this.contextValue = label;
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
        const result = repositoryList
            .sort((a) => (a.master ? -1 : 1))
            .map<StorageRepositoryTreeItem>((item) => {
                return new StorageRepositoryTreeItem(
                    item.name,
                    item.name,
                    item.folder || "",
                    item.master || false,
                    TreeItemCollapsibleState.None
                );
            });
        return result;
    }

    resolveTreeItem(
        item: TreeItem,
        element: StorageRepositoryTreeItem,
        token: CancellationToken
    ): ProviderResult<TreeItem> {
        return item;
    }
}
