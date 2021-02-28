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
		watch: {
			index(newVal, oldVal) {
				dom.getComponentRect(this.$refs['tabbar-item'][newVal], ({
					size
				}) => {
					this.x = size.left + (size.width / 2 - 15)
				})
			}
		},
		mounted() {
			this.$nextTick(function() {
				dom.getComponentRect(this.$refs['tabbar-item'][0], ({
					size
				}) => {
					this.x = size.left + (size.width / 2 - 15)
				})
			})
		},
		data() {
			return {
				x: 0
			}
		}
	}
</script>

<style scoped lang='scss'>
	.tabbar {
		width: 750rpx;
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
		flex: 1;
		padding-left: 34rpx;
		padding-right: 34rpx;
	}


	.tabbar-item-title {
		font-size: 24rpx;
		height: 80rpx;
		line-height: 80rpx;
		flex: 1;
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
	}

	.line {
		position: absolute;
		bottom: 5px;
		left: 0;
		height: 5px;
		width: 30px;
		background-color: #ffde82;
		border-radius: 25px;
		transition-property: transform;
		transition-duration: .5s;
	}
</style>
