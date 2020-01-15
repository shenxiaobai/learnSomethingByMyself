# 一、对Promise用法的理解

## 1、Promise框架
使用Promise之前需要先构建一个Promise对象。
```
import {PFHTTPManager} from XXX;

export function fetch(url, params) {
  return new Promise(function (resolve, reject) {
    PFHTTPManager.fetch(url, params, (isError, data) => {
      if (isError !== 0) {
        const message = '请求失败，请稍后再试';
        reject({ isError, data, message });
        return;
      }
      const dataObj = JSON.parse(data);
      if (!dataObj.hasOwnProperty('RspHeader')) {
        const message = '系统异常，请稍后再试';
        reject({ isError, data, message });
        return;
      }
      resolve(dataObj);
    });
  });
}
```
函数fetch返回了一个新的Promise对象，在这个Promise对象中做了HTTP请求，并对这个HTTP请求的结果进行成功（resolve）和失败（reject)的区分判断。
从框架层面上设定了成功的回调函数运行的位置，以及失败的回调函数运行的位置。

实际上resolve和reject函数的具体结构,在实际使用这个Promise对象的时候才会写
```
fetch('/msliv-web-loan/ActSendMobileDync.ah', params).
then(
    //resolve函数的具体逻辑
    ({ RspHeader, RspBody }) => {   
    this.setState({ showTimer: true })
    if (RspHeader.ResponseCode !== 'AAAAAAA') {
        return Promise.reject({
            isError: 0, data: { RspHeader, RspBody },
            message: "验证码获取失败，请重新获取!"
        });
    }
}).catch(
    //reject函数的具体逻辑
    ({ isError, data, message }) => {    
    if (isError === 2) {
        this.setState({ showWaitPanel: false })
        return;
    }
    this.setState({
        alertMsg: message,
        showAlert: true
    })
}).finally(() => {
    this.setState({ showWaitPanel: false })
})
```

## 2 Promise对象的then方法
then方法返回的是一个**新的Promise实例**（注意，不是原来那个Promise实例）。因此可以采用链式写法，即**then方法后面再调用另一个then方法**。

### （1）then中返回的是非Promise对象

```
const promise = new Promise((resolve, reject) => {
    console.log('a' + a)
    resolve()
})

promise.then(() => {
    let b = 1;
    console.log('b:' + b)
    b = 2;
    return b
}).then((c) => {
    console.log('c:' + c)
})

========
console结果
>>b:1
>>c:2
```
这里可以看到第一个then如果返回一个非Promise对象时，作为下一个then的入参，进入第二个then的函数。

```
const promise = new Promise((resolve, reject) => {
    console.log('a' + a)
    resolve()
})

promise.then(() => {
    let b = 1;
    console.log('b:' + b)
    b = 2;
    return 
}).then((c) => {
    console.log('c:' + c)
})

========
console结果
>>b:1
>>c:undefined
```
当返回为空，或无return时，入参为undefined

### （2）then中返回的是Promise对象


