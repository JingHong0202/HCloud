<template>
	<!-- #ifndef APP-NVUE -->
	<view class="uni-list uni-border-top-bottom">
		<view v-if="border" class="uni-list--border-top"></view>
		<slot />
		<view v-if="border" class="uni-list--border-bottom"></view>
	</view>
	<!-- #endif -->
	<!-- #ifdef APP-NVUE -->
	<list class="uni-list" ref='list' :scrollable='scrollY' @loadmore='$emit("loadmore")' :class="{ 'uni-list--border': border }"
	 :loadmoreoffset="15">
		<slot />
	</list>
	<!-- #endif -->
</template>

<script>
	/**
	 * List 列表
	 * @description 列表组件
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=24
	 * @property {String} 	border = [true|false] 		标题
	 */
	export default {
		name: 'uniList',
		'mp-weixin': {
			options: {
				multipleSlots: false
			}
		},
		props: {
			scrollY: {
				type: [Boolean, String],
				default: false
			},
			border: {
				type: Boolean,
				default: true
			},
			scrollHandler: {
				type: Boolean,
				default: true
			}
		},
		created() {
			this.firstChildAppend = false;
			// 设置嵌套list
			uni.$once('setScrollRef', (obj) => {
				if (this.$refs['list'] && this.$refs['list'].setSpecialEffects) this.$refs['list'].setSpecialEffects(obj)
			})
		},
		methods: {
			scroll(e) {
				console.log(e)
			}
		}
	};
</script>
<style lang="scss">
	.uni-list {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		background-color: $uni-bg-color;
		position: relative;
		flex-direction: column;
	}

	.uni-list--border {
		position: relative;
		/* #ifdef APP-NVUE */
		border-top-color: $uni-border-color;
		border-top-style: solid;
		border-top-width: 0.5px;
		border-bottom-color: $uni-border-color;
		border-bottom-style: solid;
		border-bottom-width: 0.5px;
		/* #endif */
		z-index: -1;
	}

	/* #ifndef APP-NVUE */

	.uni-list--border-top {
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		height: 1px;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		background-color: $uni-border-color;
		z-index: 1;
	}

	.uni-list--border-bottom {
		position: absolute;
		bottom: 0;
		right: 0;
		left: 0;
		height: 1px;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		background-color: $uni-border-color;
	}

	/* #endif */
</style>
