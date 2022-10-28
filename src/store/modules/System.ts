import { StoreModuleOptions } from "@/common/Types";

const result: StoreModuleOptions = {
    namespace: true,
    state: {
        activeContext: {}
    },
    mutations: {
        getActiveContext(state) {
            return state.activeContext;
        },
        setActiveContext(state, commit, value) {
            state.activeContext = value;
        }
    }
};

export default result;
