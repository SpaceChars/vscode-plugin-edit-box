import { alert } from "../Function";
import { refreshDocuemnts } from "../Function/Documents";
import { CommandOptions } from "../Types";

const _result: CommandOptions[] = [
    {
        id: "editbox.syncDocument",
        event: () => {
            refreshDocuemnts();
            alert("Synchronization Document!");
        }
    }
];

export default _result;
