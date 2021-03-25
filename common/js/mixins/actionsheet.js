export default {
	methods: {
		move() {
			let selectlist = [this.selectlist];
			this.exitAction()
			uni.$once('showTabBar', () => {
				uni.navigateTo({
					url: "/pages/folder-list/folder-list?from=move",
					success: () => {
						uni.$on('returnData', (res) => {
							console.log(res, selectlist)
						})
					}
				})
			})
		},
		del() {
			uni.$showModal({
				concent: '确定要删除吗?',
				align: 'center'
			}).then(res => {
				// request
				this.exitAction()
			}).catch((res) => {
				this.$hide()
			})
		},
		async addDownList() {
			await this.ADD_DOWN_LIST();
			this.exitAction()

		},
		rename () {
			let selectItem = [...this.selectlist][0]
			uni.$once('showTabBar', () => {
				uni.$off('inputModal-success')
				uni.$once('inputModal-success', () => {
					console.log('reset')
				})
				uni.navigateTo({
					url: "/pages/global/input-modal/input-modal?params="+ encodeURIComponent(JSON.stringify({title: '修改文件名', placeholder: '请输入文件名'}))
				})
			})
			this.exitAction()
		},
		restore () {
			console.log('restore')
		},
		recycleDel () {
			uni.$showModal({
				concent: '确定要删除吗?',
				align: 'center'
			}).then(res => {
				// request
				this.exitAction()
			}).catch((res) => {
				this.$hide()
			})
		},
		share () {
			this.exitAction()
			uni.$once('showTabBar', () => {
				uni.navigateTo({
					url: '/pages/share/share'
				})
			})
		}
	}
}
