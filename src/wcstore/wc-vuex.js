
let Vue = null

class Store {
    constructor(options) {
        let { state, mutations, actions, getters } = options
        this._mutations = mutations
        this._actions = actions
        this._vm = new Vue({
            data: {
                $$state: state,
            },
            computed: {
                $$getters() {
                    return getters
                }
            }
        })
        // 如果是对象方法，需要绑定this
        this.commit = this.commit.bind(this)
    }
    get state() {
        return this._vm._data.$$state
    }
    set state(v) {
        console.error('请使用replaceState重置状态');
    }
    get getters() {
        let obj = {}
        let gobj = this._vm.$$getters
        for (const key in gobj) {
            obj[key] = gobj[key](this.state)
        }
        return obj
    }

    commit(type) {
        if (!this._mutations[type]) {
            console.error(`没有mutation--${type}`);
            return
        }
        this._mutations[type](this.state)
    }
    // 如果是函数方法，不需要绑定this
    dispatch = (type) => {
        if (!this._actions[type]) {
            console.error(`没有actions--${type}`);
            return
        }
        this._actions[type](this)
    }
}
function install(_Vue) {
    Vue = _Vue
    Vue.mixin({
        beforeCreate() {
            if (this.$options.wcstore) {
                Vue.prototype.$store = this.$options.wcstore
            }
        }
    })
}

export default { install, Store }

