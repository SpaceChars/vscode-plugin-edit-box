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
import { getFilesByDir, isDir, isFile } from "@/Function/File";
import { getRepositoryList } from "@/Function/Repository";

export class DocumentTreeItem extends TreeItem {
    constructor(public readonly label: string, private root: string, private path: string) {
        const resourcePath = root + "\\" + path;

        const dir = isDir(resourcePath);
        const collapsibleState: TreeItemCollapsibleState = dir
            ? TreeItemCollapsibleState.Collapsed
            : TreeItemCollapsibleState.None;

        super(label, collapsibleState);
        this.iconPath = dir ? new ThemeIcon("folder") : new ThemeIcon("file");
        this.resourceUri = Uri.file(resourcePath);
        if (!dir) {
            this.command = { command: "vscode.open", title: label, arguments: [this.resourceUri] };
        }
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
