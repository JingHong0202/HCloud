<template>
	<view class="custom-selection">
		<radio-group @change='change' class="item-group" v-if="mode === 'radio'">
			<label class="item-label" v-for="(item,i) in labels" :key='item.value' @click.stop="(e) => e.stopPropagation()">
				<radio :value="item.value" class="item-label-box"  :checked="item.value === current" />
				<text class="item-label-text">{{item.name}}</text>
			</label>
		</radio-group>
		<checkbox-group @change='change' class="item-group" v-else>
			<label class="item-label" v-for="(item,i) in labels" :key='item.value'>
				<checkbox :value="item.value" class="item-label-box" />
				<text class="item-label-text">{{item.name}}</text>
			</label>
		</checkbox-group>
	</view>
</template>

<script>
	export default {
		props: {
			labels: {
				type: [Array],
				default: () => []
			},
			mode: {
				type: String
			},
			current: {
				type: [String]
			}
		},
		methods: {
			change(e) {
				this.$emit('change', e.detail)
			}
		}
	}
</script>

<style scoped lang="scss">
	.custom-selection {
		@extend %flex;
		flex-direction: row;
		flex-wrap: wrap;

		.item-group {
			width: 250px;
			flex-direction: row;
			flex-wrap: wrap;
			// @extend %f-ct;
		}

		.item-label {
			margin-left: 15px;
			margin-top: 15px;
			align-items: center;

			.item-label-box {
				transform: scale(.7);
			}

			.item-label-text {
				font-size: $uni-font-size-base;
			}
		}
	}
</style>
