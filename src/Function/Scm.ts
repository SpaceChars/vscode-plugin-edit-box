import { extensions, InputBoxValidationSeverity, scm, SourceControl, Uri } from "@/common/Types";
import { API, GitExtension, Ref, RefType, Repository } from "types/git";
import { selectFolder } from "./File";
import { inputAlert } from "./Others";

/**
 * 获取git
 * @returns
 */
export function useGet(): API | undefined {
    const gitExtension = extensions.getExtension<GitExtension>("vscode.git")?.exports;
    return gitExtension?.getAPI(1);
}

/**
 * 创建版本控制器
 * @param rootUri 工作路径
 * @returns
 */
export function createSourceControl(rootUri: Uri): SourceControl {
    return scm.createSourceControl("git", "Git", rootUri);
}

/**
 * 初始化git
 * @param name 仓库别名
 */
export function initialScmControl(dir: string) {
    console.log("init SCM");
}

export function initialzedRemoteBranch(repository: Repository): Promise<Ref> {
    return repository.getBranches({ remote: true }).then((branchs) => {
        if (branchs && branchs.length) {
            branchs.forEach((branch, index) => {
                repository.createBranch(branch.name || "master", index <= 0);
            });
            return branchs[0];
        } else {
            return repository.createBranch("master", true).then(() => {
                return { name: "master", type: RefType.Head };
            });
        }
    });
}

/**
 * 克隆远程仓库
 * @returns
 */
export function cloneRemoteRepository(): Thenable<Uri | undefined> {
    return inputAlert({
        title: "Clone Remote Repository",
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
    }).then((value) => {
        if (value) {
            return selectFolder().then((dir) => {
                if (dir) {
                    const git = useGet();
                    //初始化仓库
                    return git?.init(dir).then((repository) => {
                        //添加主机
                        return repository?.addRemote("origin", value).then(() => {
                            //初始化分支
                            return initialzedRemoteBranch(repository).then((branch) => {
                                //拉取主机
                                return repository.pull().then(() => {
                                    return dir;
                                });
                            });
                        });
                    });
                } else {
                    return undefined;
                }
            });
        } else {
            return undefined;
        }
    });
}
