const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    console.log(req.headers.authorization)
    const authHeader = req.headers.authorization;
    console.log(`Token: ${authHeader}`)
    console.log(`Token valid: ${(!authHeader)}`)
    const { noTokenProvided, tokenIncorrectFormat, malFormattedToken, invalidToken } = res.__('tokenErrors');
    console.log("Valida existe token")
    if (!authHeader)
        return res.status(noTokenProvided.status).send(noTokenProvided.description)
    console.log("validou")
    const parts = authHeader.split(' ')

    console.log("VAlida parts")
    if (!parts.length === 2)
        return res.status(tokenIncorrectFormat.status).send(tokenIncorrectFormat.description)
    console.log("VAlidou")
    const [schema, token] = parts;

    console.log("Valida bearer")
    if (!/^Bearer$/i.test(schema))
        return res.status(malFormattedToken.status).send(malFormattedToken.description)
    console.log("Validou")

    console.log("Valida jwt")
    jwt.verify(token, process.env.SHARED_SERVICES_INFO_SECRET, (err, decoded) => {
        if (err) return res.status(invalidToken.status).send(invalidToken.description)

        res.userId = decoded.id;
    })
    console.log("Validou")

    console.log("NEXT")
    next();
}