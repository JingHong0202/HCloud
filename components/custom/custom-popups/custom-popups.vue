<template>
	<view class="popups-mask" @click="$emit('exit')" @touchmove.stop.prevent="() => {}">
		<view class="custom-popups-after" :style="{top: afterTop}"></view>
		<view class="custom-popups" :style="{top: afterTop + 5}">
			<view class="popups-item " v-for="(item,index) in CoccentLabel" :class="{'popups-item-last': index === CoccentLabel.length - 1}"
			 @click.stop='handleClick($event,item)'>
				<text class="iconfont c-iconfont" :class="{'redDot-offset' : item.redDot}">{{item.iconEncode}}</text>
				<text class="popups-title">{{item.labelText}}</text>
				<view class="redDot" v-if='item.redDot'>
					<uni-badge :text="item.redDot" type="error" size="small"></uni-badge>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	import {
		mapState,
		mapGetters
	} from 'vuex'
	let DefaultLable = {
		labelText: '传输列表',
		iconEncode: "\ue656",
		handleClick() {
			uni.navigateTo({
				url: '/pages/status/status'
			})
		}
	}
	export default {
		props: {
			labels: {
				type: Array,
				default: () => [DefaultLable]
			},
			afterTop: {
				type: [Number, String],
				default: 10
			}
		},
		computed: {
			...mapState('file', ['downlist', 'uplist']),
			...mapGetters('file', ['RUNTIME']),
			CoccentLabel() {
				return [...Array.from(new Set([DefaultLable, ...this.labels]))]
			}
		},
		methods: {
			handleClick(e, item) {
				e.stopPropagation()
				if (!item.handleClick) return
				item.handleClick()
				return this.$emit('exit')
			}
		},

		data() {
			return {
				afterTop:0
			}
		},
		created() {
			// 传输列表
			DefaultLable.redDot = this.RUNTIME
			// this.$forceUpdate()
		}
	}
</script>

<style lang="scss" scoped>
	.redDot {
		position: absolute;
		left: 0;
		top: 0;
	}

	.redDot-offset {
		margin-top: 10px;
		margin-left: 3px;
	}

	.popups-mask {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, .5);
		z-index: 999;
	}

	.custom-popups-after {
		width: 15px;
		height: 15px;
		position: absolute;
		right: 23px;
		top: 5px;
		background-color: white;
		transform: rotate(45deg);
		border-radius: 1px;
		z-index: -1;
	}

	.custom-popups {
		/*#ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/*#endif */
		flex-direction: column;
		padding: 10rpx 30rpx;
		position: fixed;
		right: 5px;
		top: 10px;
		background-color: #fff;
		border-radius: 5px;
		z-index: 999;
		padding-top: 10px;
	}

	.popups-item {
		/*#ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/*#endif */
		flex-direction: row;
		margin-bottom: 10px;
		border-bottom-width: 1px;
		border-bottom-style: solid;
		border-color: rgba(0, 0, 0, .2);
		align-items: center;
		position: relative;
		padding: 15rpx;
	}


	.popups-title {
		/*#ifndef APP-NVUE */
		box-sizing: border-box;
		/*#endif */
		font-size: $uni-font-size-base;
		margin-bottom: 5px;
		color: $uni-text-color;
	}

	.popups-item-last {
		margin-bottom: 0px !important;
		border-color: rgba(0, 0, 0, 0) !important;
	}



	.c-iconfont {
		font-size: 40rpx;
		margin-right: 20rpx;
	}
</style>
