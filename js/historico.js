let totalHorasTrabalhadas = 0;


document.getElementById('consultar').addEventListener('click', function () {
  const funcionarioId = document.getElementById('funcionarioId').value;
  const ano = document.getElementById('ano').value;
  const mes = document.getElementById('mes').value;

  if (funcionarioId && ano && mes) {

    const url = `https://apiacessocerto.vercel.app/acessoTag/${funcionarioId}/${ano}/${mes}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        fetch(`https://apiacessocerto.vercel.app/usuarios/tag/${funcionarioId}`)
          .then(response => response.json())
          .then(funcionario => {
            if (funcionario) {
              const nomeFuncionario = funcionario.name;
              const nomeFuncionarioElement = document.getElementById('nomeFuncionario');
              nomeFuncionarioElement.textContent = `Colaborador: ${nomeFuncionario}`;
              exibirResultados(data, nomeFuncionario, ano, mes);
            } else {
              alert('Colaborador não encontrado.');
            }
          })
          .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
  } else {
    alert('Por favor, preencha todos os campos antes de consultar.');
  }
});

function preencherDadosDoDia(tableRow, dia, mes, ano) {
  tableRow.style.textAlign = 'center';
  tableRow.insertCell().textContent = `${dia + '/' + mes + '/' + ano}`;

  for (let i = 1; i <= 8; i++) {
    tableRow.insertCell().textContent = ''; // Adicione células em branco
  }

  tableRow.insertCell().textContent = ''; // Célula para horas trabalhadas
}

function exibirResultados(data, nomeFuncionario, ano, mes) {
  const funcionarioId = document.getElementById('funcionarioId').value;
  const resultadosDiv = document.getElementById('resultados');
  resultadosDiv.innerHTML = ''; // Limpa resultados anteriores

  if (data) {
    const table = document.createElement('table');
    table.classList.add('pdf-table');
    table.style.width = '100%';
    table.style.tableLayout = 'fixed';

    for (let dia = 1; dia <= new Date(ano, mes, 0).getDate(); dia++) {
      const diaString = dia < 10 ? '0' + dia : dia.toString();
      const batidasDia = data[diaString];
      const newRow = table.insertRow();
      newRow.style.textAlign = 'center';
      newRow.insertCell().textContent = diaString + '/' + mes + '/' + ano;

      // Calcule o dia da semana
      const dataAtual = new Date(ano, mes - 1, dia);
      const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      const diaDaSemana = diasDaSemana[dataAtual.getDay()];

      const diaDaSemanaCell = newRow.insertCell();
      diaDaSemanaCell.textContent = diaDaSemana;

      // Inicialize a variável totalHorasTrabalhadasNoDia
      let totalHorasTrabalhadasNoDia = 0;

      // Crie uma célula para cada horário do dia
      for (let i = 1; i <= 8; i++) {
        const chaveHorario = `entrada${i}`;
        if (batidasDia && batidasDia[chaveHorario]) {
          const horario = batidasDia[chaveHorario].data_hora;
          const cell = newRow.insertCell();
          cell.textContent = horario || "N/A";

          // Verifique se há justificativa dentro deste campo
          if (batidasDia[chaveHorario].justificativa) {
            const justificativa = batidasDia[chaveHorario].justificativa;
            cell.textContent += `\n* ${justificativa}`;
          }

          if (i % 2 === 0) {
            // Realize o cálculo para as horas trabalhadas no dia
            const horaEntrada = new Date(`1970-01-01T${batidasDia[`entrada${i - 1}`].data_hora}`);
            const horaSaida = new Date(`1970-01-01T${batidasDia[chaveHorario].data_hora}`);
            const diferencaHoras = (horaSaida - horaEntrada) / 1000 / 60 / 60;
            totalHorasTrabalhadasNoDia += diferencaHoras;
            // Atualize a variável totalHorasTrabalhadas no escopo global
            totalHorasTrabalhadas += diferencaHoras;
          }
        } else {
          newRow.insertCell().textContent = 'N/A'; // Se não houver batidas, exibe 'N/A'
        }
      }

      // Adicione as horas trabalhadas no dia à variável total
      totalHorasTrabalhadasNoDia = totalHorasTrabalhadasNoDia.toFixed(2);
      newRow.insertCell().textContent = totalHorasTrabalhadasNoDia;
    }

    // Determine o número de colunas na tabela
    const numColunas = table.rows[0].cells.length;
    const larguraCelula = (100 / numColunas) + '%';

    // Defina a largura igual para todas as células
    for (const row of table.rows) {
      for (const cell of row.cells) {
        cell.style.width = larguraCelula;
      }
    }

    resultadosDiv.appendChild(table);
  } else {
    resultadosDiv.textContent = 'Nenhum dado encontrado.';
  }
}

