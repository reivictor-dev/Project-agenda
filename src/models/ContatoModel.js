const mongoose = require('mongoose');
const { async } = require('regenerator-runtime');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
    nome: { type: String, required: true},
    sobrenome: { type: String, required: false, default: ''},
    email: { type: String, required: false, default: ''},
    telefone: { type: String, required: false, default: ''},
    criadoEm: { type: Date, default: Date.now}
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

class Contato {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.contato = null;
    }


    async register() {
        this.valida();

        if(this.errors.length > 0) return;
        this.contato = await ContatoModel.create(this.body);
    }

    valida() {
        this.cleanUp();
        //validação
        //O e-mail precisa ser valido
        if (this.body.email && !validator.isEmail(this.body.email)) {
            this.errors.push('Email inválido!');
        }
        if (!this.body.nome) this.errors.push('Nome é um campo obrigatório.');
        if (!this.body.email && !this.body.telefone) {
            this.errors.push('Pelo menos um contato precisa ser enviado: e-mail ou telefone.');
        }
    }

    cleanUp() {
        for (const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            nome: this.body.nome,
            sobrenome: this.body.sobrenome,
            email: this.body.email,
            telefone: this.body.telefone
            
        }
    }

    async edit(id) {
        if(typeof id !== 'string') return;
        this.valida();
        if(this.errors.length > 0) return;
        this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true })
    }

    buscaPorId = async function(id) {
        if(typeof id !== 'string') return;
        const contatos = await ContatoModel.findById(id);
        return contatos;
    }
    
    buscaContatos = async function() {
        const contatos = await ContatoModel.find()
        .sort({ criadoEm: -1})
        return contatos;
    }

    delete = async function(id) {
        if(typeof id !== 'string') return;
        const contato = await ContatoModel.findOneAndDelete( {_id: id} );
        return contato;
    }
}

module.exports = Contato;