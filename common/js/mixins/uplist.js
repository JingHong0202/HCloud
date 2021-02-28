import {
	mapState,
	mapGetters
} from 'vuex'
export default {
	computed: {
		...mapState('file', ['uplist']),
		...mapGetters('file', ['GET_UPLIST_STATUS'])
	},
	watch: {
		GET_UPLIST_STATUS(newVal, oldVal) {
			uni.setStorage({
				data: this.uplist,
				key: 'downlist'
			})
		},
		"uplist.length"(newVal, oldVal) {
			uni.setStorage({
				data: this.uplist,
				key: 'downlist'
			})
		},
	}
}