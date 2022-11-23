import { MessageAlertType } from "@/common/Enums";
import { CommandOptions } from "@/common/Types";
import { refreshDocuemntsView } from "@/Function/Documents";
import { selectFolder } from "@/Function/File";
import { messageAlert } from "@/Function/Others";
import {
    changeMasterRepository,
    getRepositoryList,
    refreshRepositorysView,
    setRepositoryList,
    setRepositoryAlias,
    setRepositoryLocalFolder,
    setRepositoryType
} from "@/Function/Repository";
import { cloneRemoteRepository } from "@/Function/Scm";

const _result: CommandOptions[] = [
    {
        id: "editbox.command.addRepository",
        event: () => {
            setRepositoryAlias().then((opt) => {
                // if (opt.result === 2) {
                //     const name = opt.name;
                //     setRepositoryType(name).then((type) => {
                //         if (type) {
                //             //获取回调返回值
                //             setRepositoryLocalFolder(
                //                 name,
                //                 type === "Local" ? selectFolder() : cloneRemoteRepository()
                //             ).then((value) => {
                //                 if (value) {
                //                     refreshRepositorysView();
                //                     refreshDocuemntsView();
                //                 }
                //             });
                //         }
                //     });
                // } else if (opt.result === 0) {
                //     messageAlert("Alias already exists", MessageAlertType.ERROR);
                // }
            });
        }
    },
    {
        id: "editbox.command.removeRepository",
        event: (context, args) => {
            let repositoryList = getRepositoryList();

            repositoryList = repositoryList.filter((item) => item.name !== args[0].name);

            setRepositoryList(repositoryList).then(() => {
                changeMasterRepository().then(() => {
                    refreshRepositorysView();
                    refreshDocuemntsView();
                });
            });
        }
    },
    {
        id: "editbox.command.renameRepository",
        event(context, args) {
            setRepositoryAlias(args[0].name).then((opt) => {
                // if (opt.result === 1 || opt.result === 0) {
                //     refreshRepositorysView();
                // }
            });
        }
    },
    {
        id: "editbox.command.changeMasterRepository",
        event: (context, args) => {
            changeMasterRepository(args[0].name).then(() => {
                refreshRepositorysView();
                refreshDocuemntsView();
            });
        }
    }
];

export default _result;
