(function (window) {
  // 得到成功的promise
  async function MyAsync_s_const() {
    return "succ"; // 会被包装成一个promise:status:成功
  }
  async function MyAsync_s_p() {
    return new Promise((r, j) => {
      setTimeout(() => {
        r("succ");
      }, 1000);
    });
  }
  //----------------------------------------------
  async function MyAsync_f_const() {
    throw "err";
  }
  async function MyAsync_f_p() {
    return new Promise((r, j) => {
      setTimeout(() => {
        j("succ");
      }, 1000);
    });
  }
  //----------------------------------------------
  async function MyAwait_1() {
    console.log("await 开始等待,等待时间 1s ");
    await MyAsync_s_p();
    console.log("await 等待结束！然后这是才将返回的Promise设置完成状态");
    console.log("没有返回值就返回悬置的Promise");
  }
  function fn() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("OK statue");
          reject("No More");
      }, 1000);
    });
    //  return Promise.resolve("on statue");
    //  return Promise.reject("No more");
    //  return Promise.reject(Promise.reject("No more"));
    //  return Promise.reject(Promise.resolve("ok statue"));
  }
  async function MyAwait_2() {
    try {
      const result = await fn();
      console.log("Promise对象成功--接收返回Promise数据 ", result);
      return result;
    } catch (err) {
      console.log("Promise对象失败--接收失败数据 ", err);
    }
  }

  window.MyAsync_s_const = MyAsync_s_const;
  window.MyAsync_s_p = MyAsync_s_p;
  window.MyAsync_f_const = MyAsync_f_const;
  window.MyAsync_f_p = MyAsync_f_p;

  window.MyAwait_1 = MyAwait_1;
  window.MyAwait_2 = MyAwait_2;
})(window);
