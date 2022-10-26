import { accessSync, readdirSync, statSync } from "fs";

/**
 * 判断文件是否存在
 * @param file 文件路径
 * @returns
 */
export function pathExists(file: string): boolean {
    try {
        accessSync(file);
    } catch (err) {
        return false;
    }
    return true;
}

/**
 * 获取文件夹下所有文件
 * @param dir
 * @returns
 */
export function getFilesByDir(dir: string) {
    return pathExists(dir) ? readdirSync(dir, { encoding: "utf8", withFileTypes: true }) : [];
}

/**
 * 判断是否是文件
 * @param file
 * @returns
 */
export function isFile(file: string) {
    let stat = statSync(file);
    return stat.isFile();
}

/**
 * 判断是否是文件夹
 * @param file
 * @returns
 */
export function isDir(file: string) {
    //判断是否是文件夹 Boolean
    let stat = statSync(file);
    return stat.isDirectory();
}
