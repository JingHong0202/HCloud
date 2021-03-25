export default {
	watch: {
		action(newVal) {
			if (!newVal) {
				this.$refs['list'].toScrollTop()
			}
		}
	},
	created() {
		this.wHeight = uni.getSystemInfoSync().windowHeight
	},
	data() {
		return {
			wHeight: 0
		}
	}
}