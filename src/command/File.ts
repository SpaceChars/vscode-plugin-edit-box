import { CommandOptions, commands, Uri } from "@/common/Types";
import { DocumentTreeItem } from "@/views/Documents";

const result: CommandOptions[] = [
    {
        id: "editbox.command.showInSourceManager",
        event(context, args: any[]) {
            const item: DocumentTreeItem = args[0];
            const path = Uri.file(item.rootPath + "\\" + item.abstreactPath);
            commands.executeCommand("vscode.openFolder", path);
        }
    },
    {
        id: "editbox.command.showDiff",
        event(context, args: any[]) {
            const item: DocumentTreeItem = args[0];
            const path = Uri.file(item.rootPath + "\\" + item.abstreactPath);
            commands.executeCommand("vscode.diff", path);
        }
    }
];

export default result;
