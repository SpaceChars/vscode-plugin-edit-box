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
import { WindowAlertType } from "@/common/Enums";
import { NodeStorageRepositoryTreeViewProvider } from "@/views/Repository";
import { alert, fileAlert, inputAlert } from "./Others";
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
 * 设置/修改仓库别名
 * @param name  仓库别名
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
            updateRepository(new WorkRepositoryOptions(value, "", isMaster)).then(() => {
                if (isMaster) {
                    changeMasterRepository(value);
                }
            });

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
        const projectList: WorkRepositoryOptions[] = getRepositoryList();
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
    const projectList: WorkRepositoryOptions[] = getRepositoryList();

    let targetRepo = projectList.find((item) => item.name === name);

    const scm = createSourceControl(Uri.file(targetRepo?.folder || ""));

    // tasks
    //     .executeTask(
    //         new Task(
    //             { type: "EditBox" },
    //             TaskScope.Global,
    //             "Clone Git Repository",
    //             "Edit Box",
    //             new ShellExecution(
    //                 "git clone https://github.com/SpaceChars/vscode-plugin-edit-box.git",
    //                 {
    //                     cwd: "E:\\s1"
    //                 }
    //             )
    //         )
    //     )
    //     .then((execution) => {
    //         execution.terminate();
    //     });

    console.log("init SCM");
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
