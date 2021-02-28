<template>
	<view class="progress-box" >
		<view class="percent" :class="`${status}`" :style='{width: `${percent}rpx`}'>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			PropPercent: {
				type: [Number],
				default: 0
			},
			PropStatus: {
				type: "string"
			}
		},
		computed: {
			percent() {
				return 500 * (this.PropPercent / 100)
			},
			status() {
				switch (this.PropStatus) {
					case 'RUNTIME':
						return 'primary'
						break;
					case 'ERROR':
						return 'error'
						break;
					case 'SUCCESS':
						return 'success'
					case 'STOP':
						return 'stop'
						break;
					default:
						return 'primary'
				}
			}
		},

	}
</script>

<style scoped lang='scss'>
	.progress-box {
		width: 400rpx;
		margin-top: 10px;
		height: 5px;
		border-radius: 10px;
		background-color: rgba(0, 0, 0, .1);
	}

	.percent {
		height: 5px;
		background-color: $uni-color-primary;
		border-radius: 10px;
	}

	.primary {
		background-color: $uni-color-primary;
	}

	.success {
		background-color: $uni-color-success;
	}

	.error {
		background-color: $uni-color-error;
	}
	
	.stop {
		background-color: #e4c774;
	}
</style>
