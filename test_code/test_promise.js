//================= （1）then中返回的是非Promise对象===================
// let a = 1;
// const promise = new Promise((resolve, reject) => {
//     console.log('a' + a)
//     resolve()
// })

// promise.then(() => {
//     let b = 1;
//     console.log('first then:' + b)
//     b = 2;
//     return
// }).then(() => {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             console.log('second then')
//             resolve();
//         }, 5 * 1000);
//     })
// }).then(() => {
//     console.log('third then')
// })


// //=============== （2）then中返回的是Promise对象=====================
// const promise = new Promise((resolve, reject) => {
//     resolve()
// })

// var a = (b) => {
//     console.log('this is function a ')
// }

// promise.then(() => {
//     let b = 1;
//     console.log('b1:' + b)
//     b = 2;
//     return new Promise((resolve, reject) => {
//         a(1)
//         resolve(1)
//     })
// }).then((x) => {
//     console.log('x:' + (x + 2))
// }).catch((err) => {
//     console.log('err:' + err)
// })

// (3)then的链式写法
// let a = 1;
// const promise = new Promise((resolve, reject) => {
//     console.log('a' + a)
//     resolve()
// })

// promise.then(() => {
//     let b = 1;
//     console.log('first then:' + b)
//     b = 2;
//     return
// }).then(() => {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             console.log('second then')
//             resolve();
//         }, 5 * 1000);
//     })
// }).then(() => {
//     console.log('third then')
// })


// 测试catch方法
// let promise = new Promise((resolve,reject)=>{
//     resolve(x)
// })

// promise.then((x)=>{
//     console.log(x)
// }).catch(
//     ()=>{
//         console.log('something wrong')
//     }
// )

Promise.resolve()
    .catch(function (error) {
        console.log('oh no', error);
    })
    .then(function () {
        console.log(x);
    }).catch(
        (err) => { throw new Error('something wrong') }
    ).catch((err) => { console.log(err) })