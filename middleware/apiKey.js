require('dotenv').config();

module.exports = (req, res, next) => {

    const key = req.headers['x-api-key'];

    if (!key) {
        return res.status(401).json({ message: "API Key não fornecida" });
    }

    if (key !== process.env.API_KEY) {
        return res.status(403).json({ message: "API Key inválida" });
    }

    next();
};
