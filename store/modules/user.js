export default {
	namespaced: true,
	state: {
		info: {},
		// token: uni.getStorageSync('token')
	},
	// actions: {
		
	// },
	mutations: {
		INIT_USER(state, val) {
			state.info = val
		},
		CHANGE_TOKEN(state,val) {
			state.token = val
		}
	},
	// getters: {
		
	// }
}
