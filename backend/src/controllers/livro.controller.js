const Livro = require("../models/livro")

const createLivro = async (req, res) => {
    try {
        const livro = new Livro({
            title: req.body.title,
            author:  req.body.author,
            publisher: req.body.publisher,
            publication_year:  req.body.publication_year,
            genre: req.body.genre,
            available:  req.body.available,
            posterUrl: req.body.posterUrl
        })
        await livro.save()
        res.status(201).json({message: 'Livro adicionado com sucesso!', livro: livro});
    } catch (err) {
        console.error('Erro ao adicionar livro:', err)
        res.status(500).json({error: 'Erro ao adicionar livro.', details: err.message});
    }
};

const getLivros = async (req, res) => {
    try{
        const livros = await Livro.find()
        res.status(200).json(livros)
    } catch (err) {
        console.error('Erro ao procurar livros:', err);
        res.status(500).json({error: 'Erro ao procurar livros.', details: err.message});
    }
};

const getLivroById = async (req, res) => {
    const {id} = req.params

    if(!id || id.trim() === "") {
        return res.status(400).json({message: `ID não fornecido na URL da requisição.`});
    }
    try {
        const livro = await Livro.findById(id);
        if (livro) {
            res.status(200).json(livro);
        } else {
            res.status(404).json({message: `Não foi encontrado nenhum livro com essa id=${id}.`});
        }
    } catch (err) {
        console.error('Erro ao buscar livro:', err);
        res.status(500).json({error: 'Erro ao buscar livro.'});
    }
}

const updateLivro = async (req, res) => {
    const {id} = req.params

    try {
        const updatedLivro = await Livro.findOneAndUpdate(
            {_id: id},
            req.body,
            {new: true}
        );
        if (!updatedLivro) {
            return res.status(404).json({message: `Não foi encontrado nenhum livro com id=${id}.`});
        }
        res.status(200).json({
            message: 'Livro atualizado com sucesso!',
            updatedLivro
        });
    } catch (err) {
        console.error('Erro ao atualizar livro:', err);
        res.status(500).json({error: 'Erro ao atualizar livro.'});
    }
}

const deleteLivros = async (req, res) => {
    try {
        const deletedLivros = await Livro.deleteMany()
        res.status(200).json({
            message: 'Todos os livros foram deletados com sucesso!',
            deletedCount: deletedLivros.deletedCount
        });
    } catch (err) {
        console.error('Erro ao deletar todos os livros.', err);
        res.status(500).json({error: 'Erro ao deletar todos os livros.'});
    }
}

const deleteLivroById = async (req, res) => {
    const {id} = req.params

    try {
        const deletedLivro = await Livro.deleteOne({_id: id});

        if (deletedLivro.deletedCount === 0) {
            return res.status(404).json({message: `Nenhum livro encontrado com essa id${id}.`});
        }
        res.status(200).json({message: `Livro com ID=${id} foi deletado com sucesso!`});
    } catch (err) {
        console.error('Erro ao deletar livro:', err);
        res.status(500).json({message: 'Erro ao deletar livro.'})
    }
}


module.exports = {
    createLivro,
    getLivros,
    getLivroById,
    updateLivro,
    deleteLivros,
    deleteLivroById,
}