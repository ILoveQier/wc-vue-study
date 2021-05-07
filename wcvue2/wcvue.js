function defineReactive(obj, key, val) {
    observer(val)
    let dep = new Dep()
    Object.defineProperty(obj, key, {
        get() {
            Dep.target && dep.addDep(Dep.target)
            return val
        },
        set(nval) {
            if (nval !== val) {
                val = nval
                observer(val)
                dep.notify()
            }
        }
    })
}

function observer(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return
    }
    Object.keys(obj).forEach(key => defineReactive(obj, key, obj[key]))
}

function proxy(vm) {
    Object.keys(vm.$data).forEach(key => {
        Object.defineProperty(vm, key, {
            get() {
                return vm.$data[key]
            },
            set(nval) {
                vm.$data[key] = nval
            },
        })

    })
}



class WCVue {
    constructor(options) {
        this.$options = options
        this.$data = options.data
        this.$el = options.el
        observer(this.$data)
        proxy(this)
        new Compiler(this.$el, this)
    }
}

class Compiler {
    constructor(el, vm) {
        this.$node = document.querySelector(el)
        this.$vm = vm
        if (this.$node) {
            this.compile(this.$node)
        }
    }
    compile(node) {
        const childNodes = node.childNodes
        Array.from(childNodes).forEach(cnode => {
            if (this.isElement(cnode)) {
                this.compileElement(cnode)
                if (cnode.childNodes) {
                    this.compile(cnode)
                }
            } else if (this.isInterpolation(cnode)) {
                this.compileInterpolation(cnode)
            }
        })
    }
    isElement(node) {
        return node.nodeType === 1
    }
    isInterpolation(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
    }
    isDirective(attrName) {
        return attrName.startsWith('wc-')
    }
    compileElement(n) {
        const attrs = n.attributes
        Array.from(attrs).forEach(attr => {
            let attrName = attr.name
            let exp = attr.value
            if (this.isDirective(attrName)) {
                let directive = attrName.substring(3)
                this.update(n, exp, directive)
            }
        })
    }
    compileInterpolation(n) {
        this.update(n, RegExp.$1.trim(), 'text')
    }

    update(n, exp, directive) {
        const fn = this[`${directive}Updater`]
        fn && fn(n, this.$vm[exp])

        new Watcher(this.$vm, exp, val => {
            fn && fn(n, this.$vm[exp])
        })
    }

    text(obj, n, directive) {
        this[`${directive}Updater`](n, obj[RegExp.$1])
    }

    textUpdater(n, val) {
        n.textContent = val
    }
}

class Watcher {
    constructor(vm, exp, updater) {
        this.vm = vm
        this.exp = exp
        this.updater = updater

        Dep.target = this
        this.vm[this.exp]
        Dep.target = null

    }
    update() {
        this?.updater(this.vm[this.exp])
    }
}

class Dep {
    constructor() {
        this.deps = []
    }
    addDep(dep) {
        this.deps.push(dep)
    }
    notify() {
        this.deps.forEach(dep => dep.update())
    }
}