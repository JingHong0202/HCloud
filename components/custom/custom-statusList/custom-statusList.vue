<template>
	<view class="custom-statusList">
		<view class="segmented">
			<uni-segmented-control :redDots='redDots' :values="labels" @clickItem="onClickItem" styleType="button" />
		</view>

		<custom-statusList-item :list='success_list' v-if='!index' :mode='mode' />
		<custom-statusList-item :list='error_list' v-if='index === 1' :mode='mode' />
		<custom-statusList-item :list='runtime_list' v-if='index === 2' :mode='mode' />
		<custom-statusList-item :list='stop_list' v-if='index === 3' :mode='mode' />

	</view>
</template>

<script>
	export default {
		props: {
			list: {
				default: () => [],
				type: Array
			},
			mode: {
				default: true
			}
		},
		data() {
			return {
				index: 0,
				labels: ['完成', '错误', '运行', '停止']
			}
		},
		methods: {
			onClickItem({
				currentIndex
			}) {
				this.index = currentIndex
				this.$forceUpdate()
			}
		},
		computed: {
			redDots() {
				return [this.success_list.length, this.error_list.length, this.runtime_list.length, this.stop_list.length]
			},
			success_list() {
				return this.list.filter(item => item.status === 'SUCCESS')
			},
			error_list() {
				return [...this.list.filter(item => item.status === 'ERROR')]
			},
			runtime_list() {
				return this.list.filter(item => item.status === 'RUNTIME' || item.status === 'LOADING')
			},
			stop_list() {
				return this.list.filter(item => item.status === 'STOP')
			}

		}
	}
</script>

<style scoped lang="scss">
	.segmented {
		padding: 0rpx 50rpx;
		margin: 15rpx 0;
	}
	.custom-statusList {
		@extend %flex;
		flex-direction: column;
	}
</style>
