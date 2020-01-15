// //================= （1）then中返回的是非Promise对象===================
// const promise = new Promise((resolve, reject) => {
//     console.log('a' + a)
//     resolve()
// })

// promise.then(() => {
//     let b = 1;
//     console.log('b:' + b)
//     b = 2;
//     return b
// }).then((c) => {
//     console.log('c:' + c)
// })


//=============== （2）then中返回的是Promise对象=====================
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