import * as vscode from "vscode";

export * from "vscode";

export * from "./Others";

export * from "./System";

export * from "./File";

export function useApp() {
    return vscode;
}
