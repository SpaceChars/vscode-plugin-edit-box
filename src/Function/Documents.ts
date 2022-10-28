import { NodeDocumentsTreeViewProvider } from "@/views/Documents";
import { getSystemStoreModule } from "./System";

/**
 * 刷新仓库视图
 */
export function refreshDocuemnts() {
    //获取视图
    const provider = getSystemStoreModule().commit<NodeDocumentsTreeViewProvider>(
        "getTreeViewProvider",
        "editbox.views.documents"
    );
    //刷新
    provider?.onRefresh();
}
