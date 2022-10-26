import { ExtensionContext } from "vscode";

export interface CommandOptions {
    id: string;
    event: (context: ExtensionContext,...args:any[]) => void;
}

export class WorkProjectOptions {
  
    name: string;
    folder: string;
    master: boolean;

    constructor(name: string, folder: string, master: boolean) {
        this.name = name;
        this.folder = folder;
        this.master = master;
    }
}
