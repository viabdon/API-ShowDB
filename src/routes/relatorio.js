import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// GET para a primeira tabela de relatório
async function getTopRelatorio(request) {
	const { dateStart, dateEnd } = request.query;

	try {
		// Executa a query SQL bruta
		const result = await prisma.$queryRaw`
      SELECT 
        VIACAB.DATA,
        USU.NOME AS NUSU, 
        TVEI.DESCRICAO AS VEICULO, 
        COUNT(VIAITE.ITEM) AS QTD, 
        SUM(VIAITE.TARIFA) AS TOTTARIFA, 
        SUM(VIAITE.VTOT) AS SOMAVTOT 
      FROM VIAITE
      INNER JOIN VIATIPO ON (VIATIPO.NUMERO = VIAITE.VIATIPO AND VIATIPO.SEQG = VIAITE.SEQG)
      INNER JOIN VIACAB ON (VIACAB.NUMERO = VIATIPO.VIAGEM AND VIACAB.SEQG = VIATIPO.SEQG)
      INNER JOIN USU ON (USU.CODIGO = VIACAB.USU)
      INNER JOIN TVEI ON (TVEI.CODIGO = VIAITE.TVEI)
      WHERE (VIAITE.STATUS = 'F' OR VIAITE.STATUS = 'B') 
        AND VIAITE.TVEI > 0
        AND VIACAB.DATA >= ${dateStart} AND VIACAB.DATA <= ${dateEnd}
      GROUP BY 
        VIACAB.DATA,
        USU.NOME, 
        TVEI.DESCRICAO, 
        VIAITE.TVEI
      ORDER BY 
        TVEI.DESCRICAO;
    `;

		// Mapeia os resultados num novo array para mostrá-los na tela
		const formattedTopResults = result.map((item) => ({
			Usuario: item.NUSU,
			Veiculo: item.VEICULO,
			Quantidade: Number(item.QTD),
			Tarifa: item.TOTTARIFA,
			ValorTotal: item.SOMAVTOT,
		}));

        // Retorna os resultados
        console.log(formattedTopResults);
		return formattedTopResults;
	} catch (err) {
		throw new Error(
			'Erro ao consultar dados do Relatório de cima: ' + err.message
		); 
	}
}

// GET para a segunda tabela de relatório
async function getBotRelatorio(request) {
	const { dateStart, dateEnd } = request.query;

	try {
		// Executa a query SQL bruta
		const result = await prisma.$queryRaw`
      SELECT 
        VIAITE.FPG, 
        VIACAB.DATA,
        FPG.DESCRICAO, 
        SUM(VIAITE.VTOT) AS SOMAVTOT, 
        SUM(VIAITE.Tarifa) AS TARIFA, 
        COUNT(VIAITE.VTOT) AS QTD 
      FROM VIAITE
      INNER JOIN VIATIPO ON 
        (VIATIPO.NUMERO = VIAITE.VIATIPO
        AND VIATIPO.SEQG = VIAITE.SEQG)
      INNER JOIN VIACAB ON
        (VIACAB.NUMERO = VIATIPO.VIAGEM
        AND VIACAB.SEQG = VIATIPO.SEQG)
      INNER JOIN FPG ON VIAITE.FPG = FPG.CODIGO
      WHERE 
        (VIAITE.STATUS = 'F' OR VIAITE.STATUS = 'B') AND VIAITE.TVEI > 0 	
        AND VIACAB.DATA >= ${dateStart} AND VIACAB.DATA <= ${dateEnd}
      GROUP BY
        VIACAB.DATA,
        VIAITE.FPG
      ORDER BY
        VIAITE.FPG,
        FPG.DESCRICAO;
    `;

		// Mapeia os resultados num novo array para mostrá-los na tela
		const formattedBotResults = result.map((item) => ({
			FormaPagamento: item.FPG,
			Descricao: item.DESCRICAO,
			Quantidade: Number(item.QTD),
			Tarifa: item.TARIFA,
			ValorTotal: item.SOMAVTOT,
		}));

        // Retorna os resultados
        console.log(formattedBotResults);
		return formattedBotResults; 
	} catch (err) {
		throw new Error(
			'Erro ao consultar dados do Relatório de baixo: ' + err.message
		); 
	}
}

export default async function (fastify) {
	fastify.get('/relatorio', async (request, reply) => {

		try {
			// Chama ambas as funções e aguarda os resultados
			const topResults = await getTopRelatorio(request);
			const botResults = await getBotRelatorio(request);

			// Retorna ambos os resultados como parte da resposta
			reply.send({
				topResults,
				botResults,
			});
		} catch (err) {
			// Se houver um erro, somente uma resposta será enviada
			reply.status(500).send({
				error: 'Erro ao processar os relatórios.',
				details: err.message,
			});
		}
	});
}