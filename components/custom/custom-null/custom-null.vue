<template>
	<view class="noCtx">
		<image class="no-image" :src="src" mode="aspectFit">
		</image>
		<text class="no-text">{{params.text}}</text>
	</view>
</template>

<script>
	export default {
		props: {
			params: {
				type: Object
			}
		},
		computed: {
			src() {
				switch (this.params.mode) {
					case 'null':
						return '/static/images/null.png'
					break
					case 'hide':
						return '/static/icon/page/index/hide.png'
					break;
				}
			}
		}
	}
</script>

<style scoped lang='scss'>
	.noCtx {
		@include position(absolute,0,0,0,0)
		flex-direction: column;
		@extend %f-ct;
	}
	.no-image {
		width: 500rpx;
	}
	.no-text {
		text-align: center;
		color: $uni-color-subtitle;
		font-size: $uni-font-size-base;
	}
</style>
