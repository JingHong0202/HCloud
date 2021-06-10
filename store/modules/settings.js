export default {
	namespaced: true,
	state: {
		down_target: ''
	},
	actions: {
	
	},
	mutations: {
		CHANGE_DOWN_TARGET (state, newVal) {
			return state.down_target = newVal
		}
	},
	getters: {
		
	}
}
