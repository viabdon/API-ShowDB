import fastify from 'fastify';  // Importa a função de criação do servidor
import fastifyCors from 'fastify-cors';  // Importa o CORS plugin

const app = fastify({ logger: true });  // Cria a instância do servidor Fastify

// Registra as portas de origem para permitir compartilhamento de recursos entre os servidores
app.register(fastifyCors, {
  origin: "*", 
  methods: ['GET'], // Solicitações HTTP permitidas
});

// Use import para carregar suas rotas
import vendasRoutes from './routes/vendas.js'; 
import relatorioRoutes from './routes/relatorio.js';

// Registrando a rota criada em ./routes/viacab.js
app.register(vendasRoutes);
app.register(relatorioRoutes);

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