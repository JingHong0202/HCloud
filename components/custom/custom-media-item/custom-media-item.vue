<template>
	<cell insert-animation='none' delete-animation='none'>
		<view class="custom-media-item"  @longpress='$emit("longpress")' @click.stop='$emit("click")'>
			<image :src="thumb" @error='previewThumbError'
				class="image" mode="aspectFit" v-if="mode === 'photo'" />
			<view class="video-thumb" v-else>
				<image :src="thumb" @error='previewThumbError' class="image" mode="aspectFit" />
				<!-- <text class="iconfont c-iconfont">&#xe637;</text> -->
			</view>
			<radio class='round radio' color="#4070ff" :class="data.checked ? 'checked' : ''" :checked="data.checked ">
			</radio>
		</view>
	</cell>
</template>

<script>
	import {
		preview
	} from '@/api/file.js'
	export default {
		props: {
			mode: {
				type: String,
				default: 'photo'
			},
			data: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},
		computed: {
			thumb() {
				return !this.data.thumb ? this.preview(this.data.uuid, this.data.type === 1) : this.data.thumb
			}
		},
		methods: {
			preview,
			previewThumbError() {
				// this.data.thumb = '/static/images/diushi.png'
				this.$set(this.data, 'thumb', '/static/images/diushi.png')
				uni.showToast({
					title: '预览图加载失败',
					position: 'bottom'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.custom-media-item {
		@extend %flex;
		justify-content: center;
		align-items: center;
		padding: 25rpx;
	}

	.custom-media-item:active {
		background-color: $uni-bg-color-hover;
	}

	.image {
		flex: 1;
		height: 150rpx;
	}

	.round {
		position: absolute;
		right: 0;
		bottom: 0;
	}

	.video-thumb {
		justify-content: center;
		align-items: center;
		flex: 1;
		background-color: #000000;
	}

	// .c-iconfont {
	// 	position: absolute;
	// 	top: 60rpx;
	// 	font-size: 40rpx;
	// 	transform: scale(2);
	// 	color: #000;
	// 	opacity: .5;
	// }
</style>
