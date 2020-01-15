

const promise = new Promise((resolve, reject) => {
    resolve()
})

var a = (b) => {
    console.log('b2:' + b)
}

promise.then(() => {
    let b = 1;
    console.log('b1:' + b)
    b = 2;
    return new Promise((resolve,reject)=>{        
        a(1)
        resolve(1)
    })
}).then(c).catch((err)=>{
    console.log('err:'+err)
})