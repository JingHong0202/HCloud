<template>
	<skeleton :skeleton="skeletonList" :loading="skeletonLoading" animate ref='skeleton'>
		<waterfall class="media-album" :column-count="4" column-gap='0' column-width="auto" :scrollable='scrollY'
			:bounce='false' :show-scrollbar='false' @loadmore='loadMore'>
			<uni-refresh @refresh='refresh' :display="downDisplay">
				<uni-load-more :status="downStatus" :contentText='downText' />
			</uni-refresh>
			<header style='flex:1;' v-if='!list.length'>
				<custom-null :params="{text: '暂无文件', mode: 'null'}"></custom-null>
			</header>
			<template v-if="list.length" v-for="(item,i) in afterList">
				<header   :key='item.date' insert-animation='none' delete-animation='none'>
					<view class="date-box">
						<text class="media-date" @longpress="selectBlock(item)">{{item.date}}</text>
						<checkbox-group @change='toggleBlock(item,$event)'>
							<checkbox v-if="action" :value="!!item" :checked="blockChecked(item)"
								style="transform:scale(0.8)">
							</checkbox>
						</checkbox-group>
					</view>
				</header>
				<custom-media-item :ref="`media-${item.date}`" v-for="(item2, index) in item.list" :data='item2' :mode='mode'
					@click='preview(item,item2)' :key='item.date' @longpress='showActionSheet(item2)' />
			</template>
			<header v-if="list.length" style='flex:1;'>
				<uni-load-more :status="status" :contentText='upText' />
			</header>
		</waterfall>
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
			},
			skeletonLoading: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				skeletonList: ['images', 'images', 'images']
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
					offset:0
				})
			},
			showActionSheet(item) {
				if (this.action) return
				return this.addSelectList(item)
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
			preview({
				list
			}, item) {
				if (this.action) return this.addSelectList(item)
				return open({
					current: item,
					list
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.media-album {
		@extend %f-cl;
		flex: 1;
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
		padding-top: 10rpx;
		padding-bottom: 10rpx;
	}
</style>
