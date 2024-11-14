async function fetchVendas() {
	const date = document.getElementById('date').value;
	if (!date) {
		alert('POR FAVOR INSIRA UMA DATA!');
		return;
	}

	try {
		// Faz uma requisição GET ao servidor HTTP
		const response = await fetch(`http://127.0.0.1:3000/vendas?date=${date}`);
		const data = await response.json();
		console.log(response.json)

		// Limpa a tabela para mostrar os novos dados
		const tableBody = document.querySelector('#resultsTable tbody');
		tableBody.innerHTML = '';

		// Se a busca não encontrar nada, informa o usuário
		if (data.length === 0) {
			tableBody.innerHTML =
				'<tr><td colspan="8">Não foram encontrados resultados nessa data</td></tr>';
			return;
		}

		// Preenche as tabelas com os dados da pesquisa
		data.forEach((item) => {
			const row = document.createElement('tr');
			row.innerHTML = `
             	<td>${item.SEQG}</td>
                <td>${item.Num_Disp}</td>
                <td>${item.Numero}</td>
                <td>${printDate(item.Data)}</td>
                <td>${item.Situacao}</td>
                <td>${item.Inicio_Turno}</td>
                <td>${item.Fim_Turno}</td>
                <td>${item.Usuario}</td>
            `;
			tableBody.appendChild(row);
		});
	} catch (error) {
		console.error('Erro ao buscar data:', error);
		alert('Houve um erro ao buscar data. Tem certeza que inseriu a data corretamente?');
	}
}

// Função para formatar a data ("2024-02-10T00:00:00.000Z" -> "10/02/2024")
function printDate(dateString) {
	const date = new Date(dateString);
	return date.toLocaleDateString('pt-BR'); // "dd/MM/yyyy" format
}
