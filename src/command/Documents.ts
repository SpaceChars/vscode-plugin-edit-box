import { CommandOptions } from "@/common/Types";
import { refreshDocuemnts } from "@/Function/Documents";

const _result: CommandOptions[] = [
    {
        id: "editbox.command.syncDocument",
        event: () => {}
    },
    {
        id: "editbox.command.refreshDocument",
        event: () => {
            refreshDocuemnts();
        }
    }
];

export default _result;
