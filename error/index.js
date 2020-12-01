// interface Error {
//     error;
//     message;
// }

// class Error {
//     constructor(parameter) {
//     }
// }

module.exports = {
    ACCESS_DENIED : {
        code : 201,
        msg : "The user does not have sufficient access rights."
    },
    UNAUTHENTICATED : {
        code : 202,
        msg : "The caller is not authenticated."
    },
    USER_NOT_FOUND : {
        code : 203,
        msg : "User not found."
    },



    MISSING_PARAMETER : {
        code : 201,
        message : "One or more parameters are missing."
    },

    BAD_AUTHENTICATION : {
        code : 211,
        message : "Bad Authentication data."
    },
    EMAIL_CONFLICT : {
        code : 213,
        message : "Email already exists."
    },
    USER_CONFLICT : {
        code : 225,
        message : "User already exists."
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
    NAN_PARAMETER : {
        code : 217,
        message : "One or more parameters are not numbers."
    },

    ACCESS_RESTRICTED : {
        code : 218,
        message : "Access restricted to the item's owner."
    },

    DRINK_NOT_FOUND : {
        code : 220,
        message : "Drink not found."
    },
    BAND_NOT_FOUND : {
        code : 221,
        message : "Band not found."
    },
    CONSUMPTION_NOT_FOUND : {
        code : 222,
        message : "Consumption not found."
    },
    USER_NOT_FOUND_IN_BAND : {
        code : 222,
        message : "User not found in band."
    },
    IDENTIFIED_USER_NOT_FOUND_IN_BAND : {
        code : 223,
        message : "Identified user not found in band."
    },
    ACCESS_DENIED_IN_BAND : {
        code : 224,
        message : "The user does not have sufficient access rights in band."
    },
    STATUS_NOT_ACCEPTED_IN_BAND : {
        code : 225,
        message : "The user does not have accepted band invitation."
    },
    STATUS_ALREADY_CHANGED_IN_BAND : {
        code : 226,
        message : "Status in band is already accepted/refused."
    }
};
