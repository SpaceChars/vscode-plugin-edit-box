import { scm, SourceControl, Uri } from "@/common/Types";

/**
 * 创建版本控制器
 * @param rootUri 工作路径
 * @returns
 */
export function createSourceControl(rootUri: Uri): SourceControl {
    return scm.createSourceControl("git", "Git", rootUri);
}
