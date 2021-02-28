<template>
	<view v-if="width" :style="'width:'+width+';'+(square?'height:'+width:'')" class="uni-grid-item">
		<view :class="{ 'uni-grid-item--border': showBorder,  'uni-grid-item--border-top': showBorder && index < column, 'uni-highlight': highlight }"
		 :style="{  'border-right-color': borderColor ,'border-bottom-color': borderColor ,'border-top-color': borderColor }"
		 class="uni-grid-item__box" @click="_onClick" @longpress='_onLongPress'>
			<view class="grid-item-box">
				<slot>
					<image  :src="data.thumb" @error='previewThumbError' class="image" mode="aspectFit" v-if="mode === 'photo'" />
					<view class="video-thumb" v-else>
						<image  :src="data.thumb" @error='previewThumbError' class="image" mode="aspectFit" />
						<text class="iconfont c-iconfont">&#xe637;</text>
					</view>
					<radio class='round radio' color="#e4c774" :class="data.checked ? 'checked' : ''" :checked="data.checked "></radio>
				</slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'UniGridItem',
		inject: ['grid'],
		props: {
			mode: {
				type: String,
				default: 'photo'
			},
			index: {
				type: Number,
				default: 0
			},
			data: {
				type: Object,
				default: () => {
					return {}
				}
			},
			parentIndex: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				column: 0,
				showBorder: true,
				square: true,
				highlight: true,
				left: 0,
				top: 0,
				openNum: 2,
				width: 0,
				borderColor: '#e5e5e5'
			}
		},
		created() {
			this.column = this.grid.column
			this.showBorder = this.grid.showBorder
			this.square = this.grid.square
			this.highlight = this.grid.highlight
			this.top = this.hor === 0 ? this.grid.hor : this.hor
			this.left = this.ver === 0 ? this.grid.ver : this.ver
			this.borderColor = this.grid.borderColor
			this.grid.children.push(this)
			// this.grid.init()
			this.width = this.grid.width
		},
		beforeDestroy() {
			this.grid.children.forEach((item, index) => {
				if (item === this) {
					this.grid.children.splice(index, 1)
				}
			})
		},
		methods: {
			previewThumbError() {
				this.data.thumb = '/static/images/diushi.png'
				// this.$set(this.data, 'thumb', '/static/images/diushi.png')
				uni.showToast({
					title: '预览图加载失败',
					position: 'bottom'
				})
			},
			_onLongPress() {
				this.grid.LongPress({
					detail: {
						index: this.index,
						parentIndex: this.parentIndex
					}
				})
			},
			_onClick() {
				this.grid.change({
					detail: {
						index: this.index,
						parentIndex: this.parentIndex
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-grid-item {
		/* #ifndef APP-NVUE */
		height: 100%;
		display: flex;
		/* #endif */
	}

	.uni-grid-item__box {
		/* #ifndef APP-NVUE */
		display: flex;
		width: 100%;
		/* #endif */
		position: relative;
		flex: 1;
		flex-direction: column;
		// justify-content: center;
		// align-items: center;
	}

	.uni-grid-item--border {
		position: relative;
		border-bottom-color: $uni-border-color;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-right-color: $uni-border-color;
		border-right-style: solid;
		border-right-width: 1px;
	}

	.uni-grid-item--border-top {
		border-top-color: $uni-border-color;
		border-top-style: solid;
		border-top-width: 1px;
		/* #ifndef APP-NVUE */
		height: 100%;
		box-sizing: border-box;
		/* #endif */
	}

	.uni-highlight:active {
		background-color: $uni-bg-color-hover;
	}

	.grid-item-box {
		flex: 1;
		justify-content: center;
		align-items: center;
	}

	.image {
		width: 150rpx;
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
	}

	.c-iconfont {
		position: absolute;
		top: 60rpx;
		font-size: 15px;
		opacity: .8;
	}
</style>
