import {
	mapMutations,
	mapState
} from 'vuex'
import {
	LIST_ITEM_NUM
} from '@/common/js/consts.js'
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
		if (getApp().globalData.modal) {
			uni.$hide()
			return true
		}
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
			count: 0,
			page: 0,
			page_max: 0,
			num: LIST_ITEM_NUM,
			skeletonLoading: true
		}
	},
	computed: {
		...mapState('file', ['action'])
	},
	methods: {
		...mapMutations('file', ['CHANGE_SELECT_LIST']),
		setStatus(status, interval = 500) {
			setTimeout(() => {
				this.status = status
			}, interval)
		},
		setDownStatus(status, interval = 500) {
			setTimeout(() => {
				this.downStatus = status
			}, interval)
		},
		cleanList() {
			this.list.forEach(item => this.$set(item, 'checked', false))
			this.CHANGE_SELECT_LIST([])
		},
		selectAll() {
			let list = []
			this.list.forEach((item) => {
				if (item.type !== 25 && item.type !== 20) {
					this.$set(item, 'checked', true)
					list.push(item)
				}
			})
			this.CHANGE_SELECT_LIST(list)
		},
		async refresh() {
			this.downStatus = 'loading'
			// reset
			if (this.action) this.cleanList()
			this.page = 0
			this.count = 0
			// request 完成后显示刷新成功并初始化避免出错，隔段时间关闭下拉框
			await this.init(0)
			this.setDownStatus('more')
		},
		async scrolltolower() {
			this.status = 'loading'
			this.page += 1
			await this.load()
			if (this.page >= this.page_max) return this.setStatus('noMore')
			else this.setStatus('more')
		}
	}
}
