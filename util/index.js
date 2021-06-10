import {
		baseURL
	} from '@/util/luch-request/server.js'
export function throttle() {
	let busy = true
	return function(fn, delay) {
		if (!busy) return
		busy = false
		setTimeout(() => {
			fn()
			busy = true
		}, delay)
	}
}
export function handlerClipboard() {
	return uni.getClipboardData({
		success(res) {
			const clipboard = getApp().globalData.clipboard || ''
			if (!res) return
			let toJSON = JSON.stringify(res)
			if (toJSON.indexOf(baseURL) === -1) return
			let match = toJSON.match(`(${baseURL}\/share\/.+0+)`)
			if (!match[1]) return
			let parse = match[1].split('/'),
				shareUrl = parse[parse.length - 1]
			if (clipboard.includes(shareUrl)) return
			// 复制的是分享链接，弹出确认窗口
			uni.$showModal({
				concent: '检测到分享链接,是否要打开?',
				align: 'center'
			}).then(res => {
				uni.navigateTo({
					url: '/pages/open-list/open-list?type=share',
					complete: () => {
						uni.$emit('open-list', {
							data: shareUrl
						});

						if (clipboard) {
							getApp().globalData.clipboard += shareUrl + ','
						} else {
							getApp().globalData.clipboard = shareUrl + ','
						}
						getApp().globalData.inClip = false
					}
				})
			}).catch((res) => {
				this.$hide()
			})
		}
	})
}
