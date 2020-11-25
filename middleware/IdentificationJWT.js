require('dotenv').config();
const process = require('process');
const jwt = require('jsonwebtoken');

module.exports.identification = async (req, res, next) => {
    const headerAuth = req.get('authorization');
    if(headerAuth !== undefined && headerAuth.includes("Bearer")){
        const jwtToken =  headerAuth.split(' ')[1];
        try{
            const decodedJwtToken = jwt.verify(jwtToken, process.env.SECRET_TOKEN);
            req.session = decodedJwtToken.value;
            req.session.authLevel = decodedJwtToken.status;
            next();
        }
        catch (error) {
            console.log(error);
            res.sendStatus(400);
        }
    } else {
        console.log("Non auth");
        res.sendStatus(401);
    }
};
