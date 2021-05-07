function defineReactive(obj, key, val) {
    observe(val)
    Object.defineProperty(obj, key, {
        get() {
            console.log(`get${key}`);
            return val
        },
        set(nval) {
            if (nval !== val) {
                val = nval
                console.log(`set${key}`);
                observe(nval)
            }
        }
    })
}

function observe(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return
    }
    Object.keys(obj).forEach(key => defineReactive(obj, key, obj[key]))
}
function set(obj, key, val) {
    defineReactive(obj, key, val)
}

let obj = {
    foo: 'foo',
    bar: 'bar',
    baz: {
        test: 'test'
    }
}
observe(obj)
// obj.foo = 'ggg'
// obj.bar = 'ggg'
// obj.baz.test = 'ggg'
set(obj, 'haha', 'hhh')
// obj.haha = 'hhh'
obj.haha
