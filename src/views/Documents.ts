import {
    Event,
    EventEmitter,
    getFilesByDir,
    isDir,
    ProviderResult,
    ThemeColor,
    ThemeIcon,
    TreeDataProvider,
    TreeItem,
    TreeItemCollapsibleState
} from "@/common/Function";
import { getRepositoryList } from "@/common/Function/Repository";

export class DocumentTreeItem extends TreeItem {
    constructor(public readonly label: string, private root: string, private path: string) {
        const dir = isDir(root + "\\" + path);
        const collapsibleState: TreeItemCollapsibleState = dir
            ? TreeItemCollapsibleState.Collapsed
            : TreeItemCollapsibleState.None;

        super(label, collapsibleState);
        this.iconPath = dir ? new ThemeIcon("icon-folder") : new ThemeIcon("icon-file");
    }

    public get rootPath(): string {
        return this.root;
    }

    public get abstreactPath(): string {
        return this.path;
    }
}

export class NodeDocumentsTreeViewProvider implements TreeDataProvider<DocumentTreeItem> {
    private _onDidChangeTreeData: EventEmitter<
        void | DocumentTreeItem | DocumentTreeItem[] | null | undefined
    > = new EventEmitter<DocumentTreeItem | undefined | null | void>();

    readonly onDidChangeTreeData: Event<
        void | DocumentTreeItem | DocumentTreeItem[] | null | undefined
    > = this._onDidChangeTreeData.event;

    onRefresh() {
        this._onDidChangeTreeData.fire();
    }

    constructor(private nodePath?: string) {}

    getTreeItem(element: DocumentTreeItem): TreeItem | Thenable<TreeItem> {
        return element;
    }

    getChildren(element?: DocumentTreeItem | undefined): ProviderResult<DocumentTreeItem[]> {
        if (!element) {
            return this.getRootNodes();
        } else {
            let path =
                element.rootPath +
                (/.*\\+$/.test(element.rootPath) ? "" : "\\") +
                element.abstreactPath;

            if (isDir(path)) {
                const files = getFilesByDir(path);
                return files.map((file) => {
                    return new DocumentTreeItem(
                        file.name,
                        element.rootPath,
                        element.abstreactPath + "\\" + file.name
                    );
                });
            } else {
                return [];
            }
        }
    }

    private getRootNodes(): ProviderResult<DocumentTreeItem[]> {
        const repositoryList = getRepositoryList();
        const master = repositoryList.find((item) => item.master);
        const path = master?.folder || "";

        const files = getFilesByDir(path);
        return files.map((file) => {
            return new DocumentTreeItem(file.name, path, file.name);
        });
    }
}
