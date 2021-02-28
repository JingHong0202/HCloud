async function isCollection(Arg) {
	let list = [...Arg],
		Collection = [];

	list.forEach((item, i) => {
		let insert;
		switch (item.type) {
			case 0:
				//folder
				insert = [{
						fileName: 'uni-app教学图片',
						type: 1,
						url: 'https://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png',
						date: '2020-12-04',
						thumb: 'https://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png',
						uuid: 23442
					},
					{
						fileName: 'uni-app教学视频',
						type: 3,
						url: 'https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20200317.mp4',
						date: '2020-12-04',
						thumb: 'https://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png',
						uuid: 230441
					}
				]
				break;
			case 20:
				//dynamic
				insert = item.list
				break;
			default:
				return
		}

		Collection.push({
			insert,
			i
		})
	});
	Collection.forEach(item => {
		let i = item.i,
			insert = item.insert
		let left = list.slice(0, i),
			right = list.slice(i + 1, list.length)

		list = left.concat(insert).concat(right)
	})
	return list
}


export default {
	namespaced: true,
	state: {
		selectlist: [],
		action: false,
		downlist: uni.getStorageSync('downlist') || [],
		uplist: uni.getStorageSync('uplist') || []
	},
	actions: {
		async ADD_DOWN_LIST({
			commit,
			state
		}) {
			// 判断文件类型是否是 0文件夹  20集合，是的话根据uuid请求获取其所有的子文件或从缓存中读取
			let selectlist = await isCollection(state.selectlist),
				downlist = [...state.downlist]
			// 过滤重复选项
			selectlist = selectlist
				.filter(item => {
					return downlist.every(item2 => {
						return item2.uuid !== item.uuid
					})
				})
			let Val = [...downlist, ...selectlist].map(item => {
				let obj = { ...item
				}
				if (!obj.status) obj.status = 'LOADING'
				if (obj.checked) delete obj.checked
				return obj
			})
			commit('CHANGE_DOWN_LIST', Val)
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
		}
	},
	getters: {
		RUNTIME(state) {
			return [...state.downlist, ...state.uplist].length
		},
		GET_DOWNLIST_STATUS(state) {
			return state.downlist.map(item => item.status)
		},
		GET_UPLIST_STATUS(state) {
			return state.uplist.map(item => item.status)
		}
	}
}
