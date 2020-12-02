
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
    USER_NOT_FOUND_IN_BAND : {
        code : 210,
        msg : "User not found in band."
    },
    STATUS_ALREADY_CHANGED_IN_BAND : {
        code : 211,
        msg : "Status in band is already accepted/refused."
    },
    EMAIL_CONFLICT : {
        code : 212,
        msg : "Email already exists."
    }
};
