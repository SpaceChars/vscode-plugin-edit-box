import { alert, fileAlert, inputAlert } from "./Others";
import {
    InputBoxValidationSeverity,
    getConfiguration,
    setConfiguration,
    getTreeViewProvider
} from ".";
import { SetRepositoryPropertyResult, WorkProjectOptions } from "../Types";
import { WindowAlertType } from "../Enums";
import { NodeStorageRepositoryTreeViewProvider } from "@/views/Repository";

/**
 * 获取仓库列表
 * @returns
 */
export function getRepositoryList(): WorkProjectOptions[] {
    return getConfiguration<WorkProjectOptions[]>("work.project", []);
}

/**
 * 刷新仓库视图
 */
export function refreshRepositoryList() {
    //获取视图
    const provider = getTreeViewProvider<NodeStorageRepositoryTreeViewProvider>(
        "editbox.views.storeRepository"
    );
    //刷新
    provider?.onRefresh();
}

/**
 * 重置仓库列表
 * @param value
 * @returns
 */
export function resetRepositoryList(value: WorkProjectOptions[]): Thenable<void> {
    return setConfiguration("work.project", value);
}

/**
 * 更新仓库值
 * @param value 值
 * @param index 下标
 */
export function updateRepository(value: WorkProjectOptions, index?: number): Thenable<void> {
    const list = getRepositoryList();
    index ||= list.findIndex((item) => item.name === value.name);

    if (index >= 0) {
        list[index] = value;
    } else {
        list.push(value);
    }
    return setConfiguration("work.project", list);
}

/**
 * 设置/修改仓库别名
 * @param name  仓库别名
 */
export function setRepositoryAlias(name?: string): Thenable<SetRepositoryPropertyResult> {
    const repositoryList: WorkProjectOptions[] = getRepositoryList();

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
            updateRepository(new WorkProjectOptions(value, "", repositoryList.length === 0));
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
 * 设置/更新仓库本地文件夹
 * @param name  仓库别名
 * @returns
 */
export function setRepositoryLocalFolder(name: string): Thenable<SetRepositoryPropertyResult> {
    return fileAlert({
        canSelectFiles: false,
        canSelectFolders: true
    }).then((value) => {
        const projectList: WorkProjectOptions[] = getRepositoryList();
        const targetRepoIndex = projectList.findIndex((item) => item.name === name);

        if (targetRepoIndex < 0) {
            alert("Not found repository", WindowAlertType.ERROR);

            return {
                name,
                result: 5
            };
        }

        if (!value) {
            return {
                name,
                result: 3
            };
        }

        const targetRepo = projectList[targetRepoIndex];
        targetRepo.folder = value ? value[0].fsPath : "";
        updateRepository(targetRepo, targetRepoIndex);

        return {
            name,
            result: 1
        };
    });
}

/**
 * 初始化git
 * @param name 仓库别名
 */
export function initialScmControl(name: string) {
    const projectList: WorkProjectOptions[] = getRepositoryList();

    const targetRepoIndex = projectList.findIndex((item) => item.name === name);
    const targetRepo = projectList[targetRepoIndex];
}

/**
 * 设置/更改仓库地址
 * @param name 仓库别名
 * @returns
 */
export function setRepositoryUrl(name: string): Thenable<string | undefined> {
    return inputAlert({
        title: "Set Git Repository url",
        placeHolder: "Repository URL",
        prompt: "Git Repository url",
        validateInput(value) {
            const result = /^(https\:|git\@)+.*(\.git)$/g.test(value);
            return result
                ? null
                : {
                      message: "The Git Repository url can start with 'HTTPS' or 'SSH' only",
                      severity: InputBoxValidationSeverity.Error
                  };
        }
    });
}

/**
 * 设置/更改仓库有用户名
 * @param name 仓库别名
 * @returns
 */
export function setRepositoryUsername(name?: string): Thenable<string | undefined> {
    return inputAlert({
        title: "Set Git Repository UserName",
        placeHolder: "UserName",
        prompt: "Git Repository UserName",
        validateInput(value) {
            return value
                ? null
                : {
                      message: "The Git Repository User Name don't null",
                      severity: InputBoxValidationSeverity.Error
                  };
        }
    });
}

/**
 * 设置/更改仓库账户密码
 * @param name 仓库别名
 * @returns
 */
export function setRepositoryPassword(name?: string): Thenable<string | undefined> {
    return inputAlert({
        title: "Set Git Repository Password",
        placeHolder: "Passowrd",
        prompt: "Git Repository Password",
        validateInput(value) {
            return value
                ? null
                : {
                      message: "The Git Repository Password don't null",
                      severity: InputBoxValidationSeverity.Error
                  };
        }
    });
}
