<template>
	<view class="custom-list">
		<custom-breadCrumb :path="path" v-if='openBreadCrumb' @click='(item) => $emit("breadClick", item)'>
		</custom-breadCrumb>
		<skeleton :skeleton="skeletonList" :loading="skeletonLoading" animate ref='skeleton' v-if='!closeSkeleton'>
			<!-- :isNull="list.length" -->
			<uni-list :multiple='multiple' ref='list' :scrollY="isScroll" :border="false" @loadmore='$emit("loadmore")'
				@scroll='scroll'>
				<template v-if="!closeDownLoad">
					<uni-refresh @refresh='refresh' :display="downDisplay">
						<uni-load-more :status="downStatus" :contentText='downText' />
					</uni-refresh>
				</template>

				<template v-if='!list.length || !isShow'>
					<header style='flex:1;'>
						<custom-null :params='placeholder' ></custom-null>
					</header>
				</template>
				<template v-else>
					<template v-if='isMultiple'>
						<template v-for="(item, i) in afterList">
							<uni-list-item height="220rpx" direction="column" thumbSize="lg" :ref='!i ? "top" :  ""'
								:key='item.uuid' :ellipsis="1" clickable :title='item.fileName'
								:thumb="selectThumb(item)" @tap="select(item)" @longpress='showActionSheet(item)'>
								<template slot='footer'>
									<view class="item-right">
										<radio class="radio" color="#4070ff" :class="item.checked ? 'checked' : ''"
											:checked="item.checked">
										</radio>
									</view>
								</template>
							</uni-list-item>
							<template v-if="(i === afterList.length - 1)&& !closeUpLoad && isShow && list.length">
								<template v-if='isPageScroll'>
									<header>
										<uni-load-more :status="status" :contentText='loadText' />
									</header>
								</template>
								<template v-else>
									<loading @loading='loadMore' :display='display' v-if='status !== "noMore"'>
										<uni-load-more :status="status" :contentText='upText' />
									</loading>
									<cell v-else>
										<uni-load-more status="noMore" :contentText='upText' />
									</cell>
								</template>
							</template>
						</template>
					</template>
					<template v-else>
						<template v-for="(item, i) in afterList">
							<uni-list-item height="115rpx" :ref='!i ? "top" :  ""' thumbSize="base" :key='item.uuid'
								:ellipsis="1" clickable
								:title="item.list ? item.list[0].fileName + '...' : item.fileName" :note="note(item)"
								:thumb="selectThumb(item)" @tap="select(item)" @longpress='showActionSheet(item)'>
								<template slot='footer'>
									<view class="item-right">
										<radio class="radio" color="#4070ff" :class="item.checked ? 'checked' : ''"
											:checked="item.checked">
										</radio>
									</view>
								</template>
							</uni-list-item>
							<template v-if="(i === afterList.length - 1)&& !closeUpLoad && isShow && list.length">
								<template v-if='isPageScroll'>
									<header>
										<uni-load-more :status="status" :contentText='loadText' />
									</header>
								</template>
								<template v-else>
									<loading @loading='loadMore' :display='display' v-if='status !== "noMore"'>
										<uni-load-more :status="status" :contentText='upText' />
									</loading>
									<cell v-else>
										<uni-load-more status="noMore" :contentText='upText' />
									</cell>
								</template>
							</template>
						</template>
					</template>
				</template>
			</uni-list>
		</skeleton>
		<uni-list :multiple='multiple' ref='list' :scrollY="isScroll" :border="false" @loadmore='$emit("loadmore")'
			@scroll='scroll' v-else>
			<template v-if="!closeDownLoad">
				<uni-refresh @refresh='refresh' :display="downDisplay">
					<uni-load-more :status="downStatus" :contentText='downText' />
				</uni-refresh>
			</template>

			<cell style='flex:1' v-if='!isShow'>
				<custom-null :params='placeholder' ></custom-null>
			</cell>
			<template v-if='list.length'>
				<template v-if='isMultiple'>
					<template v-for="(item, i) in afterList">
						<uni-list-item height="220rpx" direction="column" thumbSize="lg" :ref='!i ? "top" :  ""'
							:key='item.uuid' :ellipsis="1" clickable :title='item.fileName' :thumb="selectThumb(item)"
							@tap="select(item)" @longpress='showActionSheet(item)'>
							<template slot='footer'>
								<view class="item-right">
									<radio class="radio" color="#4070ff" :class="item.checked ? 'checked' : ''"
										:checked="item.checked">
									</radio>
								</view>
							</template>
						</uni-list-item>
						<template v-if="(i === afterList.length - 1)&& !closeUpLoad && isShow && list.length">
							<template v-if='isPageScroll'>
								<header>
									<uni-load-more :status="status" :contentText='loadText' />
								</header>
							</template>
							<template v-else>
								<loading @loading='loadMore' :display='display' v-if='status !== "noMore"'>
									<uni-load-more :status="status" :contentText='upText' />
								</loading>
								<cell v-else>
									<uni-load-more status="noMore" :contentText='upText' />
								</cell>
							</template>
						</template>
					</template>
				</template>
				<template v-else>
					<template v-for="(item, i) in afterList">
						<uni-list-item height="115rpx" :ref='!i ? "top" :  ""' thumbSize="base" :key='item.uuid'
							:ellipsis="1" clickable :title="item.list ? item.list[0].fileName + '等等...' : item.fileName"
							:note="note(item)" :thumb="selectThumb(item)" @tap="select(item)"
							@longpress='showActionSheet(item)'>
							<template slot='footer'>
								<view class="item-right">
									<radio class="radio" color="#4070ff" :class="item.checked ? 'checked' : ''"
										:checked="item.checked">
									</radio>
								</view>
							</template>
						</uni-list-item>
						<template v-if="(i === afterList.length - 1)&& !closeUpLoad && isShow && list.length">
							<template v-if='isPageScroll'>
								<header>
									<uni-load-more :status="status" :contentText='loadText' />
								</header>
							</template>
							<template v-else>
								<loading @loading='loadMore' :display='display' v-if='status !== "noMore"'>
									<uni-load-more :status="status" :contentText='upText' />
								</loading>
								<cell v-else>
									<uni-load-more status="noMore" :contentText='upText' />
								</cell>
							</template>
						</template>
					</template>
				</template>
			</template>
			<!-- <template v-if="!closeUpLoad && isShow && list.length">
				<template v-if='isPageScroll'>
					<header>
						<uni-load-more :status="status" :contentText='loadText' />
					</header>
				</template>
				<template v-else>
					<loading @loading='loadMore' :display='display' v-if='status !== "noMore"'>
						<uni-load-more :status="status" :contentText='upText' />
					</loading>
					<cell v-else>
						<uni-load-more status="noMore" :contentText='upText' />
					</cell>
				</template>
			</template> -->
		</uni-list>
		<view class="fab" elevation="5px" ref='fab-top' :style="{bottom: action ? '65px' :  '15px'}"
			:class="{ 'fab-active': fabActive &&　isShowFabTop}">
			<uni-icons type="arrowthinup" size="60" color="white" @click='toScrollTop(true)'></uni-icons>
		</view>
		<custom-actionSheet :labels='actionSheetLabels' v-if="openActionSheet" @download='addDownList' @del='del'
			@move='move' @rename='rename' @restore='restore' @recycleDel='recycleDel' @share='share'
			@cancelShare='cancelShare' @copyLink='copyLink' @save='save' @openDir='openDir'>
		</custom-actionSheet>
	</view>
