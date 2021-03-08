const animation = uni.requireNativePlugin('animation')
export function animate(target, options) {
	return new Promise((resolve, reject) => {
		if (!target || !options) return reject('params error')
		animation.transition(target, options, () => {
			resolve(true)
		})
	})
}

export async function animates(multiple) {
	if (Object.prototype.toString.call(multiple) !== '[object Array]') return console.error('Not an Array')
	for (let item of multiple) {
		await animate(item.target, item.options)
	}
}
