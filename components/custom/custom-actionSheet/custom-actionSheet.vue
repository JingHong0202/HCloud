<template>
	<view class="custom-tabbar action-sheet" v-if='action' :render-whole='true'>
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
		@include position(fixed, false, 0, 0, 0);
		background-color: $app-color-theme-main;
		padding-bottom: 10rpx;
		padding-top: 10rpx;
	}

	.action {
		margin: 0;
		padding: 0;
		@extend %flex;
		@extend %f-ct;
		flex-direction: column;
		position: relative;

		&:active {
			@extend %active-hover
		}
	}

	.action-icon {
		width: 28px;
		height: 28px;
		padding: 1px;
		@extend %flex;
	}

	.action-text {
		font-size: 10px;
		color: white;
		line-height: 15px;
		height: 15px;
	}

	.custom-tabbar {
		flex-direction: row;
		height: 90rpx;
	}
</style>
