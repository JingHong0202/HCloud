<template>
	<uni-list :border="false" scrollY>
		<uni-list-item v-for=" (item,i) in list" :key='item[mode_key]' :ellipsis="1" clickable
			:thumb="selectThumb(item)" thumbSize="lg" @click="toggle(item)" @longpress='showActionSheet(item)'>
			<template slot='body'>
				<view class="status-info-box">
					<text class="item-name">{{item.fileName}}</text>
					<template v-if="item.status !== 'SUCCESS'">
						<view class="item-progress-info">
							<text class="current-progress">{{item.totalSize ? (item.totalSize + '/')  : ''}}</text>
							<text class="total-progress">{{item.currentSize || ''}}</text>
							<text class="item-status">{{status(item.status)}}</text>
						</view>
						<custom-progress :PropPercent="item.percent" :PropStatus='item.status' />
					</template>
					<template v-else>
						<text class="item-status">{{status(item.status)}}</text>
					</template>
				</view>
			</template>
			<template slot='footer'>
				<view class="item-right">
					<radio class="radio" v-if='action' color="#4070ff" :class="item.checked ? 'checked' : ''"
						:checked="item.checked">
					</radio>
					<view class="item-btn" v-if='item.status !== "SUCCESS" && !action'>
						<image :src="statusIcon(item.status)" mode="aspectFit" class="item-btn-img"></image>
					</view>
				</view>
			</template>
		</uni-list-item>
	</uni-list>
</template>

<script>
	import {
		selectIcon
	} from '@/util/file.js'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import {
		preview
	} from '@/api/file.js'
	import {
		beforeDown,
		formatBytes
	} from '@/util/file.js'
	import {
		throttle
	} from '@/util/index.js'
	export default {
		props: {
			list: {
				type: Array,
				default: () => []
			},
			mode: Boolean
		},
		computed: {
			...mapState('file', ['action', 'selectlist']),
			mode_key() {
				return this.mode ? 'uuid' : 'md5'
			},
			statusIcon() {
				return (status) => {
					return `/static/icon/page/status/${status === 'RUNTIME' ||  status === 'LOADING' ? 'stop' :  'play'}.png`
				}
			},
			status() {
				return (status) => {
					switch (status) {
						case 'RUNTIME':
							return this.mode ? '下载中' : '上传中'
							break;
						case 'ERROR':
							return this.mode ? '下载错误' : '上传错误'
							break;
						case 'LOADING':
							return '等待中'
						case 'STOP':
							return '暂停中'
						case 'SUCCESS':
							return this.mode ? '下载成功' : '上传成功'
					}
				}
			}
		},
		methods: {
			...mapMutations('file', ['CHANGE_SELECT_LIST', 'CHANGE_DOWN_LIST']),
			showActionSheet(item) {
				if (this.action) return
				// if (item.status === 'SUCCESS') return
				return this.addSelectList(item)
			},
			async toggle(item) {
				if (this.action) return this.addSelectList(item)
				if (this.mode) {
					switch (item.status) {
						case 'SUCCESS':
							plus.runtime.openFile("file:///" + item.downPath, {}, err => uni.showToast({
								title: '没有支持该扩展的app',
								position: 'bottom',
								icon: 'none'
							}))
							return
							break
						case 'RUNTIME':
							item.task.pause()
							this.$set(item, 'status', 'STOP')
							break
						case 'LOADING':
							this.$set(item, 'status', 'STOP')
							break
						case 'STOP':
							this.$set(item, 'status', 'LOADING')
							break
						case 'ERROR':
							delete item.task
							const {
								signUrl
							} = await beforeDown(item)
							item.task = plus.downloader.createDownload(signUrl, {
								filename: `_downloads/${getApp().globalData.userinfo.mobile}/${item.fileName}`,
								uuid: item.uuid
							})
							let closure = throttle()
							item.task.addEventListener('statechanged', (download, status) => closure(() => {
								try{
									let totalSize = download.totalSize || find.file_size
									if (item.status === 'SUCCESS' || !totalSize || !download.downloadedSize) return
									if (download.state === 4) {
										if (totalSize === download.downloadedSize) {
											let tempPath = plus.io.convertLocalFileSystemURL(item.task
												.filename);
											item.downPath = tempPath
											this.$set(item, 'status', 'SUCCESS')
										}
									}
									if (status >= 400) {
										if (status !== 416) {
											this.$set(item, 'status', 'ERROR')
											item.task.abort()
											return
										}
									}
									if (!item.totalSize) this.$set(item, 'totalSize', formatBytes(
										totalSize))
									this.$set(item, 'percent', 100 * (download.downloadedSize / totalSize))
									this.$set(item, 'currentSize', formatBytes(download.downloadedSize))
								}catch(e){
									this.$set(item, 'status', 'ERROR')
									item.task.abort()
								}
							}, 1000), false)
							this.$set(item, 'status', 'LOADING')
							break
					}
				} else {
					// if (this.action) return this.addSelectList(item)
					if (item.status === 'SUCCESS') {
							if (!item.file_id) {
								uni.switchTab({
									url: '/pages/tabbar/file/file',
								})
							} else {
								uni.navigateTo({
									url: '/pages/open-list/open-list?opendir=1&type=folder&uuid=' + item.file_id
								});
							}
						return
					}
					if (item.status === 'RUNTIME' || item.status === 'LOADING') {
						this.$set(item, 'status', 'STOP')
					} else {
						this.$set(item, 'status', 'LOADING')
					}
				}
				this.$forceUpdate()
			},
			addSelectList(item) {
				if (this.selectlist.indexOf(item) >= 0) {
					this.$set(item, 'checked', false)
					let newArr = [...this.selectlist]
					newArr.splice(this.selectlist.findIndex(item2 => item2 === item), 1)
					this.CHANGE_SELECT_LIST(newArr)
				} else {
					this.$set(item, 'checked', true)
					this.CHANGE_SELECT_LIST([...this.selectlist, item])
				}
				this.$forceUpdate()
			},
			selectThumb(current) {
				if (current.type === 1 || current.type === 3) return this.mode ? preview(current.uuid, true) : current
					.thumb;
				return selectIcon(current.type);
			},
		}
	}
</script>

<style scoped lang="scss">
	.status-info-box {
		@extend %flex;
		flex-direction: column;
	}

	.item-name {
		font-size: $uni-font-size-base;
		lines: 1;
		margin-bottom: 15rpx;
	}

	.current-progress,
	.total-progress,
	.item-status {
		font-size: $uni-font-size-sm;
		margin-top: 10rpx;
		color: $uni-color-subtitle;
	}

	.item-right {
		@extend %f-ct;
		width: 30px;
	}

	.item-btn-img {
		height: 15px;
		width: 15px;
	}
</style>
