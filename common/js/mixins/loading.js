export default {
	props: {
		upText: {
			type: Object,
			default: () => {
				return {
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '已经到底了'
				}
			}
		},
		status: {
			type: String,
			default: "more"
		},
	},
	computed: {
		display() {
			return this.status === 'loading' ? 'show' : 'hide'
		}
	},
	methods: {
		loadMore() {
			this.$emit('scrolltolower')
		}
	},
	watch: {
		status(newVal) {
			if (newVal === 'noMore') uni.showToast({
				position: 'bottom',
				title: '已经到底了'
			})
		}
	}
}
