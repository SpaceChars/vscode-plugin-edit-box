import { MessageAlertType } from "@/common/Enums";
import { CommandOptions } from "@/common/Types";
import { refreshDocuemnts } from "@/Function/Documents";
import { selectFolder } from "@/Function/File";
import { messageAlert } from "@/Function/Others";
import {
    changeMasterRepository,
    getRepository,
    getRepositoryList,
    refreshRepositoryList,
    resetRepositoryList,
    setRepositoryAlias,
    setRepositoryLocalFolder,
    setRepositoryType,
    updateRepository
} from "@/Function/Repository";
import { cloneRemoteRepository } from "@/Function/Scm";

const _result: CommandOptions[] = [
    {
        id: "editbox.command.addRepository",
        event: () => {
            setRepositoryAlias().then((opt) => {
                if (opt.result === 2) {
                    const name = opt.name;
                    setRepositoryType(name).then((type) => {
                        if (type) {
                            //获取回调返回值
                            setRepositoryLocalFolder(
                                name,
                                type === "Local" ? selectFolder() : cloneRemoteRepository()
                            ).then((value) => {
                                if (value) {
                                    refreshRepositoryList();
                                    if (getRepository(opt.name)?.master) {
                                        refreshDocuemnts();
                                    }
                                }
                            });
                        }
                    });
                } else if (opt.result === 0) {
                    messageAlert("Alias already exists", MessageAlertType.ERROR);
                }
            });
        }
    },
    {
        id: "editbox.command.removeRepository",
        event: (context, args) => {
            let repositoryList = getRepositoryList();
            let name = args[0].name;
            const target = repositoryList.find((item) => item.name === name);

            repositoryList = repositoryList.filter((item) => item.name !== name);
            //判断删除的仓库是否是主仓库
            if (target?.master && repositoryList.length) {
                const first = repositoryList[0];
                first.master = true;
                repositoryList[0] = first;
                name = first.name;
            }

            resetRepositoryList(repositoryList).then(() => {
                refreshRepositoryList();
                if (target?.master) {
                    refreshDocuemnts();
                }
                if (target?.master && repositoryList.length) {
                    changeMasterRepository(name);
                }
            });
        }
    },
    {
        id: "editbox.command.renameRepository",
        event(context, args) {
            setRepositoryAlias(args[0].name).then((opt) => {
                if (opt.result === 1 || opt.result === 0) {
                    refreshRepositoryList();
                }
            });
        }
    },
    {
        id: "editbox.command.changeRepositoryFolder",
        event(context, args) {
            const name = args[0].name;
            setRepositoryLocalFolder(name, selectFolder()).then((value) => {
                if (value) {
                    refreshRepositoryList();
                    if (getRepository(name)?.master) {
                        refreshDocuemnts();
                    }
                }
            });
        }
    },
    {
        id: "editbox.command.changeMasterRepository",
        event: (context, args) => {
            changeMasterRepository(args[0].name).then(() => {
                refreshRepositoryList();
                refreshDocuemnts();
            });
        }
    },
    {
        id: "editbox.command.refreshRepository",
        event: () => {
            refreshRepositoryList();
        }
    }
];

export default _result;
