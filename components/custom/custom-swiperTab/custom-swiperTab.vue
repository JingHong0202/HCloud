<template>
	<scroll-view scroll-x="true" class="tabbar">
		<view class="tabbar-item" v-for="(item,i) in labels" :key='item' ref='tabbar-item' @click="$emit('change', i)">
			<text class="tabbar-item-title" :class="{'tabbar-item-active-title': index === i}">{{item}}</text>
		</view>
		<view class="line" :style="{'transform': `translateX(${x}px)`}">
		</view>
	</scroll-view>
</template>

<script>
	const dom = uni.requireNativePlugin('dom');
	export default {
		props: {
			index: {
				type: Number,
				default: 0
			},
			labels: {
				type: Array,
				default: () => []
			}
		},
		created() {
			this.wWidth = uni.getSystemInfoSync().windowWidth
		},
		watch: {
			index(newVal, oldVal) {
				dom.getComponentRect(this.$refs['tabbar-item'][newVal], ({
					size
				}) => {
					
					this.x = (size.left - this.offsetX) + (size.width / 2 - uni.upx2px(30))
				})
			}
		},
		mounted() {
			this.$nextTick(function() {
				dom.getComponentRect(this.$refs['tabbar-item'][0], ({
					size
				}) => {
					this.offsetX = size.left
					this.x = (size.left - this.offsetX) + (size.width / 2 - uni.upx2px(30) )
				})
			})
		},
		data() {
			return {
				x: -300
			}
		}
	}
</script>

<style scoped lang='scss'>
	.tabbar {
		@extend %flex;
		height: 80rpx;
		flex-direction: row;
		/* #ifndef APP-PLUS */
		white-space: nowrap;
		/* #endif */
		position: relative;
	}

	.tabbar-item {
		/* #ifndef APP-PLUS */
		display: inline-block;
		/* #endif */
		flex-wrap: nowrap;
		@extend %flex;
		padding-left: 34rpx;
		padding-right: 34rpx;
	}


	.tabbar-item-title {
		font-size: 24rpx;
		height: 80rpx;
		line-height: 80rpx;
		@extend %flex;
		flex-wrap: nowrap;
		color: rgba(0, 0, 0, .5);
		text-align: center;
		transition-duration: 2s;
		transition-property: color, font-size;
		/* #ifndef APP-PLUS */
		white-space: nowrap;
		/* #endif */
	}

	.tabbar-item-active-title {
		font-size: $uni-font-size-lg !important;
		color: rgba(0, 0, 0, .8) !important;
		font-weight: bold;
	}

	.line {
		@include position(absolute, false,false,5px,0);
		height: 10rpx;
		width: 60rpx;
		background-color: #ffde82;
		border-radius: 50rpx;
		transition-property: transform;
		transition-duration: .5s;
	}
</style>
