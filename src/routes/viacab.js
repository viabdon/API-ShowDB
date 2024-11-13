import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// GET para /viacab
async function getViacab(request, reply) {
	const { date } = request.query; // Espera que a data seja passada como query string

	if (!date) {
		return reply.status(400).send({ error: 'Data é obrigatória.' });
	}

	try {
		const result = await prisma.viacab.findMany({
            select: {
                DATA: true,
                USU: true,
                BALSA: true,
                SEQG: true,
            },
			where: {
				DATA: new Date(date), // Converte data da query para Date
			},
			orderBy: [{ NDISP: 'asc' }, { DATA: 'asc' }, { HRCAD: 'asc' }],
			// include: {
			// 	balsa: {
			// 		select: {
			// 			DESCRICAO: true,
			// 		},
			// 	},
			// 	fiscal: {
			// 		select: {
			// 			NOME: true,
			// 		},
			// 	},
			// 	usu2: {
			// 		select: {
			// 			NOME: true,
			// 		},
			// 	},
			// },
		});



		// Formata os dados usando o método map()
		const formattedResults = result.map((item) => ({
			SEQG: item.SEQG,
			NDISP: item.NDISP,
			NUMERO: item.NUMERO,
			DATA: item.DATA,
			HIDA: item.HIDA,
			HVOLTA: item.HVOLTA,
			HRCAD: item.HRCAD,
			STATUS: item.STATUS,
			// XSTATUS:
			// 	item.STATUS === 'F'
			// 		? 'CONCLUÍDA'
			// 		: item.STATUS === 'C'
			// 		? 'CANCELADA'
			// 		: item.STATUS === 'A'
			// 		? 'ABERTA'
			// 		: 'DESCONHECIDA',
			BALSA: item.BALSA,
			XBALSA: item.balsa?.DESCRICAO,
			USU: item.USU,
			XUSU: item.usu2?.NOME,
			XFISCAL: item.fiscal?.NOME,
			FISCAL: item.FISCAL,
		}));

		reply.send(formattedResults); // Responde a requisição com os resultados formatados
	} catch (err) {
		console.error(err);
		reply.status(500).send({ error: 'Erro ao consultar dados.' });
	}
}

// Exportar a função que será registrada no Fastify
export default async function (fastify) {
	fastify.get('/viacab', getViacab);
}
