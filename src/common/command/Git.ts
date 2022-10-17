import { CommandOptions } from ".";
import { alert, useApp } from "../Function";

const _result: CommandOptions[] = [
    {
        id: "editbox.enableVSCodeGit",
        event: (context) => {
            context.globalState.update("git.enabled", true);
            alert("Enabled VSCode Git!");
        }
    }
];

export default _result;
