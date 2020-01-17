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

注意，调用resolve或reject并不会终结 Promise 的参数函数的执行。这是因为立即 resolved 的 Promise 是在本轮事件循环的末尾执行，总是晚于本轮循环的同步任务。
```
new Promise((resolve, reject) => {
  resolve(1);
  console.log(2);
}).then(r => {
  console.log(r);
});
=====
>>2
>>1
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
当**返回为空**，**或无return时**，入参为undefined

### （2）then中返回的是Promise对象
```
const promise = new Promise((resolve, reject) => {
    resolve()
})

var a = (b) => {
    console.log('this is function a ')
}

promise.then(() => {
    let b = 1;
    console.log('b1:' + b)
    b = 2;
    return new Promise((resolve, reject) => {
        a(1)
        resolve(1)
    })
}).then((x) => {
    console.log('x:' + (x + 2))
}).catch((err) => {
    console.log('err:' + err)
})
======
b1:1
this is function a 
x:3
```
这里新建一个Promise对象，并在对他的then回调中返回一个Promise对象，在使用二次then之后实际是第一个then方法返回的Promise对象所对应的resolve方法。

### (3)then方法的的链式写法的疑问
当返回的是非Promise对象，且无return，那么使用then方法我们实际上得到的还是一个Promise对象，那么我们继续调用then方法是什么效果呢？
Promise对象可以作为一种异步函数转化为同步的写法，但是必须return一个Promise对象，这样就可以实现等待上一个then中函数回调结束之后，才能进行下一个then方法中运算。

需要注意的是 setTimeOut函数如果采用这种写法时在走到setTimeOut那一行时，就已经开始计时了，并不会等他走完才走resolve.
```
 return new Promise((resolve, reject) => {
         setTimeout(() => {
             console.log('second then')             
         }, 5 * 1000);
         resolve();
     })
```
只有使用以下写法，将resolve函数包含在其中，才可以保证在setTimeOut的时间走完之后，才进行之后的then所调用的程序。
```
 promise.then(() => {
    let b = 1;
    console.log('first then:' + b)
    b = 2;
    return new Promise((resolve, reject) => {
         setTimeout(() => {
             console.log('second then')   
             resolve1();          
         }, 5 * 1000);         
     }).then(resolve1();
     ).catch()
```

## 3、Promise对象的catch方法
Promise 内部的错误不会影响到 Promise 外部的代码，通俗的说法就是“Promise 会吃掉错误”。

一般总是建议，Promise 对象后面要跟catch方法，这样可以处理 Promise 内部发生的错误。catch方法返回的还是一个 Promise 对象，因此后面还可以接着调用then方法。

```
Promise.resolve()
    .catch(function (error) {
        console.log('oh no', error);
    })
    .then(function () {
        console.log(x);
    }).catch(
        (err) => { throw new Error('something wrong') }
    ).catch((err) => { console.log(err) })
```
在catch之中也可以对抛出错误，只有后面还跟有catch方法，就可以对抛出的错误进行捕获。

为了保证Promise中的错误不会影响总体进行，所以一般在使用Promise对象时，**一定要跟一个catch方法**。

## 4、Promise对象的finally方法
finally方法用于指定不管 Promise 对象最后状态如何，都会执行的操作。
```
promise
.then(result => {···})
.catch(error => {···})
.finally(() => {···});
```
上面代码中，不管promise最后的状态，在执行完then或catch指定的回调函数以后，都会执行finally方法指定的回调函数。

finally方法的回调函数不接受任何参数，这意味着没有办法知道，前面的 Promise 状态到底是fulfilled还是rejected。这表明，finally方法里面的操作，应该是与状态无关的，不依赖于 Promise 的执行结果


## 5、几种接受一组Promise对象实例作为输入的方法
名称|方法
-|-
Promise.all()|所有对象都fulfilled,或有一个对象rejected;执行回调resolve(),或执行reject()
Promise.race()|有一个对象的状态变化，该对象的状态传入回调
Promise.allSettled()|等到所有对象的状态完成了变化，该组对象的状态结果作为一个数组返回

