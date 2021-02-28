import {
	mapState,
	mapGetters
} from 'vuex'
export default {
	computed: {
		...mapState('file', ['downlist']),
		...mapGetters('file', ['GET_DOWNLIST_STATUS'])
	},
	watch: {
		GET_DOWNLIST_STATUS(newVal, oldVal) {
			uni.setStorage({
				data: this.downlist,
				key: 'downlist'
			})
		},
		"downlist.length"(newVal, oldVal) {
			uni.setStorage({
				data: this.downlist,
				key: 'downlist'
			})
		},
	}
}
