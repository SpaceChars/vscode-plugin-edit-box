import { NodeStorageRepositoryTreeViewProvider } from "@/views/Repository";
import { alert, getTreeViewProvider, setConfiguration } from "../Function";
import {
    getRepositoryList,
    refreshRepositoryList,
    setRepositoryAlias,
    setRepositoryLocalFolder
} from "../Function/Repository";
import { CommandOptions } from "../Types";

const _result: CommandOptions[] = [
    {
        id: "editbox.addRepository",
        event: (context) => {
            setRepositoryAlias().then((name) => {
                if (name) {
                    setRepositoryLocalFolder(name).then((value) => {
                        if (value) {
                            alert("Add Storage Repository");
                            refreshRepositoryList();
                        }
                    });
                }
            });
        }
    },
    {
        id: "editbox.removeRepository",
        event: (context, args) => {
            let repositoryList = getRepositoryList();
            repositoryList = repositoryList.filter((item) => item.name !== args[0].name);
            setConfiguration("work.project", repositoryList).then(() => {
                alert("Remove Storage Repository!");
                refreshRepositoryList();
            });
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
            refreshRepositoryList();
            //提示
            alert("Refresh Repository finished!");
        }
    }
];

export default _result;
