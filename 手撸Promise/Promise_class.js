
/*整体结构
    1.写Promise构造函数
    2.将Promise向外暴露
*/

/*
    自定义Promise函数模块：IIFE（Imdiately Invoked Function Expression 立即执行的函数表达式）
*/
(function (window) {
    const PENDING = 'pending'
    const RESOLVED = 'fulfilled'
    const REJECTED = 'failure'

    class Promise {
        constructor(executor) {
            let self = this   //存储当前Promise对象，供闭包使用
            self.status = PENDING
            self.data = undefined
            self.callbacks = [] // 每个原生的结构为：{onResolved(){},onRejected(){}}

            /*
            resolve和reject 完成的内容
            1.判断状态，只有是PENDING才可以进入工作，否则直接返回空
            2.通过状态判断后，【存储数据，修改状态】
            3.判断是否存在已经指定的回调函数，如果存在则异步循环执行
            4.如果未存在指定回调函数，则略过
             */
            function resolve(data) {
                if (self.status !== PENDING) {
                    return
                }
                // 存储数据
                self.data = data
                // 修改状态
                self.status = RESOLVED
                // 如果callbacks有待执行的callback,立即异步执行callback,
                if (self.callbacks.length > 0) {
                    self.callbacks.forEach(cbObj => {
                        setTimeout(() => {
                            try {
                                cbObj.onResolved(self.data)
                            } catch (err) {
                                console.log("err OnResolve", err)
                            }
                        })
                    })
                }
            }
            function reject(err) {
                if (self.status !== PENDING) {
                    return
                }
                self.data = err
                self.status = REJECTED
                if (self.callbacks.length > 0) {
                    self.callbacks.forEach(cbObj => {
                        setTimeout(() => {
                            try {
                                cbObj.onRejected(self.data)
                            } catch (err) {
                                console.log("err OnReject", err)
                            }
                        })
                    })
                }
            }
            //执行器异常处理
            try {
                executor(resolve, reject)
            } catch (e) {
                reject(e)
            }
        }
        //promise 原型对象上的方法
        then = function (onResolved = (data) => { return data }, onRejected = (err) => { throw err }) {
            const self = this
            return new Promise((resolve, reject) => {

                //调用指定回调函数，根据结果，改变Promise状态和数据
                function handle(callback) {
                    try {
                        const result = callback(self.data)
                        //返回结果有两类：Promise 和 非 Promise
                        if (result instanceof Promise) { // promise 
                            result.then(resolve, reject)
                        } else {                          //非promise
                            resolve(result)
                        }
                    } catch (err) {
                        reject(err)
                    }
                }

                if (self.status === PENDING) {
                    //当前状态还是PENDING 状态，将回调函数保存起来。但是在执行的时候需要改变 Promise 状态和数据
                    self.callbacks.push(
                        {
                            onResolved(data) {
                                handle(onResolved)
                            },
                            onRejected(err) {
                                handle(onRejected)
                            }
                        })
                } else if (self.status === RESOLVED) {
                    //当前状态是RESOLVED 状态，则异步执行onResolved指定回调函数，并改变Promise状态和数据
                    setTimeout(() => {
                        handle(onResolved)
                    })
                } else {
                    //当前状态是REJECTED 状态，则异步执行onRejected指定回调函数，并改变Promise状态和数据
                    setTimeout(() => {
                        handle(onRejected)
                    })
                }
            })
        }
        catch = function (onRejected) {
            return this.then(undefined, onRejected)
        }


        // Promise函数对象的方法
        static resolve = function (value) {
            return new Promise((resolve, reject) => {
                if (value instanceof Promise) {
                    value.then(resolve, reject)
                } else {
                    resolve(value)
                }
            })
        }

        static reject = function (reason) {
            return new Promise((resolve, reject) => {
                reject(reason)
            })
        }
        static race = function (promisesList) {
            let successflag = false
            return new Promise((resolve, reject) => {
                promisesList.forEach((item, index) => {
                    Promise.resolve(item).then(
                        (data) => {
                            if (!successflag) {
                                resolve(data)
                                successflag = true
                            }
                        }, err => {
                            reject(err)
                        })
                })
            })

        }
        static all = function (promisesList) {
            let lists = new Array(promisesList.length)
            let counterflag = promisesList.length
            return new Promise((resolve, reject) => {
                promisesList.forEach((item, index) => {
                    Promise.resolve(item).then(
                        value => {
                            // lists.splice(index,1,value)
                            lists[index] = value
                            counterflag -= 1

                            //如果全部成功调用resolve。
                            if (!counterflag) {
                                resolve(lists)
                            }
                        },
                        err => {
                            reject(err)
                        }
                    )
                })
            })
        }
        static resolveDelay = function (value, timeout = 0) {
            return new Promise((resolve, reject) => {
                if (value instanceof Promise) {
                    setTimeout(() => {
                        value.then(resolve, reject)
                    }, timeout)
                } else {
                    setTimeout(() => {
                        resolve(value)
                    }, timeout)
                }
            })
        }
        static rejectDealy = function (reason, timeout = 0) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject(reason)
                }, timeout)
            })
        }
    }

    window.Promise = Promise


}(window))
