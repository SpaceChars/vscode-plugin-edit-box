import { ExtensionContext, setExtensionContext } from "@/common/Function";
import { registerAllCommand } from "./common/command";
import { registerAllViews } from "./views";

/**
 * 插件上下文
 * @param context 插件上下文
 */
export function activate(context: ExtensionContext) {
    console.log('Congratulations, your extension "Edit Box" is now active!');

    setExtensionContext(context);

    registerAllCommand(context);

    registerAllViews(context);
}

// This method is called when your extension is deactivated
export function deactivate() {}