</template>

<script>
	import {
		mapMutations,
		mapState,
		mapActions
	} from 'vuex'
	import {
		selectIcon,
		open,
		formatBytes
	} from '@/util/file.js';
	import skeleton from '@/components/ls-skeleton/ls-skeleton.nvue'
	import loading from '@/common/js/mixins/loading.js'
	import refresh from '@/common/js/mixins/refresh.js'
	import actionsheet from '@/common/js/mixins/actionsheet.js'
	import sort from '@/util/sort.js'
	import {
		preview
	} from '@/api/file.js'
	import {
		animate
	} from '@/util/animation.js'
	export default {
		mixins: [loading, refresh, actionsheet],
		components: {
			skeleton
		},
		props: {
			// 是否隐藏列表
			isShow: {
				type: Boolean,
				default: true
			},
			closeSkeleton: {
				type: Boolean,
				default: false
			},
			// 上拉提示文本,但是页面滚动时该选项才有用
			loadText: {
				type: Object,
				default: () => {}
			},
			// 是否打开页面滚动
			isPageScroll: {
				type: Boolean,
				default: () => false
			},
			// 是否可以滚动
			isScroll: {
				type: [String, Boolean],
				default: true
			},
			// 是否打开组件自带的actionSheet
			openActionSheet: {
				type: Boolean,
				default: true
			},
			list: {
				type: Array,
				default: () => []
			},
			//  是否打开面包屑
			openBreadCrumb: {
				type: [String, Boolean],
				default: false
			},
			// 面包屑路径
			path: {
				type: Array,
				default: () => []
			},
			// 是否关闭组件自带的上拉下拉加载功能
			closeDownLoad: {
				type: Boolean,
				default: false
			},
			closeUpLoad: {
				type: Boolean,
				dafault: false
			},
			// 是否关闭长按触发事件
			closeLongPress: {
				type: Boolean,
				default: false
			},
			// 是否关闭点击触发事件
			closeClick: {
				type: Boolean,
				default: false
			},
			// 是否把触发事件传给父组件处理,true时把事件传给父组件,false时所以触发事件改为添加列表,该选项只有在 closeLongPress,closeClick 为 true时生效
			customEvent: {
				type: Boolean,
				default: false
			},
			// 选择模式的lables
			actionSheetLabels: {
				type: Object
			},
			// 是否开启排序
			isSort: {
				type: Boolean,
				default: true
			},
			// 过滤
			filter: {
				type: [String, Number],
				default: 'all'
			},
			// 是否显示返回顶部按钮
			isShowFabTop: {
				type: [String, Boolean],
				default: true
			},
			// 是否开启多列模式
			multiple: {
				type: Boolean,
				default: false
			},
			skeletonLoading: {
				type: Boolean,
				default: true
			},
			placeholder: {
				type: Object,
				default: () => {return {text: '暂无文件', mode: 'null'}}
			}
		},
		data() {
			const wHeight = uni.getSystemInfoSync().windowHeight
			return {
				fabActive: false,
				wHeight,
				// 自动计算骨架屏数量以便撑满屏幕
				skeletonList: this.$store.state.views.column === 1 || !this.multiple ?
					Array(Math.round(uni.upx2px(wHeight) / uni.upx2px(70))).fill('column-default') : Array(Math.round(uni
						.upx2px(wHeight) / uni.upx2px(130))).fill('column-3')
			}
		},
		methods: {
			...mapMutations('file', ['CHANGE_SELECT_LIST', 'TOGGLE_ACTION']),
			...mapActions('file', ['ADD_DOWN_LIST']),
			select(item) {
				if (this.closeClick) return this.customEvent ? this.$emit('click', item) : null
				if (this.action && item.type !== 25 && item.type !== 20) return this.addSelectList(item)
				this.$emit('selectTask', item)
				if (this.action && item.type === 20) return
				return open({
					current: item,
					list: this.list
				})
			},
			selectAll() {
				this.$emit('all')

			},
			exitAction() {
				this.$emit('clean')
			},
			refresh_list() {
				this.$emit('refreshList')
			},
			selectThumb(current) {
				if (current.type === 1 || current.type === 3) return preview(current.uuid, true)
				return selectIcon(current.type);
			},
			showActionSheet(item) {
				if (this.closeLongPress) return this.customEvent ? this.$emit('longpress', item) : null
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
				this.$forceUpdate()
			},
			// 滚动到顶部
			toScrollTop(animate = false) {
				this.$refs['list'].toScrollTop(this.$refs['top'][0], animate)
			},
			filterType(list) {
				switch (this.filter) {
					case 'img':
						return list.filter(item => item.type === 1)
						break;
					case 'video':
						return list.filter(item => item.type === 3)
						break;
					case 'music':
						return list.filter(item => item.type === 2)
						break;
					case 'office':
						return list.filter(item => item.type >= 8 && item.type <= 10)
						break;
					default:
						return list
				}
			},
			scroll({
				contentOffset
			}) {
				this.$emit('scroll')
				if (Math.abs(contentOffset.y) >= this.wHeight) {
					this.fabActive = true
				} else {
					this.fabActive = false
				}
			}
		},
		computed: {
			...mapState('file', ['selectlist', 'action']),
			...mapState('views', ['sortAction', 'sortMode', 'column']),
			afterList() {
				if (!this.isSort) return this.filterType(this.list)
				this.list.sort(sort[this.sortAction !== "up" ? this.sortMode + '_reverse' : this.sortMode])
				return this.filterType(this.list)
			},
			note() {
				return (item) => {
					return item.list ? `${item.list.length}个文件 ${item.date}` :
						`${item.date.split(' ')[0]}   ${item.file_size ? formatBytes(item.file_size) : ''}`
				}
			},
			isMultiple() {
				return this.multiple && this.column > 1
			}
		},
	}
</script>

<style lang="scss" scoped>
	.custom-list {
		flex-direction: column;
		@extend %flex;
	}

	.null-flex {
		@extend %flex;
	}

	.null-full {
		@include position(fixed, 0, 0, 0, 0)
	}

	.placeholder {
		height: 100rpx;
	}

	.item-right {
		@extend %f-ct;
	}

	.select-nav {
		@include position(fixed, 0, 0, false, 0);
		flex: 1;
		flex-direction: column;
		background-color: white;
	}

	.fab {
		@include position(fixed, false, 0, 15px);
		border-radius: 100rpx;
		background-image: linear-gradient(top right, #699eff, #4070ff);
		width: 100rpx;
		height: 100rpx;
		@extend %f-ct;
		transition-property: transform;
		transition-duration: 300;
		transition-timing-function: ease-in;
		transform: translateX(100%);
	}

	.fab-active {
		transform: translateX(-15px);
	}
</style>
