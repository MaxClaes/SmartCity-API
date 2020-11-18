module.exports.getProduit = async (id, client) => {
    return await client.query("SELECT * FROM produit WHERE id=$1", [id]);
}

module.exports.postProduit = async (nom, prix) => {
    return await client.query("INSERT INTO produit (nom, prix) VALUES ($1, $2)", [nom], [prix]);
}

module.exports.updatePrix = async (id, prix) => {
    return await client.query("UPDATE produit SET prix=$1 WHERE id=$2", [prix], [id]);
}

module.exports.deleteProduit = async (id) => {
    return await client.query("DELETE from produit WHERE id=$1", [id]);
}
