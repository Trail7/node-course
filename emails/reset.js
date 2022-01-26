const keys = require ('../keys')

module.exports = function(email, token) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Reset Password',
        html: `
        <h1>Forgot password?</h1>
        <p>If it was not you please disregard this email</p>
        <p>To restore you access to the site click on the following link</p>
        <p><a href="${keys.BASE_URL}/auth/password/${token}">Reset password</a></p>
        <hr />
        <a href="${keys.BASE_URL}">Test Store</a>
        `
    }
}