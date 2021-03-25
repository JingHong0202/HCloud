import {
	animate
} from '@/util/animation.js'
import {
	getEl
} from '@/util/bindingx.js'
const bindingx = uni.requireNativePlugin('bindingx'),
	dom = uni.requireNativePlugin('dom')
export default {
	methods: {
		back() {
			animate(
				this.$refs['ctx'], {
					styles: {
						transform: "translateY(100%)"
					},
					duration: 200,
					timingFunction: 'ease',
					delay: 0,
					needLayout: true
				}
			).then(() => {
				uni.navigateBack()
			})
		},
		TouchStart() {
			let ctx = this.$refs['ctx'],
				el = getEl(ctx);
			dom.getComponentRect(ctx, (({
				size
			}) => {
				this.ctxHeight = size.height
			}))
			bindingx.bind({
				eventType: 'pan',
				anchor: el,
				props: [{
					element: el,
					property: 'transform.translateY',
					expression: 'max(y+' + this.y + ',-0)'
				}]
			}, (e) => {
				if (e.state === 'end') {
					this.y += e.deltaY
					if (this.y < 0) this.y = 0
					// console.log(this.y)
					if (this.y > this.ctxHeight / 2) return this.back()
				}
			})
		}
	},
	data() {
		return {
			y: 0
		};
	},
	onBackPress({
		from
	}) {
		if (from === 'backbutton') {
			this.back();
			return true
		}
	},
	onReady() {
		animate(
			this.$refs['ctx'], {
				styles: {
					transform: "translateY(0)"
				},
				duration: 200,
				timingFunction: 'ease',
				delay: 0,
				needLayout: true
			}
		).then(() => {

		})
	}
}
