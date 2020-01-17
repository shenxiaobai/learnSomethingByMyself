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