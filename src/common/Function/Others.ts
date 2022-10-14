import { useApp } from ".";

export function alert(message: string) {
    useApp().window.showInformationMessage(message);
}
