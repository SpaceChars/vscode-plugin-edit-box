import {
    ProviderResult,
    ThemeColor,
    ThemeIcon,
    TreeDataProvider,
    TreeItem,
    TreeItemCollapsibleState
} from "@/common/Function";

export class DocumentTreeItem extends TreeItem {
    constructor(
        public readonly label: string,
        private status: string,
        public readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        this.iconPath = new ThemeIcon("icon-file", new ThemeColor("logo.color"));
        this.description = "测试";
    }
}

export class NodeDocumentsTreeViewProvider implements TreeDataProvider<DocumentTreeItem> {
    constructor(private nodePath?: string) {}

    getTreeItem(element: DocumentTreeItem): TreeItem | Thenable<TreeItem> {
        return element;
    }

    getChildren(element?: DocumentTreeItem | undefined): ProviderResult<DocumentTreeItem[]> {
        if (!element) {
            return this.getRootNodes();
        } else {
            return [];
        }
    }

    private getRootNodes(): ProviderResult<DocumentTreeItem[]> {
        return [new DocumentTreeItem("测试", "1", TreeItemCollapsibleState.Expanded)];
    }
}
