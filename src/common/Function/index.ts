import * as vscode from "vscode";

export * from "vscode";

export * from "./Others";

export * from "./System";

export function useApp() {
    return vscode;
}
