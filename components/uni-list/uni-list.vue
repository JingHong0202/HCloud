<template>
	<waterfall :column-count="multiple ? column : 1" column-gap='0'  column-width="auto" class="uni-list" ref='list' @scroll="scroll" :scrollable='scrollY'
	 @loadmore='$emit("loadmore")' :class="{ 'uni-list--border': border }" :loadmoreoffset="15">
		<slot />
	</waterfall>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	const dom = uni.requireNativePlugin('dom')
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
			},
			multiple: {
				type: Boolean
			}
		},
		computed: {
			...mapState('views', ['column'])
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
				this.$emit('scroll', e)
			},
			toScrollTop(child, animate) {
				dom.scrollToElement(child, {
					animated: animate,
					offset: 0
				})
			}
		}
	};
</script>
<style lang="scss">
	.uni-list {
		background-color: $uni-bg-color;
		flex-direction: column;
	}

	.uni-list--border {
		position: relative;
		border-top-color: $uni-border-color;
		border-top-style: solid;
		border-top-width: 0.5px;
		border-bottom-color: $uni-border-color;
		border-bottom-style: solid;
		border-bottom-width: 0.5px;
		z-index: -1;
	}
</style>
