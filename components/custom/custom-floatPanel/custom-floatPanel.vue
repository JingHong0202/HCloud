<template>
	<view class="media-box" ref='photo-box'  @touchend="toggle = false" @touchmove.stop.provent='move'>
		<slot  />
		<view elevation="5px" class="drop-float" :style="{'transform': `translateY(${y}px)`}"
			 @touchend="end" @touchstart.stop="start">
				<text class="iconfont c-iconfont">&#xe666;</text>
				<text class="current-date" v-if="toggle">{{date}}</text>
			</view>
	</view>
</template>

<script>
	const dom = uni.requireNativePlugin('dom'),
	floatPanelHeight = 40
	
	export default {
		data () {
			return {
				date: '',
				toggle: false,
				y:0
			}
		},
		watch: {
			indexList (newVal, oldVal) {
				if (oldVal.length && newVal.length !== oldVal.length) {
					this.y = (this.maxY - floatPanelHeight) - ((newVal.length - oldVal.length) * this.itemHeight)
				}
			}
		},
		computed: {
			indexList() {
				return this.list.map(item => item.date).sort(this[this.sort])
			},
			itemHeight() {
				return this.maxY / this.list.length
			}
		},
		mounted() {
			dom.getComponentRect(this.$refs['photo-box'], ({
				size
			}) => {
				this.maxY = size.height
			})
		},
		props: {
			list: {
				type: Array,
				default: () => []
			},
			sort: {
				type: String,
				default: 'down'
			}
		},
		methods: {
			move({
				changedTouches
			}) {
				if (!this.toggle) return
				let {
					pageY
				} = changedTouches[0]
				if (pageY < 0 || pageY > (this.maxY - floatPanelHeight)) return
				this.date = this.indexList[~~((pageY + (pageY > floatPanelHeight ?  floatPanelHeight : 0)) / this.itemHeight)] || this.date
				this.y = pageY
			},
			end() {
				this.toggle = false
				this.$emit('end',this.date)
			},
			start() {
				this.toggle = true
			},
			up(a, b) {
				return Date.parse(a) - Date.parse(b)
			},
			down(a, b) {
				return Date.parse(b) - Date.parse(a)
			},
			// scroll(y, h) {
			// 	let offsetY = Math.abs(y)
			// 	this.y = this.maxY * ((offsetY / h).toFixed(2))
			// 	console.log((offsetY / h).toFixed(2))
			// }
		}
	}
</script>

<style lang="scss" scoped>
	.media-box {
		flex: 1;
	}

	.drop-float {
		position: absolute;
		right: 0px;
		height: 40px;
		background-color: white;
		border-top-left-radius: 25px;
		border-bottom-left-radius: 25px;
		// padding-left: 20rpx;
	}

	.current-date {
		font-size: $uni-font-size-sm;
		color: $uni-color-subtitle;
		line-height: 40px;
		margin-right: 35rpx;
	}

	.c-iconfont {
		line-height: 40px;
		margin-right: 15rpx;
		margin-left: 25rpx;
	}
</style>
