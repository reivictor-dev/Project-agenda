const { async } = require('regenerator-runtime');
const Contato = require('../models/ContatoModel');

exports.index = async (req, res) => {
    const contatos = new Contato(req.body);
    const contatoSearch = await contatos.buscaContatos();
    res.render('index', { contatoSearch });
}