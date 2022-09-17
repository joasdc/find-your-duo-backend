import express from 'express';
import cors from 'cors';
import appRouter from './routers/routes';

const app = express();

app.use(express.json());

// Cors
app.use(cors());

// Rotas
app.use('/', appRouter);

// inicia o servidor localhost:3333
app.listen(3333, () => console.log("Server started on port 3333"));

// Endpoint raiz
app.get('/', (req, res) => {
    return res.json({ message: 'Conected'})
})



