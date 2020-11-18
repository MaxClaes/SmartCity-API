const ProduitModele = require("../modele/produitDB");
// const pg = require("pg");
// const pool = pg.Pool;
const pool = require("../modele/database");

module.exports.getProduit = async (req, res) => {
    const client = await pool.connect();
    const idTexte = req.params.id; //attention ! Il s'agit de texte !
    const id = parseInt(idTexte);
    
    try{
        if(isNaN(id)){
            res.sendStatus(400);
        } else {
            const {rows: produits} = await ProduitModele.getProduit(id, client);
            const produit = produits[0];
    
            if(produit !== undefined){
                res.json(produit);
            } else {
                res.sendStatus(404);
            }
        }
    } catch (error){
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.postProduit = async (req, res) => {
    const client = await pool.connect();
    const body = req.body;
    const {id, nom, prix} = body;
    const reponse = await ProduitModele.postProduit(id, nom, prix);
    
    if (reponse) {
        res.sendStatus(201);
    
    } else {
        res.sendStatus(500);
    }

    client.release();
}

module.exports.updateProduit = async (req, res) => {
    const client = await pool.connect();
    const {id} = req.body;
    const reponse = await ProduitModele.deleteProduit(id);

    if (reponse) {
        res.sendStatus(204);
    } else {
        res.sendStatus(500);
    }

    client.release();
}

module.exports.deleteProduit = async (req, res) => {
    const client = await pool.connect();
    const {id} = req.body;
    const reponse = await ProduitModele.deleteProduit(id);

    if (reponse) {
        res.sendStatus(204);
    } else {
        res.sendStatus(500);
    }

    client.release();
}