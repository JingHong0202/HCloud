<template>
	<scroll-view scroll-x="true" class="breadCrumb" show-scrollbar='false'  :scroll-left="left" >
		<view v-for="(item,i) in path" class="breadCrumb-item" @click="toFolder(item)">
			<text class="breadCrumb-item-text" ref='current'  :class="{'current-breadCrumb-item': i === path.length - 1}" >{{item.title}}</text>
			<text class="breadCrumb-item-text separator">{{path.length !== 1 && i !== path.length -1 ? '/' : ''}}</text>
		</view>
	</scroll-view>
</template>

<script>
	const dom = uni.requireNativePlugin('dom')
	export default {
		props: {
			path: {
				type: Array,
				default: () => [{
					title: '全部文件'
				}]
			}
		},
		watch: {
			path () {
				if (!this.$refs['current']) return
				dom.getComponentRect(this.$refs['current'][this.$refs['current'].length - 1], ({size}) => {
					this.left = size.left
				})
			}
		},
		methods: {
			toFolder(item) {
				// 根据item.uuid获取对应的列表
			}
		},
		
		data() {
			return {
				left: 0
			};
		}
	}
</script>

<style lang="scss" scoped>
	.breadCrumb {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		height: 60rpx;
		align-items: center;
		padding: 0 25rpx;
		background-color: white;
		margin-top: 20rpx;
	}

	.breadCrumb-item-text {
		color: #808080;
		font-size: $uni-font-size-base;
	}

	.separator {
		margin: 0 10rpx;
		font-size: $uni-font-size-base;
	}

	.current-breadCrumb-item {
		color: #78B9F0;
	}
</style>
