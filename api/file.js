import http from '@/util/luch-request/index.js'
import {
	baseURL
} from '@/util/luch-request/server.js'

/**
 * 预览
 */

export const preview = (uuid, zip) => {
	return `${baseURL}/preview/${uuid}?${zip ? 'zip=1':''}`
}

/**
 * signature
 */

export const signatureUrl = uuid => {
	return http.middleware({
		method: 'POST', // 必须大写
		url: '/signature',
		custom: {
			auth: true,
			// loading: {
			// 	title: '加载中...'
			// }
		},
		data: {
			uuid
		}
	})
}



/**
 * 获取服务端签名
 * @param {Object} user - 用户信息
 */
export const getoss = (user) => {
	return http.middleware({
		method: 'GET', // 必须大写
		url: '/getOss',
		custom: {
			auth: true,
			loading: {
				title: '提交中...'
			}
		}
	})
}

/**
 * 获取30天内的动态
 * @param {String} c - 是否开启缓存
 */
export const getdynamic = (c) => {
	return http.middleware({
		method: 'GET', // 必须大写
		url: '/getdynamic',
		custom: {
			auth: true,

		},
		params: {
			c
		}
	})
}

/**
 * 创建目录
 * @param {Object} name - 用户信息
 */

export const mkdir = (data) => {
	return http.middleware({
		method: 'POST', // 必须大写
		url: '/mkdir',
		custom: {
			auth: true,
			loading: {
				title: '创建中...'
			}
		},
		data
	})
}

/**
 * 修改文件
 */

export const edit = (uuid, val, action) => {
	return http.middleware({
		method: 'GET',
		url: '/files/' + uuid + '/edit?action=' + action + '&val=' + val,
		custom: {
			auth: true,
			loading: {
				title: '修改中...'
			}
		}
	})
}

export const update = (data) => {
	return http.middleware({
		method: 'PUT',
		url: '/files/' + data.val,
		custom: {
			auth: true,
			loading: {
				title: '更新中...'
			}
		},
		data
	})
}

/**
 * 删除文件
 */
export const del = (data) => {
	return http.middleware({
		method: 'DELETE',
		url: '/files/del',
		custom: {
			auth: true,
			loading: {
				title: '删除中...'
			}
		},
		data
	})
}

/**
 * 恢复文件
 */
export const restore = (data) => {
	return http.middleware({
		method: "POST",
		url: '/restore',
		custom: {
			auth: true,
			loading: {
				title: '恢复中...'
			}
		},
		data
	})
}



/**
 * 获取文件列表
 * @param {Object} pid - 父id
 * @param {Object} p - 页数
 * @param {Object} n - 数量
 * @param {Object} c - 是否开启缓存 1 0
 * @param {Object} t - 类型过滤
 */
export const getlist = (pid, p, n, c, t) => {
	return http.middleware({
		method: 'GET', // 必须大写
		url: '/files',
		custom: {
			auth: true
		},
		params: {
			pid,
			p,
			n,
			c,
			t
		}
	})
}


export const findchild = (uuid) => {
	return http.middleware({
		method: "GET",
		url: '/findchild',
		custom: {
			auth: true,
			loading: {
				title: '解析中...'
			}
		},
		params: {
			id: uuid
		}
	})
}


/**
 * 检查服务端是否存在该文件
 * @param {String} md5 - 文件摘要
 * @param {String} parent_id - 父文件id
 * @param {String} name - 文件名
 * @param {String} size - 文件大小
 */
export const check = (md5, parent_id, name, size) => {
	return http.middleware({
		method: 'GET', // 必须大写
		url: '/check',
		custom: {
			auth: true,
			loading: {
				title: '加载中...'
			}
		},
		params: {
			md5,
			parent_id,
			name,
			size
		}
	})
}


/**
 * 获取用户所有媒体类型文件
 * @param {Object} p - 页数
 * @param {Object} n - 数量
 * @param {Object} c - 是否开启缓存 1 0
 * @param {Object} t - 类型过滤
 */
export const getmedia = (p, n, c, t) => {
	return http.middleware({
		method: 'GET', // 必须大写
		url: '/getmedia',
		custom: {
			auth: true,

		},
		params: {
			p,
			n,
			c,
			t
		}
	})
}

/**
 * 获取用户所有回收站文件
 * @param {Object} p - 页数
 * @param {Object} n - 数量
 * @param {Object} c - 是否开启缓存 1 0
 */
export const getrecycle = (p, n, c) => {
	return http.middleware({
		method: 'GET', // 必须大写
		url: '/getrecycle',
		custom: {
			auth: true
		},
		params: {
			p,
			n,
			c,
		}
	})
}


/**
 * 搜索文件
 * @param {Object} q - 搜索关键字
 * @param {Object} p - 页数
 * @param {Object} n - 数量
 * @param {Object} c - 是否开启缓存 1 0
 * @param {Object} t - 类型过滤
 */
export const search = (q, p, n, c, t) => {
	return http.middleware({
		method: 'GET', // 必须大写
		url: '/search',
		custom: {
			auth: true,
			loading: {
				title: '搜索中...',
			}
		},
		params: {
			q,
			p,
			n,
			c,
			t
		}
	})
}
