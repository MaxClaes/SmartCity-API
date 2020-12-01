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
    DRINK_NOT_FOUND : {
        code : 204,
        msg : "Drink not found."
    },
    CONSUMPTION_NOT_FOUND : {
        code : 205,
        msg : "Consumption not found."
    },
    BAND_NOT_FOUND : {
        code : 206,
        msg : "Band not found."
    },
    IDENTIFIED_USER_NOT_FOUND_IN_BAND : {
        code : 207,
        msg : "Identified user not found in band."
    },
    ACCESS_DENIED_IN_BAND : {
        code : 208,
        msg : "The user does not have sufficient access rights in band."
    },
    STATUS_NOT_ACCEPTED_IN_BAND : {
        code : 209,
        msg : "The user does not have accepted band invitation."
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




    USER_NOT_FOUND_IN_BAND : {
        code : 222,
        message : "User not found in band."
    },



    STATUS_ALREADY_CHANGED_IN_BAND : {
        code : 226,
        message : "Status in band is already accepted/refused."
    }
};
