export default {
	namespaced: true,
	state: {
		sortAction: uni.getStorageSync('sortAction') || "up",
		sortMode: uni.getStorageSync('sortMode') || 'initials',
		column:  uni.getStorageSync('column') || 1
	},
	mutations: {
		CHANGE_SORTACTION(state, val) {
			uni.setStorage({
				key: 'sortAction',
				data: val,
				success() {
					state.sortAction = val
				}
			})
		},
		CHANGE_SORTMODE(state, val) {
			uni.setStorage({
				key: 'sortMode',
				data: val,
				success() {
					state.sortMode = val
				}
			})
		},
		CHANGE_COLUMN_COUNT(state, val) {
			uni.setStorage({
				key: 'column',
				data: val,
				success() {
					state.column = val
				}
			})
		},
	}
}
