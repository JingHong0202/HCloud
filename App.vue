<script>
	import {
		createSelectNav
	} from '@/util/page.js'
	import {
		mapMutations
	} from 'vuex'
	import sj_show_modal from '@/util/G_show_modal/index.js'
	import downlist from '@/common/js/mixins/downlist.js'
	import uplist from '@/common/js/mixins/uplist.js'
	import tabbar from '@/common/js/mixins/tabbar.js'
	import {
		formatBytes
	} from '@/util/file.js'
	export default {
		mixins: [downlist, uplist, tabbar],
		watch: {

		},
		methods: {
			...mapMutations('file', ['CHANGE_SELECT_LIST', 'TOGGLE_ACTION']),

			handler(item) {
				return new Promise((resolve, reject) => {
					item.task = uni.downloadFile({
						url: item.url,
						success: (res) => {
							if (res.statusCode === 200) {
								this.$set(item, 'status', "SUCCESS")
							} else {
								this.$set(item, 'status', "ERROR")
							}
							resolve(res)
						},
						fail: (res) => {
							this.$set(item, 'status', "ERROR")
							reject(res)
						}
					})

					item.task.onProgressUpdate((res) => {
						this.$set(item, 'percent', res.progress)
						this.$set(item, 'currentSize', formatBytes(res.totalBytesWritten))
						if (!item.totalSize) this.$set(item, 'totalSize', formatBytes(res.totalBytesExpectedToWrite))
						if (item.status === 'ERROR') {
							return item.task.abort();
						}
					});
				})
			},
			async startDownloads() {
				let queue = this.downlist;
				for (let item of queue) {
					console.log(item.status)
					if (item.status === "SUCCESS") continue;
					let res = await this.handler(item)
					console.log(res)
				}
			}
		},
		onLaunch: function() {
			console.log('App Launch')
			// #ifdef  APP-PLUS
			uni.$showModal = function(op = {}) {
				return new Promise((resolve, reject) => {
					let ssm = new sj_show_modal({
						...op,
						$event: function(e) {
							if (e.res) {
								resolve(e);
							} else {
								reject(e);
							}
						}
					})
					ssm.show();
					uni.$hide = function() {
						ssm.hide();
					}
				})
			}


			uni.onTabBarMidButtonTap(function() {
				uni.navigateTo({
					url: "/pages/tabbar/midButtomMenu/midButtomMenu",
					animationType: "fade-in"
				})
				return
			})
			// 初始化选择模式的导航栏
			this.nav = createSelectNav()
			getApp().globalData.navObj = this.nav
			// 锁定竖屏
			plus.screen.lockOrientation("portrait-primary")

			// if (this.downlist.length && this.downlist.filter(item => item.status === 'RUNTIME').length) this.startDownloads()

			// #endif
		},
		globalData: {
			mode: 'normlize'
		},
		onShow: async function() {
			let Global = getApp().globalData
			if (Global.mode === 'previewImage') return Global.mode = 'normlize'
			console.log('App Show')
			const domModule = uni.requireNativePlugin('dom')
			// 只能在开发模式下使用 参考网站https://ask.dcloud.net.cn/article/36400
			domModule.addRule('fontFace', {
				'fontFamily': "iconfont",
				'src': `url('file:/${plus.io.convertLocalFileSystemURL("_www/static/icon/iconfont/iconfont.ttf")}')`
			});

		},
		onHide: function() {
			let Global = getApp().globalData
			if (Global.mode === 'previewImage') return
			// uni.clearStorageSync()
			console.log('App Hide')
		}
	}
</script>
<style lang="scss">
	/*每个页面公共css */
	/* #ifndef APP-NVUE */
	@import "~@/static/icon/iconfont/iconfont.css";
	// @import "~@/common/css/animate.css";

	/* #endif */
	/* #ifdef APP-NVUE */
	.iconfont {
		font-family: iconfont;
		font-size: 16px;
		font-style: normal;
		margin-bottom: 5px;
		color: $uni-text-color;
	}

	/* #endif */
</style>
