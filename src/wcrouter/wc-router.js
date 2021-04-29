// spa页面不能刷新：
// 1.hash
// 2.history api

// url变化显示对应内容：
// 1.router-view：占位容器
// 2.数据响应式

let Vue = null
// 1.实现插件
class WcRouter {
    constructor(options) {
        this.options = options;
        this.routes = options.routes;
        Vue.util.defineReactive(this, 'current', window.location.hash.slice(1) || '/')
        window.addEventListener('hashchange', () => {
            this.current = window.location.hash.slice(1)
        })
    }
}

// 插件要实现一个install方法
WcRouter.install = function (_Vue) {
    Vue = _Vue

    Vue.mixin({
        beforeCreate() {
            if (this.$options.wcrouter) {
                Vue.prototype.$router = this.$options.wcrouter
            }
        }
    })

    Vue.component('router-view', {
        render(h) {
            const { current, routes } = this.$router
            let component = routes.find(r => r.path === current).component
            return h(component)
        }
    })
    Vue.component('router-link', {
        props: {
            to: {
                type: String,
                default: ''
            }
        },
        render(h) {
            return h('a', { attrs: { href: `#${this.to}` } }, this.$slots.default)
        }
    })
};

export default WcRouter;
