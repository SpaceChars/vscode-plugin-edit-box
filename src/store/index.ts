import { Store, StoreInstance } from "./core";

import system from "./modules/System";

const _store = new Store({
    modules: {
        system
    }
});

let _storeInstance: StoreInstance;

/**
 * 使用储存实例
 * @returns
 */
export function useStore(): StoreInstance {
    return _storeInstance;
}

/**
 * 储存挂载
 */
export function storeInit(): void {
    _storeInstance = _store.create();
}
