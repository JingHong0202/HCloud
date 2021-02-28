<template>
	<!-- @scroll='handlerScroll' -->
	<list class="media-album"  :scrollable='scrollY' :bounce='false' :show-scrollbar='false' :offset-accuracy='50'
	 :loadmoreoffset="15">
		<uni-refresh @refresh='refresh' :display="downDisplay">
			<uni-load-more :status="downStatus" :contentText='downText' />
		</uni-refresh>
		<template v-if="list.length" v-for="(item,i) in list">
			<cell class="media-album" :ref="`media-${item.date}`">
				<view>
					<text class="media-date" @longpress="selectBlock(item)">{{item.date}}</text>
					<checkbox-group @change='toggleBlock(item,$event)'>
						<checkbox v-if="action" :value="!!item" :checked="blockChecked(item)" style="transform:scale(0.8)"></checkbox>
					</checkbox-group>
				</view>
				<uni-grid :column="4" :highlight="true" @change="change" @longpress='showActionSheet' :showBorder='false'>
					<uni-grid-item v-for="(item2, index) in item.list" :mode='mode' :data='item2' :parentIndex='i' :index="index" :key="index">
					</uni-grid-item>
				</uni-grid>
			</cell>
		</template>
		<loading @loading='loadMore' :display='display' v-if='status !== "noMore"'>
			<uni-load-more :status="status" :contentText='upText' />
		</loading>
		<cell v-else>
			<uni-load-more status="noMore" :contentText='upText' />
		</cell>
		<cell v-if='action'>
			<view style="height: 150px">

			</view>
		</cell>
	</list>
</template>

<script>
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
		computed: {
			...mapState('file', ['selectlist', 'action'])
		},
		methods: {
			...mapMutations('file', ['CHANGE_SELECT_LIST']),
			
			// handlerScroll({
			// 	contentOffset: {
			// 		x,
			// 		y
			// 	},
			// 	contentSize: {
			// 		width,
			// 		height
			// 	}
			// }) {
			// 	// console.log(x,y,width,height,height + y)
			// 	this.$emit('scroll', x, y, width, height)
			// },
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
				// let newArr = [...this.selectlist]
				// this.CHANGE_SELECT_LIST(newArr.filter(item => {
				// 	let flag = true;
				// 	block.list.forEach(item2 => {
				// 		this.$delete(item2, 'checked')
				// 		if (item === item2) flag = false
				// 	})
				// 	return flag
				// }))
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

	.media-date {
		font-size: $uni-font-size-lg;
		color: $uni-color-subtitle;
		margin: 20rpx 20rpx;
	}

	// .image {
	// 	width: 150rpx;
	// 	height: 150rpx;
	// }

	// .grid-item-box {
	// 	flex: 1;
	// 	justify-content: center;
	// 	align-items: center;
	// }

	
</style>
