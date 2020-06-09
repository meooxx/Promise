# Promise/a+部分实现

实现了部分的 Promise/a+ 规范.只用于学习理解使用, 所以只简单测过几个 case, 不可用于`生产环境`. 另外`.catch`, `.finally`, `.all` 等. 其实都很好实现, 类似于或者基于`.then`, 看一下明白了. `.all()` 稍微复杂一点, 但是也没有什么东西, 理解就完事了. _懒癌晚期_

_==> 等同于 `下一步`_
- `new Promise(fn)` ==> call(fn), with resolve, reject arguments
- `resolve(value)` ==> resolve Promise value/resolve function value/resolve value 
- and else `promise.state = 1`, iterate hander[], calling every handler, with promise.value
- `then(handler)`, if pedding, push to handler[], else, before the next eventLoop, `res = onFulfill(state.value)/onReject(state.value)`, and resolve the handler promise with res

## Reference

- [Promise/A+规范](https://promisesaplus.com/)
- [Promise-implementing](https://www.promisejs.org/implementing/)
- [github:then/promise](git@github.com:then/promise.git)
