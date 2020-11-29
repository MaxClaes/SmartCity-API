// interface Error {
//     error;
//     message;
// }

module.exports = {
    MISSING_PARAMETER : {
        code : 201,
        message : "One or more parameters are missing."
    },
    UNAUTHENTICATED : {
        code : 202,
        message : "The caller is not authenticated."
    },
    BAD_AUTHENTICATION : {
        code : 211,
        message : "Bad Authentication data."
    },
    USER_NOT_FOUND : {
        code : 212,
        message : "User not found."
    },
    EMAIL_ALREADY_EXISTS : {
        code : 213,
        message : "Email already exists."
    },
    INVALID_PARAMETER : {
        code : 214,
        message : "One or more parameters are invalid."
    },
    EMPTY_PARAMETER : {
        code : 215,
        message : "One or more parameters are empty."
    },
    TYPE_PARAMETER : {
        code : 216,
        message : "One or more parameters have no valid type."
    },
    ACCESS_DENIED : {
        code : 217,
        message : "The user does not have sufficient access rights."
    },
    DRINK_NOT_FOUND : {
        code : 218,
        message : "Drink not found."
    },
    ACCESS_RESTRICTED : {
        code : 219,
        message : "Access restricted to the item's owner."
    }
};
