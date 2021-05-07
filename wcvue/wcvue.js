
class WCVue {
    constructor(options) {
        this.$options = options
        this.$data = options.data
        this.$el = options.el
        this.$methods = options.methods

        observe(this.$data)
        proxy(this)
        new Compile(this.$el, this)
    }
}

class Compile {
    constructor(el, vm) {
        this.$vm = vm
        this.$el = document.querySelector(el)
        if (this.$el) {
            this.compile(this.$el)
        }
    }
    update(n, exp, directive) {
        let fn = this[`${directive}Updater`]
        fn && fn(n, this.$vm[exp])

        new Watcher(this.$vm, exp, val => {
            fn && fn(n, val)
        })
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
    isElement(n) {
        return n.nodeType === 1
    }
    isInterpolation(n) {
        return n.nodeType === 3 && /\{\{(.*)\}\}/.test(n.textContent)
    }
    isDirective(dir) {
        return dir.startsWith('wc-')
    }
    isEvent(dir) {
        return dir.startsWith('@')
    }
    compileInterpolation(n) {
        this.update(n, RegExp.$1, 'text')
    }
    compileElement(n) {
        let attrs = n.attributes
        Array.from(attrs).forEach(attr => {
            const attrName = attr.name
            const exp = attr.value
            if (this.isDirective(attrName)) {
                let directive = attrName.substring(3)
                this[directive] && this[directive](n, exp)
            }
            if (this.isEvent(attrName)) {
                let event = attrName.substring(1)
                n.addEventListener(event, this.$vm.$methods[exp].bind(this.$vm))
            }
        })
    }
    text(n, exp) {
        this.update(n, exp, 'text')
    }
    textUpdater(n, val) {
        n.textContent = val
    }
    html(n, exp) {
        this.update(n, exp, 'html')
    }
    htmlUpdater(n, val) {
        n.innerHTML = val
    }
    model(n, exp) {
        this.update(n, exp, 'model')
        n.addEventListener('input', (e) => {
            this.$vm[exp] = e.target.value
        })
    }
    modelUpdater(n, val) {
        n.value = val
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
        this.updater && this.updater.call(this.vm, this.vm[this.exp])
    }
}

class Dep {
    constructor() {
        this.deps = []
    }
    addDep(watcher) {
        this.deps.push(watcher)
    }
    notify() {
        this.deps.forEach(watcher => watcher.update())
    }
}