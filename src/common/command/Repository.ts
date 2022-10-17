import { NodeStorageRepositoryTreeViewProvider } from "@/views/StorageRepository";
import { CommandOptions } from ".";
import { alert, getTreeViewProvider } from "../Function";

const _result: CommandOptions[] = [
    {
        id: "editbox.addRepository",
        event: () => {
            alert("Add Storage Repository!");
        }
    },
    {
        id: "editbox.removeRepository",
        event: () => {
            alert("Remove Storage Repository!");
        }
    },
    {
        id: "editbox.editRepository",
        event: () => {
            alert("Edit Storage Repository!");
        }
    },
    {
        id: "editbox.settedMasterRepository",
        event: () => {
            alert("Setted Master Repository!");
        }
    },
    {
        id: "editbox.refreshRepository",
        event: () => {
            //获取视图
            const provider = getTreeViewProvider<NodeStorageRepositoryTreeViewProvider>(
                "editbox.views.storeRepository"
            );
            //刷新
            provider?.onRefresh();
            //提示
            alert("Refresh Repository finished!");
        }
    }
];

export default _result;
