const keys = require ('../keys')

module.exports = function (email) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Account was successfully created',
        html: `
        <h1>Welcome to my test store</h1>
        <p>Your account was successfully created with email ${email}</p>
        <hr />
        <a href="${keys.BASE_URL}">Test Store</a>
        `
    }
}