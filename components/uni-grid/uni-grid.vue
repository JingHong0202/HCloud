<template>
	<view class="uni-grid-wrap">
		<view :id="elId" ref="uni-grid" class="uni-grid" :class="{ 'uni-grid--border': showBorder }" :style="{ 'border-left-style':'solid','border-left-color':borderColor, 'border-left-width':showBorder?'1px':0 }">
			<slot />
		</view>
	</view>
</template>

<script>
	const dom = uni.requireNativePlugin('dom');
	export default {
		name: 'UniGrid',
		props: {
			// 每列显示个数
			column: {
				type: Number,
				default: 3
			},
			// 是否显示边框
			showBorder: {
				type: Boolean,
				default: true
			},
			// 边框颜色
			borderColor: {
				type: String,
				default: '#e5e5e5'
			},
			// 是否正方形显示,默认为 true
			square: {
				type: Boolean,
				default: true
			},
			highlight: {
				type: Boolean,
				default: true
			}
		},
		provide() {
			return {
				grid: this
			}
		},
		data() {
			const elId = `Uni_${Math.ceil(Math.random() * 10e5).toString(36)}`
			return {
				elId,
				width: 0
			}
		},
		created() {
			this.children = []
		},
		mounted() {
			this.init()
		},
		methods: {
			init() {
				setTimeout(() => {
					this._getSize((width) => {
						this.children.forEach((item, index) => {
							item.width = width
						})
					})
				}, 50)
			},
			change(e) {
				this.$emit('change', e)
			},
			LongPress(e) {
				this.$emit('longpress', e)
			},
			_getSize(fn) {
				dom.getComponentRect(this.$refs['uni-grid'], (ret) => {
					this.width = parseInt((ret.size.width-1) / this.column) 
					fn(this.width || 750 / this.column + 'rpx')
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-grid-wrap {
		@extend %flex;
		flex-direction: column;
	}

	.uni-grid {
		flex-direction: row;
		flex-wrap: wrap;
	}

	.uni-grid--border {
		border-left-color: $uni-border-color;
		border-left-style: solid;
		border-left-width: 1px;
	}
</style>
