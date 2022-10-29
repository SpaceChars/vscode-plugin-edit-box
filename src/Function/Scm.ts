import { InputBoxValidationSeverity, scm, SourceControl, Uri } from "@/common/Types";
import { selectFolder } from "./File";
import { inputAlert } from "./Others";

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
export function initialScmControl(uri: string) {
    console.log("init SCM");
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
            return selectFolder();
        } else {
            return undefined;
        }
    });
}
