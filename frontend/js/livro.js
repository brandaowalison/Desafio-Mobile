document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:3000/api/livro'; // Atualize conforme necessário
    const livroModal = document.getElementById('livroModal');
    const livroForm = document.getElementById('livroForm');
    const addLivroBtn = document.getElementById('addLivroBtn');
    const modalTitleLivro = document.getElementById('modalTitleLivro');
    let editLivroId = null;

    // Função para carregar livros
    const loadLivros = async () => {
        try {
            const response = await fetch(apiUrl);
            const livros = await response.json();
            const tableBody = document.querySelector('#livroTable tbody');
            tableBody.innerHTML = '';

            livros.forEach(livro => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${livro.title}</td>
                    <td>${livro.author}</td>
                    <td>${livro.publisher}</td>
                    <td>${livro.publication_year}</td>
                    <td>${livro.genre || 'N/A'}</td>
                    <td>${livro.available ? 'Sim' : 'Não'}</td>
                    <td>
                        <button class="editLivroBtn" data-id="${livro._id}">Editar</button>
                        <button class="deleteLivroBtn" data-id="${livro._id}">Deletar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Eventos para editar e deletar livros
            document.querySelectorAll('.editLivroBtn').forEach(button => {
                button.addEventListener('click', (e) => openEditLivroModal(e.target.dataset.id));
            });

            document.querySelectorAll('.deleteLivroBtn').forEach(button => {
                button.addEventListener('click', (e) => deleteLivro(e.target.dataset.id));
            });
        } catch (error) {
            console.error('Erro ao carregar livros:', error);
        }
    };

    // Adicionar novo livro
    const addLivro = async (livro) => {
        try {
            await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(livro)
            });
            loadLivros();
        } catch (error) {
            console.error('Erro ao adicionar livro:', error);
        }
    };

    // Atualizar livro
    const updateLivro = async (id, livro) => {
        try {
            await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(livro)
            });
            loadLivros();
        } catch (error) {
            console.error('Erro ao atualizar livro:', error);
        }
    };

    // Deletar livro
    const deleteLivro = async (id) => {
        try {
            if (confirm('Tem certeza que deseja excluir este livro?')) {
                await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
                loadLivros();
            }
        } catch (error) {
            console.error('Erro ao deletar livro:', error);
        }
    };

    // Abrir modal para edição
    const openEditLivroModal = async (id) => {
        try {
            editLivroId = id;
            modalTitleLivro.innerText = 'Editar Livro';

            const response = await fetch(`${apiUrl}/${id}`);
            const livro = await response.json();

            document.getElementById('title').value = livro.title;
            document.getElementById('author').value = livro.author;
            document.getElementById('publisher').value = livro.publisher;
            document.getElementById('publication_year').value = livro.publication_year;
            document.getElementById('genre').value = livro.genre || '';
            document.getElementById('available').value = livro.available.toString();
            document.getElementById('posterUrl').value = livro.posterUrl || '';

            livroModal.style.display = 'block';
        } catch (error) {
            console.error('Erro ao carregar dados do livro:', error);
        }
    };

    // Abrir modal para adicionar livro
    const openAddLivroModal = () => {
        editLivroId = null;
        modalTitleLivro.innerText = 'Adicionar Livro';
        livroForm.reset();
        livroModal.style.display = 'block';
    };

    // Fechar modal
    document.querySelector('.close').addEventListener('click', () => {
        livroModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === livroModal) {
            livroModal.style.display = 'none';
        }
    });

    // Submissão do formulário
    livroForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const livroData = {
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            publisher: document.getElementById('publisher').value,
            publication_year: parseInt(document.getElementById('publication_year').value),
            genre: document.getElementById('genre').value,
            available: document.getElementById('available').value === 'true',
            posterUrl: document.getElementById('posterUrl').value
        };

        try {
            if (editLivroId) {
                await updateLivro(editLivroId, livroData);
            } else {
                await addLivro(livroData);
            }

            livroModal.style.display = 'none';
            loadLivros();
        } catch (error) {
            console.error('Erro ao salvar livro:', error);
        }
    });

    addLivroBtn.addEventListener('click', openAddLivroModal);
    loadLivros();
});
