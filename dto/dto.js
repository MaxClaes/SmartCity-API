// class User {
//     constructor(user) {
//         this.id = user.id;
//     }
// }

// module.exports.userEntityToModel = (user) => {
//     return {
//         id : user.id,
//         name : user.name,
//         firstname : user.firstname,
//         birthdate : user.birthdate,
//         email : user.email,
//         registrationDate : user.registration_date,
//         height : user.height,
//         weight : user.weight,
//         gsm : user.gsm,
//         role : user.role,
//         address : {
//             country : user.country,
//             postalCode : user.postal_code,
//             city : user.city,
//             street : user.street,
//             number : user.number
//         }
//     }
// }


module.exports.userDTO = (client) => {
    return  {
        id : client.client_id,
        name : client.name,
        firstname : client.firstname,
        birthdate : client.birthdate,
        email : client.email,
        registrationDate : client.registration_date,
        height : client.height,
        weight : client.weight,
        gsm : client.gsm,
        role : client.role,
        address : this.addressDTO(client)
    };
}

module.exports.addressDTO = (address) => {
    return {
        id : address.address_id,
        country : address.country,
        postalCode : address.postal_code,
        city : address.city,
        street : address.street,
        number : address.number
    };
}
