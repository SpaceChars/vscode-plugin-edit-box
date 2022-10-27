import { WindowAlertType } from "../Enums";
import { alert } from "../Function";
import { refreshDocuemnts } from "../Function/Documents";
import {
    changeMasterRepository,
    getRepository,
    getRepositoryList,
    refreshRepositoryList,
    resetRepositoryList,
    setRepositoryAlias,
    setRepositoryLocalFolder
} from "../Function/Repository";
import { CommandOptions } from "../Types";

const _result: CommandOptions[] = [
    {
        id: "editbox.addRepository",
        event: () => {
            setRepositoryAlias().then((opt) => {
                if (opt.result === 2) {
                    setRepositoryLocalFolder(opt.name).then((opt) => {
                        if (opt.result === 1) {
                            refreshRepositoryList();
                            if (getRepository(opt.name)?.master) {
                                refreshDocuemnts();
                            }
                        }
                    });
                } else if (opt.result === 0) {
                    alert("Alias already exists", WindowAlertType.ERROR);
                }
            });
        }
    },
    {
        id: "editbox.removeRepository",
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
                    changeMasterRepository(name);
                }
            });
        }
    },
    {
        id: "editbox.renameRepository",
        event(context, args) {
            setRepositoryAlias(args[0].name).then((opt) => {
                if (opt.result === 1 || opt.result === 0) {
                    refreshRepositoryList();
                }
            });
        }
    },
    {
        id: "editbox.changeRepositoryFolder",
        event(context, args) {
            setRepositoryLocalFolder(args[0].name).then((opt) => {
                if (opt.result === 1) {
                    refreshRepositoryList();
                    if (getRepository(opt.name)?.master) {
                        refreshDocuemnts();
                    }
                }
            });
        }
    },
    {
        id: "editbox.changeMasterRepository",
        event: (context, args) => {
            changeMasterRepository(args[0].name).then(() => {
                refreshRepositoryList();
                refreshDocuemnts();
            });
        }
    },
    {
        id: "editbox.refreshRepository",
        event: () => {
            refreshRepositoryList();
            alert("Refresh Repository finished!");
        }
    }
];

export default _result;
