<template>
	<view class="custom-statusList" ref='box'>
		<uni-collapse>
			<template v-if='runtimeList.length'>
				<uni-collapse-item :title="`进行中(${runtimeList.length})`" open='true'>
					<uni-list :border="false" :scrollY="true" class="status-list" :style='{height: `${listHeight}px`}'  >
						<uni-list-item v-for=" (item,i) in runtimeList" :key='item.uuid' :ellipsis="2" clickable :thumb="selectThumb(item)" @click="toggle(item)"
						 @longpress='showActionSheet(item)'>
							<template slot='body'>
								<view class="status-info-box">
									<text class="item-name">{{item.fileName}}</text>
									<view class="item-progress-info">
										<text class="current-progress">{{item.totalSize ? (item.totalSize + '/')  : ''}}</text>
										<text class="total-progress">{{item.currentSize || ''}}</text>
										<text class="item-status"> {{status(GET_DOWNLIST_STATUS[i], "down")}}</text>
									</view>
									<custom-progress :PropPercent="item.percent" :PropStatus='GET_DOWNLIST_STATUS[i]'></custom-progress>
								</view>
							</template>
							<template slot='footer'>
								<view class="item-right">
									<radio class="radio" v-if='action' color="#e4c774" :class="item.checked ? 'checked' : ''" :checked="item.checked">
									</radio>
									<view class="item-btn" v-else>
										<image :src="`/static/icon/page/status/${GET_DOWNLIST_STATUS[i] === 'RUNTIME' ||  GET_DOWNLIST_STATUS[i] === 'LOADING' ? 'stop' :  'play'}.png`"
										 mode="aspectFit" class="item-btn-img"></image>
									</view>
								</view>

							</template>
						</uni-list-item>
					</uni-list>
				</uni-collapse-item>
			</template>
			<template v-if="successList.length">
				<uni-collapse-item :title="`完成(${successList.length})`">
					<uni-list :border="false" :scrollY="true" class="status-list">
						<uni-list-item v-for=" (item,i) in successList" :key='item.uuid'  :ellipsis="2" clickable :thumb="selectThumb(item)" @click="toggle(item)"
						 @longpress='showActionSheet(item)'>
							<template slot='body'>
								<view class="status-info-box">
									<text class="item-name">{{item.fileName}}</text>
									<view class="item-progress-info">
										<text class="current-progress">{{item.totalSize ? (item.totalSize + '/')  : ''}}</text>
										<text class="total-progress">{{item.currentSize || ''}}</text>
										<text class="item-status"> {{status(GET_DOWNLIST_STATUS[i], "down")}}</text>
									</view>
									<custom-progress :PropPercent="item.percent" :PropStatus='GET_DOWNLIST_STATUS[i]'></custom-progress>
								</view>
							</template>
							<template slot='footer'>
								<view class="item-right">
									<radio class="radio" v-if='action' color="#e4c774" :class="item.checked ? 'checked' : ''" :checked="item.checked">
									</radio>
									<view class="item-btn" v-else>
										<image :src="`/static/icon/page/status/${GET_DOWNLIST_STATUS[i] === 'RUNTIME' ||  GET_DOWNLIST_STATUS[i] === 'LOADING' ? 'stop' :  'play'}.png`"
										 mode="aspectFit" class="item-btn-img"></image>
									</view>
								</view>

							</template>
						</uni-list-item>
					</uni-list>
				</uni-collapse-item>
			</template>
		</uni-collapse>

	</view>
</template>

<script>
	const dom = uni.requireNativePlugin('dom')
	import {
		mapState,
		mapMutations,
		mapGetters
	} from 'vuex'
	import {
		selectIcon
	} from '@/util/file.js'
	export default {
		props: {
			list: {
				default: () => [],
				type: Array
			}
		},
		mounted() {
			dom.getComponentRect(this.$refs['box'],res => {
				this.listHeight = res.size.height - 50
			})
		},
		data() {
			return {
				listHeight:'',
				listWidth: ''
			}
		},
		methods: {
			...mapMutations('file', ['CHANGE_SELECT_LIST', 'CHANGE_DOWN_LIST']),
			showActionSheet(item) {
				if (this.action) return
				return this.addSelectList(item)
			},
			toggle(item) {
				if (this.action) return this.addSelectList(item)
				if (item.status === 'RUNTIME' || item.status === 'LOADING') {
					this.$set(item, 'status', 'STOP')
					// if (item.task) return item.task.abort()
				} else {
					this.$set(item, 'status', 'RUNTIME')
				}
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
				if (current.type === 1 || current.type === 3) return current.thumb;
				return selectIcon(current.type);
			},
		},
		computed: {
			...mapState('file', ['action', 'selectlist']),
			...mapGetters('file', ['GET_DOWNLIST_STATUS']),
			successList() {
				return this.list.filter(item => item.status === "SUCCESS")
			},
			errorList() {
				return this.list.filter(item => item.status === "ERROR")
			},
			runtimeList() {
				return this.list.filter(item => item.status !== "ERROR" || item.status !== "SUCCESS")
			},
			status() {
				return (status, mode) => {
					switch (status) {
						case 'RUNTIME':
							return mode === 'down' ? '下载中' : '上传中'
							break;
						case 'ERROR':
							return mode === 'down' ? '下载错误' : '上传错误'
							break;
						case 'LOADING':
							return '等待中'
						case 'STOP':
							return '暂停中'
						case 'SUCCESS':
							return mode === 'down' ? '下载成功' : '上传成功'
					}
				}
			}
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
	}

	.current-progress,
	.total-progress,
	.item-status {
		font-size: $uni-font-size-sm;
		color: $uni-color-subtitle;
	}

	.item-right {
		/* #ifndef APP-NVUE  */
		height: 100%;
		@extend %f-ct;
		/* #endif  */

		/* #ifdef APP-NVUE */
		@extend %f-ct;
		/* #endif  */
		width: 30px;
	}

	.item-btn-img {
		height: 15px;
		width: 15px;
	}

	.custom-statusList {
		@extend %flex;
	}

	.status-list {
		width: 750rpx;
		// height: 750rpx;
	}
</style>
