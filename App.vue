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
		handlerClipboard
	} from '@/util/index.js'

	// import {
	// 	getContent,
	// } from '@/api/share.js'
	// import {
	// 	formatBytes,
	// 	randomString
	// } from '@/util/file.js'
	export default {
		mixins: [downlist, uplist, tabbar],
		methods: {
			...mapMutations('file', ['CHANGE_SELECT_LIST', 'TOGGLE_ACTION']),
		},

		onLaunch: function() {
			// console.log('App Launch')
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
			this.globalData.navObj = this.nav
			// 锁定竖屏
			plus.screen.lockOrientation("portrait-primary")
			const domModule = uni.requireNativePlugin('dom')
			// 只能在开发模式下使用 参考网站https://ask.dcloud.net.cn/article/36400
			domModule.addRule('fontFace', {
				'fontFamily': "iconfont",
				'src': `url('file:/${plus.io.convertLocalFileSystemURL("_www/static/icon/iconfont/iconfont.ttf")}')`
			});
		},
		globalData: {
			mode: 'normlize'
		},

		onShow: async function() {
			let Global = this.globalData
			if (Global.mode === 'previewImage') return Global.mode = 'normlize'
			// console.log('App Show')

			if (!this.globalData.inClip) {
				this.globalData.inClip = true
				setTimeout(() => {
					if (this.globalData.userinfo) {
						handlerClipboard()
					}
				}, 2000)
			}
		},

		onHide: function() {
			let Global = this.globalData
			if (Global.mode === 'previewImage') return
			// console.log('App Hide')
		}
	}
</script>
<style lang="scss">
	/*每个页面公共css */
	.iconfont {
		font-family: iconfont;
		font-size: 16px;
		font-style: normal;
		margin-bottom: 5px;
		color: $uni-text-color;
	}
</style>
