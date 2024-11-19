async function fetchVendas(event) {
	const date = document.getElementById('date').value;
	if (!date) {
		alert('POR FAVOR INSIRA UMA DATA!');
		return;
	}

	try {
		let dateStart;
		let dateEnd;

		// Identifica se o usuário deseja apenas as vendas do dia, ou do mês inteiro e muda as datas conforme necessário
		if (event.target.id == 'monthButton') {
			dateStart = `${date.split('-')[0]}-${date.split('-')[1]}-01`;
			dateEnd = `${date.split('-')[0]}-${parseInt(date.split('-')[1]) + 1}-01`;
		} else if (event.target.id == 'dayButton') {
			dateStart = date;
			dateEnd = date;
		}

		// Faz a requisição GET ao servidor
		const response = await fetch(
			`http://127.0.0.1:3000/vendas?dateStart=${dateStart}&dateEnd=${dateEnd}`
		);

		// Garante que a resposta é OK antes de prosseguir
		if (!response.ok) {
			throw new Error('Failed to fetch data from server');
		}

		// Faz o parse do JSON
		const data = await response.json();

		// console.log(data); // Log para confirmar que os dados foram recebidos corretamente

		// Limpa a tabela para mostrar dados novos
		const tableBody = document.querySelector('#resultsTable tbody');
		tableBody.innerHTML = '';

		// Caso o JSON não tenha dados
		if (data.length === 0) {
			tableBody.innerHTML =
				'<tr><td colspan="8">Não foram encontrados resultados nessa data</td></tr>';
			return;
		}

		// Preenche a tabela com as informações recebidas
		data.forEach((item) => {
			const row = document.createElement('tr');
			row.innerHTML = `
                <td>${item.SEQG}</td>
                <td>${item.Num_Disp}</td>
                <td>${item.Numero}</td>
                <td>${item.Situacao}</td>
                <td>${item.Inicio}</td>
                <td>${item.Fim}</td>
                <td>${item.Usuario}</td>
				<td>${printDate(item.Data)}</td>
                <td>
                    <button onclick="gerarRelatorio(event)">GERAR RELATIRIO</button>
                </td>
            `;
			tableBody.appendChild(row);
		});
	} catch (error) {
		console.error('Erro ao buscar dados:', error);
		alert(
			'Houve um erro ao buscar dados. Tem certeza que inseriu a data corretamente?'
		);
	}
}

// Formatando a data para printar na tela
function printDate(dateString) {
	const date = dateString.split('-');
	return `${date[2][0] + date[2][1]}/${date[1]}/${date[0]}`; // Retorna a data no formato "dd/MM/yyyy"
}

function gerarRelatorio(event) {
	try {
	//	const dataCells = event.target.parentNode.parentNode.querySelectorAll('td');
	//	alert(`Gerando Relatório no SEQG ${dataCells[0].textContent}`);
	} catch (error) {
		console.log('Erro ao gerar relatório:', error);
	}
}
