import { RepositoryType, MessageAlertType } from "@/common/Enums";
import {
    SetRepositoryPropertyResult,
    WorkRepositoryOptions,
    Uri,
    InputBoxValidationSeverity,
    Task,
    ShellExecution,
    tasks,
    TaskGroup,
    TaskScope
} from "@/common/Types";
import { NodeStorageRepositoryTreeViewProvider } from "@/views/Repository";
import { selectFolder } from "./File";
import { messageAlert, fileAlert, inputAlert, quickPickAlert } from "./Others";
import { createSourceControl } from "./Scm";
import { getConfiguration, getSystemStoreModule, setConfiguration } from "./System";

/**
 * 获取仓库列表
 * @returns
 */
export function getRepositoryList(): WorkRepositoryOptions[] {
    return getConfiguration<WorkRepositoryOptions[]>("work.repositorys", []);
}

/**
 * 刷新仓库视图
 */
export function refreshRepositoryList() {
    //获取视图
    const provider = getSystemStoreModule().commit<NodeStorageRepositoryTreeViewProvider>(
        "getTreeViewProvider",
        "editbox.views.Repository"
    );
    //刷新
    provider?.onRefresh();
}

/**
 * 重置仓库列表
 * @param value
 * @returns
 */
export function resetRepositoryList(value: WorkRepositoryOptions[]): Thenable<void> {
    return setConfiguration("work.repositorys", value);
}

/**
 * 更新仓库值
 * @param value 值
 * @param index 下标
 */
export function updateRepository(value: WorkRepositoryOptions, index?: number): Thenable<void> {
    const list = getRepositoryList();
    index ||= list.findIndex((item) => item.name === value.name);

    if (index >= 0) {
        list[index] = value;
    } else {
        list.push(value);
    }

    return setConfiguration("work.repositorys", list);
}

/**
 * 根据名称获取仓库
 * @param name
 * @returns
 */
export function getRepository(name: string): WorkRepositoryOptions | undefined {
    return getRepositoryList().find((item) => item.name === name);
}

/**
 * 更改主仓库
 * @param name
 * @returns
 */
export function changeMasterRepository(name: string): Thenable<void> {
    const repositoryList = getRepositoryList();

    const masterIndex = repositoryList.findIndex((item) => item.master);
    if (masterIndex >= 0) {
        const master = repositoryList[masterIndex];
        master.master = false;
        repositoryList[masterIndex] = master;
    }

    const targetIndex = repositoryList.findIndex((item) => item.name === name);
    if (targetIndex >= 0) {
        const target = repositoryList[targetIndex];
        target.master = true;
        repositoryList[targetIndex] = target;
    }

    return resetRepositoryList(repositoryList).then(() => {
        return setConfiguration("work.repositorys.master", name);
    });
}

/**
 * Setting Or Update Repository Alias
 * @param name  Repository Alias
 * @return
 */
export function setRepositoryAlias(name?: string): Thenable<SetRepositoryPropertyResult> {
    const repositoryList: WorkRepositoryOptions[] = getRepositoryList();

    let targetRepoIndex = repositoryList.findIndex((item) => item.name === name);

    return inputAlert({
        title: "Set Repository Alias",
        placeHolder: "Repository Alias",
        value: targetRepoIndex >= 0 ? repositoryList[0].name : undefined,
        prompt: "Repository Alias",
        validateInput(value) {
            return value
                ? null
                : {
                      message: "The Repository Alias don't null",
                      severity: InputBoxValidationSeverity.Error
                  };
        }
    }).then((value) => {
        targetRepoIndex = repositoryList.findIndex((item) => item.name === value);

        //新值重复
        if (targetRepoIndex >= 0 && value) {
            return {
                name: value,
                result: 0
            };
        }

        if (value && name) {
            //修改——有值
            const index = repositoryList.findIndex((item) => item.name === name);
            const targetRepo = repositoryList[index];
            targetRepo.name = value;
            updateRepository(targetRepo, index);
            return {
                name,
                result: 1
            };
        } else if (value && !name) {
            //新增——有值
            const isMaster = repositoryList.length === 0;
            updateRepository({ name: value, master: isMaster, type: RepositoryType.Local }).then(
                () => {
                    if (isMaster) {
                        changeMasterRepository(value);
                    }
                }
            );

            return {
                name: value,
                result: 2
            };
        } else if (!value && name) {
            //修改——没值
            return {
                name,
                result: 3
            };
        } else {
            //新增——没值
            return {
                name: "",
                result: 4
            };
        }
    });
}

/**
 * Setting Or Update Repository Type
 * @param name Repository alias
 * @returns Repository Type. If Cancel or repository not found. return value is undefined
 */
export function setRepositoryType(name: string): Thenable<string | undefined> {
    return quickPickAlert([RepositoryType.Local, RepositoryType.Remote], {
        title: "Select Repository Type",
        placeHolder: "Select Repository Type"
    }).then((value) => {
        const targetRepo = getRepository(name);
        if (targetRepo && value) {
            targetRepo.type = <RepositoryType>value;
            return updateRepository(targetRepo).then(() => {
                return value;
            });
        } else {
            return undefined;
        }
    });
}

/**
 * Setting Or Update Repository Local Folder
 * @param name Repository alias
 * @param folder Folder Uri
 */
export function setRepositoryLocalFolder(
    name: string,
    callack: Thenable<Uri | undefined>
): Thenable<Uri | undefined> {
    return callack.then((folder) => {
        const targetRepo = getRepository(name);
        if (targetRepo && folder) {
            targetRepo.folder = folder.fsPath || "";
            return updateRepository(targetRepo).then(() => folder);
        } else {
            return folder;
        }
    });
}
