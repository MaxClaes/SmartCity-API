require('dotenv').config();
const process = require('process');
const jwt = require('jsonwebtoken');
const error = require('../../error');

/**
 * @swagger
 * components:
 *  securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 *  responses:
 *      InternalServorError:
 *          description: Internal servor error
 *      MissingJWT:
 *          description: JWT is missing
 *      Unauthenticated:
 *          description: The user is not authenticated
 */
module.exports.identification = async (req, res, next) => {
    const headerAuth = req.get('authorization');

    if (headerAuth !== undefined && headerAuth.includes("Bearer")){
        const jwtToken =  headerAuth.split(' ')[1];

        try {
            const decodedJwtToken = jwt.verify(jwtToken, process.env.SECRET_TOKEN);
            req.session = decodedJwtToken.value;
            req.session.authLevel = decodedJwtToken.status;
            next();
        } catch (error) {
            console.log(error);
            res.status(500);
        }
    } else {
        console.log();
        res.status(401).json({error: [error.UNAUTHENTICATED]});
    }
};
