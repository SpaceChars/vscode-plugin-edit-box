import { WindowAlertType } from "@/common/Enums";
import { CommandOptions } from "@/common/Types";
import { refreshDocuemnts } from "@/Function/Documents";
import { alert } from "@/Function/Others";
import {
    changeMasterRepository,
    getRepository,
    getRepositoryList,
    initialScmControl,
    refreshRepositoryList,
    resetRepositoryList,
    setRepositoryAlias,
    setRepositoryLocalFolder
} from "@/Function/Repository";
import { getSystemStoreModule } from "@/Function/System";

const _result: CommandOptions[] = [
    {
        id: "editbox.addRepository",
        event: () => {
            setRepositoryAlias().then((opt) => {
                if (opt.result === 2) {
                    setRepositoryLocalFolder(opt.name).then((opt) => {
                        if (opt.result === 1) {
                            initialScmControl(opt.name);
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
                }
                if (target?.master && repositoryList.length) {
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
