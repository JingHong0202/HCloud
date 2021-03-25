<template>
	<view class="container" :render-whole='true'>
		<view class="bg bg-color-base margin-b20"></view>
		<view class="tab vs-row vs-align-center">

			<view class="vs-row vs-align-center vs-space-center" style="flex: 1;">
				<view class="vs-column vs-align-center margin-r40">
					<text class="font-36 margin-b20 color-base">{{mode.title}}</text>
					<view class="line bg-color-base"></view>
				</view>
			</view>
		</view>

		<view class="login margin-b80" style="flex-direction: column;">
			<slot name="from">

			</slot>
		</view>

		<view @click="$emit('submit')" :class="{'btn-disabled': !disabled}" class="button vs-item-hover bg-color-base vs-row vs-align-center vs-space-center margin-b20">
			<text class="color-white font-34">{{mode.subBtn}}</text>
		</view>

		<view class="vs-row vs-align-center vs-space-around margin-b100 " style="padding-top: 20rpx;" v-if="mode.lrbtn">
			<slot name="lrbtn">
				<text class="color-base font-28" @tap='$emit("tapLeft")'>{{mode.leftText}}</text>
				<text class="color-base font-28" @tap='$emit("tapRight")'>{{mode.rightText}}</text>
			</slot>
		</view>
		<view class="other" style="flex-direction: column;" v-if="mode.more">
			<view class="vs-row vs-align-center margin-b40">
				<view class="separator vs-flex-item"></view>
				<text class="color-black-3 font-28">更多登录方式</text>
				<view class="separator vs-flex-item"></view>
			</view>

			<view class="other-items vs-row vs-align-center vs-space-around">
				<!-- <image class="other-icon" src="/static/wechat.png" mode=""></image> -->
				<slot name='other' />
					
			</view>
		</view>
		<image class="tab-bg" src="/static/icon/page/login/banner-icon.png" style="position: absolute; right: 0px;top:0px"></image>
	</view>
</template>

<script>
	export default {
		props: {
			mode: {
				type: Object
			},
			disabled: {
				type: Boolean,
				default: true
			}
		}
	}
</script>


<style lang="scss" scoped>
	@import "~@/pages/user/common/user.scss";
</style>