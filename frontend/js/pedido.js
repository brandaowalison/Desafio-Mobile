document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:3000/api/pedido';
    const pedidoModal = document.getElementById('pedidoModal');
    const orderForm = document.getElementById('orderForm');
    const addPedidoBtn = document.getElementById('addPedidoBtn');
    const modalTitle = document.getElementById('modalTitle');
    let editPedidoId = null;

    const loadPedidos = async () => {
        try {
            const response = await fetch(apiUrl);
            const pedidos = await response.json();
            const tableBody = document.querySelector('#pedidosTable tbody');
            tableBody.innerHTML = '';

            pedidos.forEach(pedido => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${new Date(pedido.order_date).toLocaleDateString()}</td>
                    <td>R$ ${pedido.total_amount.toFixed(2)}</td>
                    <td>${pedido.status}</td>
                    <td>${pedido.items.map(item => `${item.book} (Qtd: ${item.quantity})`).join(', ')}</td>
                    <td>
                        <button class="editPedidoBtn" data-id="${pedido._id}">Editar</button>
                        <button class="deletePedidoBtn" data-id="${pedido._id}">Deletar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            document.querySelectorAll('.editPedidoBtn').forEach(button => {
                button.addEventListener('click', (e) => openEditPedidoModal(e.target.dataset.id));
            });

            document.querySelectorAll('.deletePedidoBtn').forEach(button => {
                button.addEventListener('click', (e) => deletePedido(e.target.dataset.id));
            });
        } catch (error) {
            console.error('Erro ao carregar pedidos:', error);
        }
    };

    const addPedido = async (pedido) => {
        try {
            await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pedido)
            });
            loadPedidos();
        } catch (error) {
            console.error('Erro ao adicionar pedido:', error);
        }
    };

    const updatePedido = async (id, pedido) => {
        try {
            await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pedido)
            });
            loadPedidos();
        } catch (error) {
            console.error('Erro ao atualizar pedido:', error);
        }
    };

    const deletePedido = async (id) => {
        try {
            await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
            loadPedidos();
        } catch (error) {
            console.error('Erro ao deletar pedido:', error);
        }
    };

    const openEditPedidoModal = async (id) => {
        editPedidoId = id;
        modalTitle.innerText = 'Editar Pedido';

        try {
            const response = await fetch(`${apiUrl}/${id}`);
            const pedido = await response.json();

            document.getElementById('orderDate').value = pedido.order_date.split('T')[0];
            document.getElementById('totalAmount').value = pedido.total_amount;
            document.getElementById('status').value = pedido.status;
            document.getElementById('items').value = JSON.stringify(pedido.items, null, 2);

            pedidoModal.style.display = 'block';
        } catch (error) {
            console.error('Erro ao carregar pedido para edição:', error);
        }
    };

    const openAddPedidoModal = () => {
        editPedidoId = null;
        modalTitle.innerText = 'Adicionar Pedido';
        orderForm.reset();
        pedidoModal.style.display = 'block';
    };

    document.querySelector('.close').addEventListener('click', () => {
        pedidoModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === pedidoModal) {
            pedidoModal.style.display = 'none';
        }
    });

    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        let items;
        try {
            items = JSON.parse(document.getElementById('items').value);
            if (!Array.isArray(items)) throw new Error();
        } catch {
            alert('Erro: O campo de itens deve conter um JSON válido com um array de objetos.');
            return;
        }

        const pedidoData = {
            order_date: document.getElementById('orderDate').value,
            total_amount: parseFloat(document.getElementById('totalAmount').value),
            status: document.getElementById('status').value,
            items: items
        };

        if (editPedidoId) {
            await updatePedido(editPedidoId, pedidoData);
        } else {
            await addPedido(pedidoData);
        }

        pedidoModal.style.display = 'none';
        loadPedidos();
    });

    addPedidoBtn.addEventListener('click', openAddPedidoModal);
    loadPedidos();
});
