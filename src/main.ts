import { ExtensionContext } from "@/common/Types";
import { registerAllCommand } from "./command";
import {
    getGlobalConfiguration,
    getSystemStoreModule,
    setExtensionContext
} from "@/Function/System";
import { registerAllViews } from "./views";
import { storeInit, useStore } from "./store";

/**
 * 激活插件
 * @param context 插件上下文
 */
export function activate(context: ExtensionContext) {
    console.log('Congratulations, your extension "Edit Box" is now active!');
    //开启插件
    const config = getGlobalConfiguration();
    config.update("enabled", true);

    storeInit();

    setExtensionContext(context);

    registerAllCommand(context);

    registerAllViews(context);
}

// 关闭/禁用 插件
export function deactivate() {
    const config = getGlobalConfiguration();
    config.update("enabled", false);
}
