const error = require('../error/index');

class User {
    constructor(name, firstname, birthdate, email, password, height, weight, gsm) {
        this.name = name;
        this.firstname = firstname;
        this.birthdate = birthdate;
        this.email = email;
        this.password = password;
        this.height = height;
        this.weight = weight;
        this.gsm = gsm;
    }

    validName() {
        if (this.name === undefined) {
            return error.MISSING_PARAMETER;
        }
        if (!this.name instanceof String) {
            return error.TYPE_PARAMETER;
        }
        if (this.name.trim() === "") {
            return error.EMPTY_PARAMETER;
        }
    }


}
