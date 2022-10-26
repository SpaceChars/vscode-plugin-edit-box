import { alert, ConfigurationTarget, getGlobalConfiguration } from "../Function";
import { CommandOptions } from "../Types";

const _result: CommandOptions[] = [
    {
        id: "editbox.enableVSCodeGit",
        event: (context) => {
            const gitConfig = getGlobalConfiguration("git");
            gitConfig.update("enabled", true, ConfigurationTarget.Global);
            alert("Enabled VSCode Git!");
        }
    }
];

export default _result;
