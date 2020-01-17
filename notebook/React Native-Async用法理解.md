<!--
 * @PageName: 
 * @Descripttion: 
 * @Author: huaj5
 * @Date: 2020-01-16 14:03:47
 -->
# 一、对Async用法的理解

## 概述
 **async函数的返回值是 Promise 对象**，async函数完全可以看作多个异步操作，包装成的一个 Promise 对象，而await命令就是内部then命令的语法糖。

 正常情况下，**await命令后面是一个 Promise 对象**，返回该对象的结果。如果不是 Promise 对象，就直接返回对应的值。

 await命令后面是一个thenable对象（即定义then方法的对象），那么await会将其等同于 Promise 对象。

 await后跟对象的类型 | 处理方法
 -|-
 Promise对象|返回该对象的结果
 thenable对象| 等同于Promise对象  
 非Promise| 直接返回对应的值

任何一个await语句后面的 Promise 对象变为reject状态，那么整个async函数都会中断执行。
在这种情况下，如果希望不影响后续代码的运行，不中断后面的异步操作，这时可以将第一个await放在try...catch结构里面，这样不管这个异步操作是否成功，第二个await都会执行。
```
let f = async () => {
    try {
        await Promise.reject('something wrong');
    } catch (e) {
        console.log(e)
    }

    return await Promise.resolve('hello it\'s me')
}
f().then((a) => {
    console.log(a)
})
```
或者直接在awit之后使用catch，捕获可能抛出的错误。
```
let f = async ()=>{
    await Promise.reject('something wrong')
    .catch((e)=>{console.log(e)})
    return await Promise.resolve('hello it\'s me')
}

f().then((a)=>{
    console.log(a)
})
```
## 1、错误捕获

使用循环，对await命令进行多次重试。如果await操作成功，就会使用break语句退出循环；如果失败，会被catch语句捕捉，然后进入下一轮循环。
```
const superagent = require('superagent');
const NUM_RETRIES = 3;

async function test() {
  let i;
  for (i = 0; i < NUM_RETRIES; ++i) {
    try {
      await superagent.get('http://google.com/this-throws-an-error');
      break;
    } catch(err) {}
  }
  console.log(i); // 3
}

test();
```

## 2、多个await命令
多个await命令后面的异步操作，如果**不存在继发关系，最好让它们同时触发**。
```
//写法一
let foo = await getFoo();
let bar = await getBar();
```
写法一中，针对两个Promise对象，是分别进行await实例化的，所以会先执行完getFoo之后才会进行getBar。  
下面两种写法，分别使用Promise的原型方法和实例化与await分开的方法，实现了同时触发：
```
// 写法二
let [foo, bar] = await Promise.all([getFoo(), getBar()]);

// 写法三
let fooPromise = getFoo();
let barPromise = getBar();
let foo = await fooPromise;
let bar = await barPromise;
```





