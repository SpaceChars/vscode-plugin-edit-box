import { NodeDocumentsTreeViewProvider } from "@/views/Documents";
import { getTreeViewProvider } from "./System";

/**
 * 刷新仓库视图
 */
export function refreshDocuemnts() {
    //获取视图
    const provider = getTreeViewProvider<NodeDocumentsTreeViewProvider>("editbox.views.documents");
    //刷新
    provider?.onRefresh();
}
