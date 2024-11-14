import fastify from 'fastify';  // Importa a função de criação do servidor
const app = fastify({ logger: true });  // Cria a instância do servidor Fastify

// Use import para carregar suas rotas
import vendasRoutes from './routes/vendas.js'; 

// Registrando a rota criada em ./routes/viacab.js
app.register(vendasRoutes);

// Inicia o servidor
const start = async () => {
  try {
    await app.listen({
      port: 3000
    });
    console.log('Servidor Fastify rodando na porta 3000');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();