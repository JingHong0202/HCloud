import {
	update,
	del,
	restore
} from '@/api/file.js'
import {
	formatLink,
	cancel,
	shareSave
} from '@/api/share.js'
export default {
	methods: {
		openDir() {
			let select = this.selectlist[0].file_id
			this.exitAction()
			uni.$once('showTabBar', () => {
				if (!select) {
					uni.switchTab({
						url: '/pages/tabbar/file/file',
					})
				} else {
					uni.navigateTo({
						url: '/pages/open-list/open-list?opendir=1&type=folder&uuid=' + select
					});
				}
			})
		},
		save() {
			let selectlist = [...this.selectlist];
			uni.navigateTo({
				url: '/pages/folder-list/folder-list',
				success: () => {
					uni.$once('returnData', async (
						folderPath) => {
						const res = (await shareSave({
							ids: selectlist.map(item => item.uuid).join(','),
							target: folderPath.uuid,
							shareUrl: selectlist[0].share_id,
							shareUser: selectlist[0].user_id
						})).data
						if (res.code === 200) {
							uni.showToast({
								icon: 'success',
								title: '转存成功'
							})
						} else {
							uni.showToast({
								title: '转存失败',
								position: 'bottom'
							})
						}
					})
				}
			})
		},
		move() {
			let selectlist = [...this.selectlist];
			this.exitAction()
			uni.$once('showTabBar', () => {
				uni.navigateTo({
					url: "/pages/folder-list/folder-list?from=move",
					success: () => {
						uni.$on('returnData', async res => {
							const ids = selectlist.map(item => item.uuid).toString()
							const {
								data
							} = (await update({
								val: res.uuid,
								ids,
								action: 'move'
							})).data
							this.refresh_list()
							uni.showToast({
								title: '移动成功',
								icon: 'success'
							})
						})
					}
				})
			})
		},
		del() {
			let selectlist = [...this.selectlist];
			uni.$showModal({
				concent: '确定要删除吗?',
				align: 'center'
			}).then(async res => {
				// request
				this.exitAction()
				await del({
					ids: selectlist.map(item => item.uuid).join(',')
				})
				this.refresh_list()
				uni.showToast({
					title: '删除成功',
					icon: 'success'
				})
			}).catch((res) => {
				this.$hide()
			})
		},
		async addDownList() {
			await this.ADD_DOWN_LIST();
			this.exitAction()
		},
		rename() {
			let selectItem = [...this.selectlist][0]
			uni.$once('showTabBar', () => {
				uni.$off('inputModal-success')
				uni.$once('inputModal-success', () => {
					this.refresh_list()
					uni.showToast({
						title: '重命名完成',
						icon: 'success'
					})
				})
				uni.navigateTo({
					url: "/pages/global/input-modal/input-modal?params=" + encodeURIComponent(JSON
						.stringify({
							selectItem,
							title: '修改文件名',
							placeholder: '请输入文件名'
						}))
				})
			})
			this.exitAction()
		},
		async restore() {
			uni.$showModal({
				concent: '确定要恢复选择的文件吗?',
				align: 'center'
			}).then(async res => {
				let selectlist = [...this.selectlist];
				await restore({
					ids: selectlist.map(item => item.uuid).join(',')
				})
				this.refresh_list()
				uni.showToast({
					title: '恢复完成',
					icon: 'success'
				})
			}).catch((res) => {
				this.$hide()
			})
		},
		recycleDel() {
			let selectlist = [...this.selectlist];
			uni.$showModal({
				concent: '确定要删除吗?',
				align: 'center'
			}).then(async res => {
				// request
				this.exitAction()
				await del({
					ids: selectlist.map(item => item.uuid).join(','),
					mode: true
				})
				this.refresh_list()
				uni.showToast({
					title: '删除完成',
					icon: 'success'
				})
			}).catch((res) => {
				this.$hide()
			})
		},
		share() {
			let ids = [...this.selectlist].map(item => item.uuid);
			this.exitAction()
			uni.$once('showTabBar', () => {
				uni.navigateTo({
					url: '/pages/share/share?ids=' + encodeURIComponent(ids)
				})
			})
		},
		cancelShare() {
			uni.$showModal({
				concent: '确定要取消分享吗?',
				align: 'center'
			}).then(res => {
				cancel({
					ids: [...this.selectlist].map(item => item.id)
				}).then((res) => {
					if (res.data.message === 'success') {
						this.exitAction()
						this.refresh_list()
						uni.showToast({
							title: '取消分享成功',
							icon: 'success'
						})
					}
				})
			}).catch((res) => {
				this.$hide()
			})

		},
		copyLink() {
			let selectlist = [...this.selectlist];

			let format = selectlist.map(item => {
				return `
文件名：${item.first.fileName}
链接：${formatLink(item.url)}
`;
			})
			uni.setClipboardData({
				data: format.join('\n'),
				success: () => {
					uni.showToast({
						title: '链接已复制',
						icon: 'success'
					})
					this.exitAction()
				}
			})
		}
	}
}
