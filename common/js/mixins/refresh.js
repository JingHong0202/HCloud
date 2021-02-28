export default {
	props: {
		downStatus: {
			type: String,
			default: "more"
		},
		downText: {
			type: Object,
			default: () => {
				return {
					contentdown: '释放刷新',
					contentrefresh: '正在刷新...',
					contentnomore: '刷新成功'
				}
			}
		}
	},
	computed: {
		downDisplay() {
			return this.downStatus === 'loading' || this.downStatus === 'noMore' ? "show" : "hide"
		}
	},
	methods: {
		refresh() {
			this.$emit('refresh')
		}
	},
}
