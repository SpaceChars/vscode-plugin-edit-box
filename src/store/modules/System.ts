import { StoreModuleOptions } from "@/common/Types";
import { useApp } from "@/Function/System";

const result: StoreModuleOptions = {
    namespace: true,
    state: {
        activeContext: {},
        treeViewProviderMap: new Map()
    },
    mutations: {
        getActiveContext({ state }) {
            return state.activeContext;
        },
        setActiveContext({ state, commit }, value) {
            state.activeContext = value;
        },
        getTreeViewProvider({ state }, viewId) {
            return state.treeViewProviderMap.get(viewId);
        },
        registerTreeView({state},viewId,provider){
            state.treeViewProviderMap.set(viewId,provider);
            return useApp().window.createTreeView(viewId, {
                treeDataProvider: provider
            });
        }
    }
};

export default result;
