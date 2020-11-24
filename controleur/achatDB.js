// const pool = require('../modele/database');
// const ClientModele = require("../modele/clientDB");
// const AchatModele = require("../modele/achatDB");
//
// module.exports.insertAchat = async (req, res) => {
//     const client = await pool.connect();
//     const {idProduit, client:clientObj, quantite} = req.body;
//
//     try {
//         client.query("BEGIN;");
//         const clientExist = await ClientModele.clientExist(client, clientObj.id);
//
//         if (clientExist) {
//             const reponse = await AchatModele.insertAchat(client, clientObj.id, idProduit, quantite);
//             client.query("COMMIT;");
//             res.sendStatus(201)
//         } else {
//             // reponse = await ClientModele.createClient(clientObj, clientObj.name, clientObj.surname, clientObj.address);
//             client.query("ROLLBACK;");
//             res.status(404).json({error: "l'id du client n'existe pas"});
//         }
//
//     } catch (e){
//         client.query("ROLLBACK;");
//         console.log(e);
//         res.sendStatus(500);
//     } finally {
//         client.release();
//     }
// }
