(function (window) {
  const A = "等待";
  const B = "完成";
  const C = "失败";
  function Promise(exec) {
    let self = this;
    self.info = undefined;
    self.status = A;
    self.callbacks = [];
    function handler(info, status, callback) {
      if (self.status != A) return;
      self.info = info;
      self.status = status;
      if (self.callbacks.length > 0) {
        self.callbacks.forEach((item) => {
          setTimeout(() => {item[callback]();});
        });
      }
    }
    function resolve(data) {
      handler(data, B, "OnResolved");
    }
    function reject(err) {
      handler(err, C, "OnRejected");
    }
    try {
      exec(resolve, reject);
    } catch (e) {
      reject(e);
      if (e instanceof Error) throw Error(e);
    }
  }
  window.Promise = Promise;
  Promise.prototype.then = function (OnResolve = (data) => data,OnReject = (err) => {throw err;}) {
    let self = this;
    return new Promise((r, j) => {
      function handler_async(callback) {
        try {
          let res = callback(self.info);
          if (res instanceof Promise) {
            res.then(
              (data) => {r(data)},
              (err) => {j(err)}
            );
          } else {
            r(res);
          }
        } catch (e) {
          j(e);
          if (e instanceof Error) throw Error(e);
        }
      }
      if (self.status == B) {
        setTimeout(() => {
          handler_async(OnResolve);
        });
      } else if (self.status == C) {
        setTimeout(() => {
          handler_async(OnReject);
        });
      } else {
        self.callbacks.push({
          OnResolved: () => {handler_async(OnResolve);},
          OnRejected: () => {handler_async(OnReject);},
        });
      }
    });
  };
  Promise.prototype.catch = function (OnReject = (err) => {throw err;}) {
    this.then(undefined, OnReject);
  };
  Promise.resolve = function (value){
    return new Promise((r,j)=>{
        if(value instanceof Promise){
          value.then(r,j)
        }else{
            r(value)
        }
    })
  } ;
  Promise.reject = function (reason){
    return new Promise((r,j)=>{
        j(reason) ;
        if(reason instanceof Promise){
            reason.catch((err)=>{ setTimeout(()=>{throw Error(err) ;})})
        }
    })
  } ;
  Promise.all = function(lists){
    let ls = new Array(lists.length)
    let flag = lists.length
    return new Promise((r,j)=>{
        lists.forEach((item,index)=>{
            Promise.resolve(item).then(  // 担心promisList不是一个Promised对象
                data=>{
                    ls[index] = data
                    flag -=1
                    if(!flag){
                        r(ls)
                    }
                },err=>{ j(err)}
            )
        })
    })
  }
  Promise.race = function (lists){
    let flag = false 
    return new Promise((r,j)=>{
        lists.forEach(item=>{
            Promise.resolve(item).then( // 担心promisList不是一个Promised对象
                data=>{ 
                    if(!flag){
                        r(data)
                        flag = true
                    }
                },
                err =>{ j(err)}
            )
        })
    })
  }
})(window);