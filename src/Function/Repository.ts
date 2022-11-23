import { RepositoryType, MessageAlertType } from "@/common/Enums";
import {
    WorkRepositoryOptions,
    Uri,
    InputBoxValidationSeverity,
    Result
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
export function refreshRepositorysView() {
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
export function setRepositoryList(value: WorkRepositoryOptions[]): Thenable<void> {
    return setConfiguration("work.repositorys", value);
}

/**
 * 更新仓库值
 * @param value 值
 * @param index 下标
 */
export function setRepository(value: WorkRepositoryOptions, index?: number): Thenable<void> {
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
 * @param name 目标仓库
 * @returns
 */
export function changeMasterRepository(name?: string): Thenable<void> {
    let repositoryList = getRepositoryList();

    //判断目标仓库是否存在
    const target = repositoryList.find((item) => item.name === name);
    let masterName = "";

    if (target && name) {
        repositoryList = repositoryList.map((item) => {
            item.master = item.name === name;
            return item;
        });
        masterName = target.name;
    } else {
        const masterTarget = repositoryList.find((item) => item.master);
        //判断是否存在master仓库，不存在默认第一个
        if (!masterTarget) {
            repositoryList = repositoryList.map((item, index) => {
                if (index <= 0) {
                    masterName = item.name;
                }
                item.master = index <= 0;
                return item;
            });
        } else {
            masterName = masterTarget.name;
        }
    }

    //更新仓库
    return setRepositoryList(repositoryList).then(() => {
        return setConfiguration("work.repositorys.master", masterName);
    });
}

/**
 * Setting Or Update Repository Alias
 * @param name  Repository Alias
 * @return
 */
export function setRepositoryAlias(name?: string): Thenable<Result<String>> {

    const repositoryList = getRepositoryList();

    return inputAlert({
        title: "Set Repository Alias",
        placeHolder: "Repository Alias",
        prompt: "Repository Alias",
        validateInput(value) {

            if (!value) {
                return {
                    message: "The Repository Alias don't null",
                    severity: InputBoxValidationSeverity.Error
                };
            }

            const item = repositoryList.find(item => item.name === value);
            if (item) {
                return {
                    message: `${item.name} Already exists`,
                    severity: InputBoxValidationSeverity.Error
                };
            }

            return null;
        }
    }).then((value) => {

        console.log(value);


        const result: Result<String> = {};

        if (name) {
            if (value) {

            }
        } else {

        }

        // if (!value) { result.data = undefined };

        return result;

        // targetRepoIndex = repositoryList.findIndex((item) => item.name === value);

        // //新值重复
        // if (targetRepoIndex >= 0 && value) {
        //     return {
        //         name: value,
        //         result: 0
        //     };
        // }

        // if (value && name) {
        //     //修改——有值
        //     const index = repositoryList.findIndex((item) => item.name === name);
        //     const targetRepo = repositoryList[index];
        //     targetRepo.name = value;
        //     setRepository(targetRepo, index);
        //     return {
        //         name,
        //         result: 1
        //     };
        // } else if (value && !name) {
        //     //新增——有值
        //     const isMaster = repositoryList.length === 0;
        //     setRepository({ name: value, master: isMaster, type: RepositoryType.Local }).then(
        //         () => {
        //             if (isMaster) {
        //                 changeMasterRepository(value);
        //             }
        //         }
        //     );

        //     return {
        //         name: value,
        //         result: 2
        //     };
        // } else if (!value && name) {
        //     //修改——没值
        //     return {
        //         name,
        //         result: 3
        //     };
        // } else {
        //     //新增——没值
        //     return {
        //         name: "",
        //         result: 4
        //     };
        // }
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
            // targetRepo.type = <RepositoryType>value;
            // return setRepository(targetRepo).then(() => {
            //     return value;
            // });
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
            return setRepository(targetRepo).then(() => folder);
        } else {
            return folder;
        }
    });
}
