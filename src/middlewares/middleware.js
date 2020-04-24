const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    const authHeader = req.headers.authorization;
    const { noTokenProvided, tokenIncorrectFormat, malFormattedToken, invalidToken } = res.__('tokenErrors');

    if (!authHeader)
        return res.status(noTokenProvided.status).send(noTokenProvided.description)

    const parts = authHeader.split(' ')

    if (!parts.length === 2)
        return res.status(tokenIncorrectFormat.status).send(tokenIncorrectFormat.description)

    const [schema, token] = parts;

    if (!/^Bearer$/i.test(schema))
        return res.status(malFormattedToken.status).send(malFormattedToken.description)

    jwt.verify(token, process.env.SHARED_SERVICES_INFO_SECRET, (err, decoded) => {
        if (err) return res.status(invalidToken.status).send(invalidToken.description)

        res.userId = decoded.id;
    })

    next();
}