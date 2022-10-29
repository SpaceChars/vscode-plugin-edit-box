import { InputBoxOptions, OpenDialogOptions, QuickPickOptions, Uri } from "@/common/Types";
import { MessageAlertType } from "@/common/Enums";
import { useApp } from "./System";

/**
 * 消息弹窗
 * @param message 消息
 * @param type 消息类型
 */
export function messageAlert(message: string, type?: MessageAlertType) {
    type ||= MessageAlertType.INFO;

    if (type === MessageAlertType.INFO) {
        useApp().window.showInformationMessage(message);
    } else if (type === MessageAlertType.WARN) {
        useApp().window.showWarningMessage(message);
    } else {
        useApp().window.showErrorMessage(message);
    }
}

/**
 * 输入框弹窗
 * @param options 配置信息
 * @returns
 */
export function inputAlert(options: InputBoxOptions): Thenable<string | undefined> {
    return useApp().window.showInputBox(options);
}

/**
 *
 * @param options
 * @returns
 */
export function fileAlert(options: OpenDialogOptions): Thenable<Uri[] | undefined> {
    return useApp().window.showOpenDialog(options);
}

/**
 * 下拉选择列表弹框
 * @param items
 * @param options
 * @returns
 */
export function quickPickAlert(
    items: readonly string[] | Thenable<readonly string[]>,
    options: QuickPickOptions
): Thenable<string | undefined> {
    return useApp().window.showQuickPick(items, options);
}
