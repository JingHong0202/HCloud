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
			this.exitAction()
			uni.$off('mkdir-success')
			let page = uni.getSubNVueById('rename')
			uni.$once('mkdir-success', () => {
				console.log('reset')
			})
			page.show('zoom-fade-out',100,() => {
				uni.$emit('initPrompt', {title: '修改文件名', placeholder: '请输入文件名'})
			})
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
		}
	}
}
