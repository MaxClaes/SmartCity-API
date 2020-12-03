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


module.exports.userDTO = (clientEntity) => {
    return  {
        id : clientEntity.client_id,
        name : clientEntity.name,
        firstname : clientEntity.firstname,
        birthdate : clientEntity.birthdate,
        email : clientEntity.email,
        registrationDate : clientEntity.registration_date,
        gender : clientEntity.gender,
        height : clientEntity.height,
        weight : clientEntity.weight,
        gsm : clientEntity.gsm,
        role : clientEntity.role,
        address : this.addressDTO(clientEntity)
    };
}

module.exports.addressDTO = (addressEntity) => {
    return {
        id : addressEntity.address_id,
        country : addressEntity.country,
        postalCode : addressEntity.postal_code,
        city : addressEntity.city,
        street : addressEntity.street,
        number : addressEntity.number
    };
}

module.exports.drinkDTO = (drinkEntity) => {
    return {
        id : drinkEntity.drink_id,
        label : drinkEntity.label,
        prcAlcohol : drinkEntity.prc_alcohol,
        quantity : drinkEntity.quantity,
        nbReports : drinkEntity.nb_reports,
        popularity : drinkEntity.popularity,
        createdBy : drinkEntity.created_by
    }
}

module.exports.bandClientDTO = (bandClientEntity) => {
    return {
        user : this.userDTO(bandClientEntity),
        band : this.bandDTO(bandClientEntity),
        //userId : bandClientEntity.client_id,
        //bandId : bandClientEntity.band_id,
        dateInvitation : bandClientEntity.invitation_date,
        status : bandClientEntity.status,
        role : bandClientEntity.role,
        invitedBy : bandClientEntity.invited_by
    }
}

module.exports.bandDTO = (bandEntity) => {
    return {
        id : bandEntity.band_id,
        label : bandEntity.label,
        creationDate : bandEntity.creation_date
    }
}

module.exports.consumptionDTO = (consumptionEntity) => {
    return {
        // userId : consumptionEntity.client_id,
        // drinkId : consumptionEntity.drink_id,
        // date : consumptionEntity.date
        id : consumptionEntity.consumption_id,
        date : consumptionEntity.date,
        userId : consumptionEntity.client_id,
        drink : this.drinkDTO(consumptionEntity)
    }
}
