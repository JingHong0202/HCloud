<template>
	<skeleton :skeleton="skeletonList" :loading="!list.length" animate ref='skeleton'>
		<list class="media-album" :scrollable='scrollY' :bounce='false' :show-scrollbar='false' :offset-accuracy='50'
			@loadmore='loadMore'>
			<uni-refresh @refresh='refresh' :display="downDisplay">
				<uni-load-more :status="downStatus" :contentText='downText' />
			</uni-refresh>
			<template v-if="list.length" v-for="(item,i) in afterList">
				<header :ref="`media-${item.date}`">
					<view class="date-box">
						<text class="media-date" @longpress="selectBlock(item)">{{item.date}}</text>
						<checkbox-group @change='toggleBlock(item,$event)'>
							<checkbox v-if="action" :value="!!item" :checked="blockChecked(item)"
								style="transform:scale(0.8)">
							</checkbox>
						</checkbox-group>
					</view>
				</header>
				<cell class="media-album">

					<uni-grid :column="4" :highlight="true" @change="change" @longpress='showActionSheet'
						:showBorder='false'>
						<uni-grid-item v-for="(item2, index) in item.list" :mode='mode' :data='item2' :parentIndex='i'
							:index="index" :key="index">
						</uni-grid-item>
					</uni-grid>
				</cell>
			</template>
			<cell>
				<uni-load-more :status="status" :contentText='upText' />
			</cell>
			<cell v-if='action'>
				<view style="height: 150rpx">

				</view>
			</cell>
		</list>
	</skeleton>
</template>

<script>
	import skeleton from '@/components/ls-skeleton/ls-skeleton.nvue'
	const dom = uni.requireNativePlugin('dom');
	import {
		open
	} from '@/util/file.js';
	import {
		mapMutations,
		mapState
	} from 'vuex'
	import loading from '@/common/js/mixins/loading.js'
	import refresh from '@/common/js/mixins/refresh.js'
	export default {
		mixins: [loading, refresh],
		components: {
			skeleton
		},
		props: {
			list: {
				type: Array,
				default: () => []
			},
			scrollY: {
				type: Boolean,
				default: true
			},
			mode: {
				type: String,
				default: 'photo'
			}
		},
		data() {
			return {
				skeletonList: ['images','images','images']
			}
		},
		computed: {
			...mapState('file', ['selectlist', 'action']),
			afterList() {
				return this.list // 排序
					.sort(function(a, b) {
						return Date.parse(b.date) - Date.parse(a.date)
					})
			}
		},
		methods: {
			...mapMutations('file', ['CHANGE_SELECT_LIST']),
			blockChecked(item) {
				return item.list.every(item => {
					if (item.checked) {
						return true
					} else {
						return false
					}
				})
			},
			toItem(name) {
				dom.scrollToElement(this.$refs['media-' + name][0], {
					animated: false,
					offset: 5
				})
			},
			showActionSheet(e) {
				if (this.action) return
				let {
					index,
					parentIndex
				} = e.detail
				this.addSelectList(this.list[parentIndex].list[index])
			},
			addSelectList(item) {
				if (this.selectlist.indexOf(item) >= 0) {
					this.$set(item, 'checked', false)
					let newArr = [...this.selectlist]
					newArr.splice(this.selectlist.findIndex(item2 => item2 === item), 1)
					this.CHANGE_SELECT_LIST(newArr)
				} else {
					this.$set(item, 'checked', true)
					this.CHANGE_SELECT_LIST([...this.selectlist, item])
				}

			},
			selectBlock(block) {
				// 更新视图
				block.list.forEach(item => this.$set(item, 'checked', true))
				// 更新添加列表
				this.CHANGE_SELECT_LIST(Array.from(new Set([...this.selectlist, ...block.list])))
			},
			removeBlock(block) {
				block.list.forEach(item => this.$set(item, 'checked', null))

				let newArr = [...this.selectlist]
				this.CHANGE_SELECT_LIST(newArr.filter(item => {
					return block.list.every(item2 => {
						this.$set(item2, 'checked', false)
						if (item === item2) {
							return false
						} else {
							return true
						}
					})
				}))
			},
			toggleBlock(block, {
				detail: {
					value
				}
			}) {
				if (value[0]) {
					this.selectBlock(block)
				} else {
					this.removeBlock(block)
				}
				this.$forceUpdate()
			},
			change(e) {
				let {
					index,
					parentIndex
				} = e.detail
				let parent = this.list[parentIndex],
					current = parent.list[index]
				if (this.action) return this.addSelectList(parent.list[index])
				return this.preview(current, parent)
			},
			preview(
				current, {
					list
				}) {
				open({
					current,
					list
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.media-album {
		@extend %f-cl;
	}

	.date-box {
		flex: 1;
		background-color: white;
		flex-direction: row;
		padding: 20rpx 25rpx 0;
		align-items: center;
	}

	.media-date {
		font-size: $uni-font-size-lg;
		color: $uni-color-subtitle;
		margin-right: 20rpx;
	}

	// .image {
	// 	width: 150rpx;
	// 	height: 150rpx;
	// }

	// .grid-item-box {
	// 	@extend %flex;
	// 	justify-content: center;
	// 	align-items: center;
	// }
</style>
