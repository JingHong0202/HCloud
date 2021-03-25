import {
	mapMutations,
	mapState
} from 'vuex'
export default {
	onHide() {
		this.cleanList()
	},
	onShow() {
		uni.$off('select-all')
		uni.$off('cancel-all')
		uni.$on('select-all', () => {
			this.selectAll()
		})
		uni.$on('cancel-all', () => {
			this.cleanList()
		})
	},
	onBackPress() {
		if (this.action) {
			this.cleanList()
			return true
		}
	},
	data() {
		return {
			list: [],
			status: 'more',
			downStatus: 'more',
		}
	},
	computed: {
		...mapState('file', ['action'])
	},
	methods: {
		...mapMutations('file', ['CHANGE_SELECT_LIST']),
		cleanList() {
			this.list.forEach(item => this.$set(item, 'checked', false))
			this.CHANGE_SELECT_LIST([])
		},
		selectAll() {
			this.list.forEach((item) => {
				if (item.type !== 25) this.$set(item, 'checked', true)
			})
			this.CHANGE_SELECT_LIST([...this.list])
		}
	}
}
