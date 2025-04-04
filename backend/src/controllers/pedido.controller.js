const Pedido = require('../models/pedido');

const createPedido = async (req, res) => {
    try {
        const {order_date, status, items} = req.body;
        if (!items || items.length === 0 || !items.every(item => item.book)) {
            return res.status(400).json({ error: "Cada item do pedido deve conter um campo `book` válido." });
        }
        const total_amount = items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
        const pedido = new Pedido({
            order_date: order_date ,
            total_amount: total_amount,
            status: status,
            items: items
        })
        await pedido.save()
        res.status(201).json({message: 'Pedido adicionado com sucesso!', pedido: pedido});
    } catch (err) {
        console.error('Erro ao adicionar pedido:', err)
        res.status(500).json({error: 'Erro ao adicionar pedido.', details: err.message});
    }
};
const getPedidos = async (req, res) => {
    try{
        const pedidos = await Pedido.find()
        res.status(200).json(pedidos)
    } catch (err) {
        console.error('Erro ao procurar pedidos:', err);
        res.status(500).json({error: 'Erro ao procurar pedidos.', details: err.message});
    }
};

const getPedidoById = async (req, res) => {
    const {id} = req.params

    if(!id || id.trim() === "") {
        return res.status(400).json({message: `ID não fornecido na URL da requisição.`});
    }
    try {
        const pedido = await Pedido.findById(id);
        if (pedido) {
            res.status(200).json(pedido);
        } else {
            res.status(404).json({message: `Não foi encontrado nenhum pedido com essa id=${id}.`});
        }
    } catch (err) {
        console.error('Erro ao buscar pedido:', err);
        res.status(500).json({error: 'Erro ao buscar pedido.'});
    }
};

const updatePedido = async (req, res) => {
    const { id } = req.params;
    const { itemId, quantity, price, ...pedidoUpdates } = req.body;

    try {
        let updateQuery = {};

        if (Object.keys(pedidoUpdates).length > 0) {
            updateQuery.$set = pedidoUpdates;
        }

        if (itemId) {
            let updateItemsQuery = {};
            if (quantity !== undefined) updateItemsQuery["items.$.quantity"] = quantity;
            if (price !== undefined) updateItemsQuery["items.$.price"] = price;

            if (Object.keys(updateItemsQuery).length > 0) {
                updateQuery = { ...updateQuery, $set: { ...updateQuery.$set, ...updateItemsQuery } };
            }
        }

        if (!updateQuery.$set) {
            return res.status(400).json({ error: "Nenhuma atualização válida foi fornecida." });
        }

        const updatedPedido = await Pedido.findOneAndUpdate(
            itemId ? { _id: id, "items._id": itemId } : { _id: id },
            updateQuery,
            { new: true, runValidators: true }
        );

        if (!updatedPedido) {
            return res.status(404).json({
                message: `Pedido com id=${id} ${itemId ? `ou item com id=${itemId}` : ""} não encontrado.`,
            });
        }

        res.status(200).json({
            message: "Pedido atualizado com sucesso!",
            updatedPedido,
        });
    } catch (err) {
        console.error("Erro ao atualizar pedido:", err);
        res.status(500).json({ error: "Erro interno ao atualizar pedido." });
    }
};


const deletePedido = async (req, res) => {
    try {
        const deletedPedido = await Pedido.deleteMany()
        res.status(200).json({
            message: 'Todos os Pedido foram deletados com sucesso!',
            deletedCount: deletedPedido.deletedCount
        });
    } catch (err) {
        console.error('Erro ao deletar todos os pedidos.', err);
        res.status(500).json({error: 'Erro ao deletar todos os pedidos.'});
    }
};

const deletePedidoById = async (req, res) => {
    const {id} = req.params

    try {
        const deletedPedido = await Pedido.deleteOne({_id: id});

        if (deletedPedido.deletedCount === 0) {
            return res.status(404).json({message: `Nenhum pedido encontrado com essa id${id}.`});
        }
        res.status(200).json({message: `Pedido com ID=${id} foi deletado com sucesso!`});
    } catch (err) {
        console.error('Erro ao deletar pedido:', err);
        res.status(500).json({message: 'Erro ao deletar pedido.'})
    }
};

module.exports = {
    createPedido,
    getPedidos,
    getPedidoById,
    updatePedido,
    deletePedido,
    deletePedidoById,
};