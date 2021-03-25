<template>
	<view class="drag-mask" @tap='back'>
		<view class="drag-ctx" bubble="true" elevation="5px" ref='ctx' @click.stop="(e) => e.stopPropagation()"
			@panstart.stop='TouchStart'>
			<view class="line-box">
				<view class="line" v-if="!title"></view>
				<text  v-else class="title" >{{title}}</text>
			</view>
			<slot />
		</view>
	</view>
</template>

<script>
	import {
		animate
	} from '@/util/animation.js'
	import {
		getEl
	} from '@/util/bindingx.js'
	const bindingx = uni.requireNativePlugin('bindingx'),
		dom = uni.requireNativePlugin('dom')
	export default {
		props: {
			autoTop: {
				type: [Boolean],
				default: true
			},
			title: {
				type: [String, Boolean],
				default: ''
			}
		},
		methods: {
			back() {
				animate(
					this.$refs['ctx'], {
						styles: {
							transform: "translateY(100%)"
						},
						duration: 200,
						timingFunction: 'ease',
						delay: 0,
						needLayout: true
					}
				).then(() => {
					uni.navigateBack()
				})
			},
			show(callback) {
				animate(
					this.$refs['ctx'], {
						styles: {
							transform: "translateY(0)"
						},
						duration: 200,
						timingFunction: 'ease',
						delay: 0,
						needLayout: true
					}
				).then(() => {
					callback()
				})
			},
			TouchStart(e) {
				e.stopPropagation();
				let ctx = this.$refs['ctx'],
					el = getEl(ctx);
				dom.getComponentRect(ctx, (({
					size
				}) => {
					this.ctxHeight = size.height
				}))
				bindingx.bind({
					eventType: 'pan',
					anchor: el,
					props: [{
						element: el,
						property: 'transform.translateY',
						expression: 'max(y+' + this.y + ',0)'
					}]
				}, (e) => {
					if (e.state === 'end') {
						if (this.autoTop) {
							if (e.deltaY > this.ctxHeight / 2) return this.back()
							else {
								this.show()
							}
						} else {
							this.y += e.deltaY
							if (this.y < 0) this.y = 0
							if (this.y > this.ctxHeight / 2) return this.back()
						}
					}
				})
			}
		},
		data() {
			return {
				y: 0
			};
		}
		

	}
</script>

<style scoped lang="scss">
	.title {
		font-size: $uni-font-size-lg;
	}
	.drag-mask {
		@include position(absolute, 0, 0, 0, 0);
		background-color: rgba(0, 0, 0, .6);
		& .drag-ctx {
			@include position(absolute, false, 0, 0, 0);
			transform: translateY(100%);
			background-color: white;
			border-top-left-radius: 30px;
			border-top-right-radius: 30px;
			transition-property: transform;
			transition-duration: 0.3s;
			padding: 20rpx;
			flex-direction: column;
		}
		& .line-box {
			flex-direction: row;
			flex: 1;
			height: 100rpx;
			// background-color: red;
			position: relative;
			top: -18rpx;
			@extend %f-ct;
			& .line {
				width: 100rpx;
				height: 15rpx;
				border-radius: 100px;
				background-color: rgba(80,80,80,.2);
			}
		}
	}
</style>
