import {
	mapState,
	mapGetters
} from 'vuex'
import {
	formatBytes,
	enum_down_list,
	beforeDown
} from '@/util/file.js'
import {
	throttle
} from '@/util/index.js'
export default {
	computed: {
		...mapState('file', ['downlist']),
		...mapState('settings', ['down_target']),
		...mapGetters('file', ['GET_DOWNLIST_LOADING', 'GET_DOWNLIST_RUNTIME'])
	},
	methods: {
		async init_downlist() {
			let list = await enum_down_list();
			// console.log(list)
			// 去重
			let addlist = this.downlist.filter(item => {
				if (item.status === 'SUCCESS') return false
				return !list.some(item2 => item2.options.uuid === item.uuid)
			})
			if (addlist.length) {
				await Promise.all(addlist.map(async item => {
					const {
						signUrl
					} = await beforeDown(item)
					plus.downloader.createDownload(signUrl, {
						filename: `_downloads/${this.globalData.userinfo.mobile}/${item.fileName}`,
						uuid: item.uuid
					})
				}))
			}
			// 恢复上次的下载信息
			(await enum_down_list()).forEach((item, i) => {
				let find = this.downlist.find(item2 => item2.uuid === item.options.uuid)
				if (item.state === 3) {
					find.totalSize = formatBytes(item.totalSize)
					find.currentSize = formatBytes(item.downloadedSize)
					find.percent = 100 * (item.downloadedSize / item.totalSize)
				}
				find.task = item
				let closure = throttle()
				find.task.addEventListener('statechanged', (download, status) => closure(() => {
					let totalSize = download.totalSize || find.file_size,
						downloadedSize = download.downloadedSize,
						state = download && download.state
					if (find.status === 'SUCCESS' || !totalSize || !downloadedSize)
						return
					if (state === 4) {
						if (totalSize === downloadedSize) {
							let tempPath = plus.io.convertLocalFileSystemURL(find.task
								.filename);
							find.downPath = tempPath
							this.$set(find, 'status', 'SUCCESS')
						}
					}
					if (status >= 400 ) {
						if (status !== 416) {
							this.$set(find, 'status', 'ERROR')
							find.task.abort()
							return
						}
					}
					if (!find.totalSize) this.$set(find, 'totalSize', formatBytes(
						totalSize))
					this.$set(find, 'percent', 100 * (downloadedSize / totalSize))
					this.$set(find, 'currentSize', formatBytes(downloadedSize))
				}, 1000), false)
			})
		}
	},
	data() {
		return {
			// down_move_queue: [],
			// down_moved: [],
			down_handler_timer: null
		}
	},
	watch: {
		async "downlist.length"(newVal, oldVal) {
			if (newVal) {
				await this.init_downlist()
			}
			uni.setStorage({
				data: this.downlist,
				key: `${this.globalData.userinfo.mobile}-downlist`
			})
		},
		// down_move_queue(newVal, oldVal) {
		// 	if (!newVal.length) return
		// 	let current = newVal[0]
		// 	if (this.down_moved.some(item => item.path === current.path && item.name === current.name && item.uuid ===
		// 			current.uuid)) {
		// 		return this.down_move_queue.shift()
		// 	} else {
		// 		this.moveFile(current.path, current.name)
		// 			.then((res) => {
		// 				if (res.msg === 'success') {
		// 					this.down_moved.push({
		// 						path: current.path,
		// 						name: current.name,
		// 						uuid: current.uuid
		// 					})
		// 					let find = this.downlist.find(item => item.uuid === current.uuid)
		// 					find.status = "SUCCESS"
		// 					find.downPath = res.path
		// 					find.task && find.task.abort()
		// 				} else {
		// 					console.log(res.msg)
		// 				}
		// 			})
		// 			.catch(err => {
		// 				console.log(err)
		// 				find.status = "ERROR"
		// 			})
		// 	}
		// },
		GET_DOWNLIST_RUNTIME(newVal, oldVal) {
			if (newVal.length) {
				newVal.forEach((item) => {
					let task = item.task,
						state = item.task && item.task.state
					task.pause()
					task.resume()

				})
			}
		},
		async GET_DOWNLIST_LOADING(newVal, oldVal) {
			// 最多支持同时进行下载的个数
			const concurrency = 3
			if (newVal.length) {
				clearInterval(this.down_handler_timer)
				this.down_handler_timer = setInterval(() => {
					if (this.GET_DOWNLIST_RUNTIME.length === concurrency) return
					newVal.slice(0, concurrency).forEach(item => {
						if (this.GET_DOWNLIST_RUNTIME.length < concurrency) {
							item.status = 'RUNTIME'
						}
					})
				}, 2000)
			} else {
				clearInterval(this.down_handler_timer)
			}
			uni.setStorage({
				data: this.downlist,
				key: `${this.globalData.userinfo.mobile}-downlist`
			})
		}
	}
}
