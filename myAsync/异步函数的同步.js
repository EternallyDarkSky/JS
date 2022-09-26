(function (window) {
  function fetch_example() {
    fetch("http://localhost:5000/students/1", {
      method: "GET",
      mode: "cors",
    }).then((data) => {
      return data.json();
      data.json();
    }).then(data => {
      console.log(data);
    });

    fetch("http://localhost:5000/students/2", {
      method: "GET",
      mode: "cors",
    }).then((data) => {
      return data.json();
      data.json();
    }).then(data => {
      console.log(data);
    });
    fetch("http://localhost:5000/students/3", {
      method: "GET",
      mode: "cors",
    }).then((data) => {
      return data.json();
      data.json();
    }).then(data => {
      console.log(data);
    });
  }

  async function MyAsync_fetch() {

    let resp1 = await fetch("http://localhost:5000/students/1", { method: "GET", mode: "cors", })
    let json1 = await resp1.json()
    console.log(json1);
    
    let resp2 = await fetch("http://localhost:5000/students/2", { method: "GET", mode: "cors", })
    let json2 = await resp2.json()
    console.log(json2);
    let resp3 = await fetch("http://localhost:5000/students/3", { method: "GET", mode: "cors", })
    let json3 = await resp3.json()
    console.log(json3);
  }

  async function MyAsync_(){
     // promise.all 实现并发异步
      let response = await Promise.all([
        fetch("http://localhost:5000/students/1", { method: "GET", mode: "cors", }),
        fetch("http://localhost:5000/students/2", { method: "GET", mode: "cors", }),
        fetch("http://localhost:5000/students/3", { method: "GET", mode: "cors", })
      ])
      console.log(response);
      let jsons = response.map((response)=>{return response.json()})
      console.log(jsons);
      let datas = await Promise.all(jsons)
      console.log(datas);
  }

  window.fetch_example = fetch_example;
  window.MyAsync_fetch = MyAsync_fetch;
  window.MyAsync_ = MyAsync_;
})(window);
