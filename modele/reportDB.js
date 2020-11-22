module.exports.resetReport = async (client, id) => {
    const nbReportsInitial = 0;

    return await client.query(`
        UPDATE drink SET nb_reports = $1
        WHERE id = $2;
        `, [nbReportsInitial, id]
    );
}

module.exports.incrementReport = async (client, id) => {
    return await client.query(`
        UPDATE drink SET nb_reports = (nb_reports + 1)
        WHERE id = $1;
        `, [id]
    );
}
