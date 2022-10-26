import { alert, fileAlert, inputAlert } from "./Others";
import {
    InputBoxValidationSeverity,
    getConfiguration,
    setConfiguration,
    getTreeViewProvider
} from ".";
import { WorkProjectOptions } from "../Types";
import { WindowAlertType } from "../Enums";
import { Uri } from "vscode";
import { NodeStorageRepositoryTreeViewProvider } from "@/views/Repository";

export function getRepositoryList(): WorkProjectOptions[] {
    return getConfiguration<WorkProjectOptions[]>("work.project", []);
}

export function refreshRepositoryList() {
    //获取视图
    const provider = getTreeViewProvider<NodeStorageRepositoryTreeViewProvider>(
        "editbox.views.storeRepository"
    );
    //刷新
    provider?.onRefresh();
}

/**
 * 设置/修改仓库别名
 * @param name  仓库别名
 */
export function setRepositoryAlias(name?: string): Thenable<string | undefined> {
    return inputAlert({
        title: "Set Repository Alias",
        placeHolder: "Repository Alias",
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
        const projectList: WorkProjectOptions[] = getRepositoryList();

        const targetRepoIndex = projectList.findIndex((item) => item.name === value);

        if (targetRepoIndex >= 0) {
            alert("Alias already exists", WindowAlertType.ERROR);
            return undefined;
        }

        if (value) {
            if (targetRepoIndex >= 0 && name) {
                const index = projectList.findIndex((item) => item.name === name);
                const targetRepo = projectList[index];
                targetRepo.name = value;
                projectList[index] = targetRepo;
                value = name;
            } else {
                projectList.push(new WorkProjectOptions(value, "", false));
            }
        }

        setConfiguration("work.project", projectList);

        return value;
    });
}

/**
 * 设置/更新仓库本地文件夹
 * @param name  仓库别名
 * @returns
 */
export function setRepositoryLocalFolder(name: string): Thenable<Uri[] | undefined> {
    return fileAlert({
        canSelectFiles: false,
        canSelectFolders: true
    }).then(
        (value) => {
            const projectList: WorkProjectOptions[] = getRepositoryList();
            const targetRepoIndex = projectList.findIndex((item) => item.name === name);

            if (targetRepoIndex < 0) {
                alert("Not found repository", WindowAlertType.ERROR);
                return undefined;
            }

            if (!value) {
                alert("value is undefined", WindowAlertType.ERROR);
                return undefined;
            }

            const targetRepo = projectList[targetRepoIndex];
            targetRepo.folder = value[0].fsPath;
            projectList[targetRepoIndex] = targetRepo;

            setConfiguration("work.project", projectList);

            return value;
        },
        (error) => {}
    );
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
