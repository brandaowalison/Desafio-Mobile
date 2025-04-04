const express = require('express');
const cors = require('cors');
const connectDB = require('./src/db/mongoose');
const livrosRouter = require('./src/routes/livro.routes')
const pedidosRouter = require('./src/routes/pedido.routes')

const app = express();
const port = 3000;

app.use(express.json());

app.use(cors());

connectDB();

app.use('/api/livro', livrosRouter);
app.use('/api/pedido', pedidosRouter);

try {
    app.listen(port, () => {
        console.log(`Server in running on http://localhost:${port}`);
    })
} catch(error) {
    console.error(`Error starting the server on http://localhost:${port}`, error);
}
