export function getSystemInfo(attrName) {
	try {
		const SystemInfo = uni.getSystemInfoSync()
		let res;
		switch (attrName) {
			case 'wh':
				const {
					windowWidth,
					windowHeight
				} = SystemInfo
				res = {
					screenW: windowWidth,
					screenH: windowHeight
				}
				break;
		}
		return res
	} catch (e) {
		console.log('获取设备信息错误', e)
	}
}

