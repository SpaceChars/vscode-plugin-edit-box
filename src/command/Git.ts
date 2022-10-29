import { messageAlert } from "@/Function/Others";
import { getGlobalConfiguration } from "@/Function/System";
import { CommandOptions, ConfigurationTarget } from "../common/Types";

const _result: CommandOptions[] = [
    {
        id: "editbox.command.enableVSCodeGit",
        event: (context) => {
            const gitConfig = getGlobalConfiguration("git");
            gitConfig.update("enabled", true, ConfigurationTarget.Global);
            messageAlert("Enabled VSCode Git!");
        }
    }
];

export default _result;
