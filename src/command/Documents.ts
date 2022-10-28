import { CommandOptions } from "@/common/Types";
import { refreshDocuemnts } from "@/Function/Documents";

import { alert } from "@/Function/Others";

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
