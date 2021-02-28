<template>
	<view class="custom-tabbar action-sheet" v-if='action'>
		<template v-for="(item) in labels">
			<view class="action" v-if="!item.once || (item.once && isOneAndFile)" @click="$emit(item.method)">
				<image mode="aspectFit" class="action-icon" :src="item.icon"></image>
				<text class="action-text">{{item.text}}</text>
			</view>
		</template>
	</view>
</template>

<script>
	// labels中存在once并且为true，则在多选或选择的是集合时隐藏
	import {
		mapState
	} from 'vuex'
	export default {
		props: {
			labels: {
				type: [Array],
				default: () => [{
						text: '下载',
						method: 'download',
						icon: '/static/icon/actionsheet/download.png'
					},
					{
						text: '分享',
						method: 'share',
						icon: '/static/icon/actionsheet/share.png'
					},
					{
						text: '移动',
						method: 'move',
						icon: '/static/icon/actionsheet/move.png'
					},
					{
						text: '重命名',
						method: 'rename',
						icon: '/static/icon/actionsheet/rename.png',
						once: true
					},
					{
						text: '删除',
						method: 'del',
						icon: '/static/icon/actionsheet/del.png'
					}
				]
			}
		},
		computed: {
			...mapState('file', ['action', 'selectlist']),
			isOneAndFile() {
				// 多选或集合的时候返回false
				return this.selectlist.length === 1 ? (this.selectlist[0].type !== 20 ? true : false) : false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.action-sheet {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #e4c774;
		/* #ifdef APP-NVUE */
		border-top-style: solid;
		border-top-width: 1;
		border-color: rgba(0, 0, 0, .3);
		/* #endif */
		/* #ifndef APP-NVUE */
		border-top: 1px solid rgba(0, 0, 0, .3);
		/* #endif */
	}

	.action {
		margin: 0;
		padding: 0;
		flex: 1;
		@extend %f-ct;
		flex-direction: column;
		padding-top: 5px;
		position: relative;
		&:active {
			@extend %active-hover
		}
	}

	.action-icon {
		width: 50rpx;
		flex: 1;
	}

	.action-text {
		font-size: $uni-font-size-sm;
		color: white;
	}

	.custom-tabbar {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		height: 50px;
	}

	// .redDot-box {
	// 	position: absolute;
	// 	right: 0;
	// 	top: 0;
	// 	width: 60rpx;
	// 	height: 60rpx;
	// 	@extend %f-ct;
	// }
	// .redDot-select-length {
	// 	text-align: left;
	// 	flex: 1;
	// 	color: $uni-color-subtitle;
	// 	/* #ifndef APP-NVUE */
	// 	padding-bottom: 10px;
	// 	/* #endif */
	// 	/* #ifdef APP-NVUE */
	// 	padding-bottom: 20px;
	// 	/* #endif */
	// 	font-size: $uni-font-size-sm;
	// }
</style>
