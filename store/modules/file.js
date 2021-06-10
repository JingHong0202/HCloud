import {
	getFileInfoSync,
	getFileMimeType
} from '@/util/file.js'
import {
	findchild
} from '@/api/file.js'
async function parse(Arg) {
	let list = [...Arg],
		Collection = [];
	for (let [i, item] of list.entries()) {
		let insert;
		if (!item.type) {
			const {
				data
			} = (await findchild(item.uuid)).data
			insert = data
			Collection.push({
				insert,
				id: item.uuid
			})
		}
	}
	Collection.forEach(item => {
		let i = list.findIndex(item2 => item2.uuid === item.id),
			insert = item.insert
		let left = list.slice(0, i),
			right = list.slice(i + 1)

		list = left.concat(insert).concat(right)
	})
	return list
}
export default {
	namespaced: true,
	state: {
		selectlist: [],
		action: false,
		downlist: [],
		uplist: []
	},
	actions: {
		async ADD_DOWN_LIST({
			commit,
			state
		}) {
			// 判断文件类型是否是 0文件夹  20集合，是的话根据uuid请求获取其所有的子文件或从缓存中读取
			let selectlist = await parse(state.selectlist),
				downlist = [...state.downlist]
			// 过滤重复选项
			selectlist = selectlist
				.filter(item => {
					return downlist.every(item2 => {
						return item2.uuid !== item.uuid
					})
				})
			let Val = [...downlist, ...selectlist].map(item => {
				let obj = {
					...item
				}
				if (!obj.status) obj.status = 'LOADING'
				if (obj.checked) delete obj.checked
				return obj
			})
			commit('CHANGE_DOWN_LIST', Val)
		},
		async ADD_UP_LIST({
			commit,
			state
		}, {
			target,
			selectlist
		}) {

			uni.showLoading({
				mask: true,
				title: '上传准备中...'
			})
			let format = await Promise.all([...selectlist].map(async item => {
				const url = Object.prototype.toString.call(item) ===
					'[object Object]' ?
					'file:///' + item.path.toString() : item
				let {
					size,
					digest
				} = await getFileInfoSync(url)
				let mimeType = await getFileMimeType(url)
				let res = {
					// ...item,
					fileName: item.fileName ? item.fileName : item.split('/')[
						item.split('/')
						.length - 1],
					size,
					md5: digest,
					file_id: target,
					url,
					type: mimeType,
				}
				if (mimeType === 1 || mimeType === 3) res.thumb = url
				delete res.path
				delete res.checked
				return res
			}));
			// 根据md5过滤重复
			let addlist = format.filter(item => {
				return state.uplist.every(item2 => {
					return item.md5 !== item2.md5
				})
			})

			if (!addlist.length) {
				uni.showToast({
					title: '选择的文件已在传输列表中',
					position: 'bottom'
				})
				return uni.hideLoading()
			}
			let marge = [...state.uplist, ...addlist.map(item => {
				return {
					...item,
					status: 'LOADING'
				}
			})]
			commit('CHANGE_UP_LIST', marge)
		}
	},
	mutations: {
		CHANGE_SELECT_LIST(state, newVal) {
			state.selectlist = newVal
		},
		TOGGLE_ACTION(state, newVal) {
			state.action = newVal
		},
		CHANGE_DOWN_LIST(state, newVal) {
			state.downlist = newVal
		},
		CHANGE_UP_LIST(state, newVal) {
			state.uplist = newVal
			uni.hideLoading()
		}
	},
	getters: {
		RUNTIME(state) {
			return [...state.uplist.filter(item => item.status === 'RUNTIME' || item.status ===
					'LOADING'), ...state
				.downlist.filter(item => item.status === 'RUNTIME' || item.status === 'LOADING')
			].length
		},
		// GET_UPLIST_RUNTIME(state) {
		// 	return state.uplist.filter(item => item.status === 'RUNTIME')
		// },
		// GET_UPLIST_ERROR(state) {
		// 	return state.uplist.filter(item => item.status === 'ERROR')
		// },
		// GET_UPLIST_STOP(state) {
		// 	return state.uplist.filter(item => item.status === 'STOP')
		// },
		GET_UPLIST_LOADING(state) {
			return state.uplist.filter(item => item.status === 'LOADING')
		},
		GET_DOWNLIST_LOADING(state) {
			return state.downlist.filter(item => item.status === 'LOADING')
		},
		// GET_UPLIST_SUCCESS(state) {
		// 	return state.uplist.filter(item => item.status === 'SUCCESS')
		// },

		GET_DOWNLIST_RUNTIME(state) {
			return state.downlist.filter(item => item.status === 'RUNTIME')
		},
		// GET_DOWNLIST_STATUS(state) {
		// 	return state.downlist.map(item => item.status)
		// },
		// GET_UPLIST_STATUS(state) {
		// 	return state.uplist.map(item => item.status)
		// }
	}
}
