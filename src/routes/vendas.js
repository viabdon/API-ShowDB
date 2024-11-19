import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// GET para vendas
async function getVendas(request, reply) {
	const { dateStart, dateEnd } = request.query; // Esperando um período de datas como query paramter

	if (!dateStart || !dateEnd) {
		return reply.status(400).send({ error: 'Preencha ambos os campos de data!' });
	}

	try {
		// SQL Query
		const result = await prisma.$queryRaw`
        SELECT 
          VIACAB.SEQG, 
          VIACAB.NDISP, 
          VIACAB.NUMERO, 
          VIACAB.DATA, 
          VIACAB.HIDA, 
          VIACAB.HVOLTA, 
          VIACAB.HRCAD, 
          VIACAB.STATUS,
          CASE VIACAB.STATUS
            WHEN 'F' THEN 'CONCLUÍDA'
            WHEN 'C' THEN 'CANCELADA'
            WHEN 'A' THEN 'ABERTA'
          END XSTATUS,
          VIACAB.BALSA,
          BALSA.DESCRICAO XBALSA,
          VIACAB.USU,
          USU2.NOME XUSU,
          USU.NOME XFISCAL,
          VIACAB.FISCAL 
        FROM VIACAB
        INNER JOIN BALSA ON VIACAB.BALSA = BALSA.CODIGO
        LEFT JOIN USU ON VIACAB.FISCAL = USU.CODIGO
        INNER JOIN USU USU2 ON VIACAB.USU = USU2.CODIGO
        WHERE VIACAB.DATA >= ${dateStart} AND VIACAB.DATA <= ${dateEnd} 
        ORDER BY VIACAB.NDISP, VIACAB.DATA, VIACAB.HRCAD;
      `;

		// Mapeia os resultados necessários da Query
		const formattedResults = result.map((item) => ({
			Data: item.DATA,
			Inicio: item.HIDA,
			Fim: item.HVOLTA,
			Usuario: item.XUSU,
			Num_Disp: item.NDISP,
			Numero: item.NUMERO,
			Situacao: item.XSTATUS,
			SEQG: item.SEQG,
		}));

		// Responde com os dados formatados
		reply.send(formattedResults);
	} catch (err) {
		console.error('Error executing query:', err);
		reply
			.status(500)
			.send({ error: 'Erro ao consultar dados.', details: err.message });
	}
}

export default async function (fastify) {
	fastify.get('/vendas', getVendas);
}
