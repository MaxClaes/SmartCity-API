// const Produit = require('./produit');
// const express = require('express');
// const app = express();
// const port = 3000;

// app.use(express.json());

// app.get('/', (req, res) => {
//     res.send('Hello tout le monde !');
// });

// app.get('/produit/:id', (req, res) => {
//     const idTexte = req.params.id;
//     const id = parseInt(idTexte);
//     if (isNaN(id)) {
//         res.sendStatus(400);
//     } else {
//         try {
//             const produit = Produit.getProduit(id);
//             res.json(produit);
//         } catch (error) {
//             res.sendStatus(400);
//         }
//     }
// });

// app.post('/produit', (req, res) => {
//     const body = req.body;
//     const {id, nom, prix} = body;
//     const reponse = ProduitModele.postProduit(id, nom, prix);

//     if (reponse) {
//         res.sendStatus(201);
//     } else {
//         res.sendStatus(500);
//     }
// });

// app.patch('/produit', (req, res) => {
//     const {id, prix} = req.body;
//     const reponse =  ProduitModele.updatePrix(id, prix);

//     if (reponse) {
//         res.sendStatu(204);
//     } else {
//         res.sendStatus(404);
//     }
// });

// app.delete('/produit', (req, res) => {
//     const {id} = req.body;
//     const reponse = ProduitModele.deleteProduit(id);

//     if (reponse) {
//         res.sendStatus(204);
//     } else {
//         res.sendStatus(500);
//     }
// });

// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`);
// });

const Router = require('./route');
const express = require('express')
const app = express()
const port = 3001

app.use(express.json());
app.use(Router);

app.get('/', (req, res) => {
    res.send('Hello tout le monde !');
});

// app.get('/produit/:id', (req, res) => {
//     const idTexte = req.params.id;
//     const id = parseInt(idTexte);
//     if (isNaN(id)) {
//         res.sendStatus(400);
//     } else {
//         try {
//             const produit = Produit.getProduit(id);
//             res.json(produit);
//         } catch (error) {
//             res.sendStatus(400);
//         }
//     }
// });

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
