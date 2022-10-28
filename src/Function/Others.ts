
import { InputBoxOptions, OpenDialogOptions, Uri } from "@/common/Types";
import { WindowAlertType } from "@/common/Enums";
import { useApp } from "./System";

/**
 * 弹窗
 * @param message 消息
 * @param type 消息类型
 */
export function alert(message: string, type?: WindowAlertType) {
    type ||= WindowAlertType.INFO;

    if (type === WindowAlertType.INFO) {
        useApp().window.showInformationMessage(message);
    } else if (type === WindowAlertType.WARN) {
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
