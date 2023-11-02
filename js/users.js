document.addEventListener("DOMContentLoaded", function () {
    const funcionariosTableBody = document.getElementById("funcionariosTableBody");
    const filtrarButton = document.getElementById("filtrarButton");

    const modalContainer = document.createElement("div");
    modalContainer.classList.add("modal-container");
    modalContainer.style.display = "none"; // Comece com o modal oculto
    document.body.appendChild(modalContainer);

    // Função para exibir todos os funcionários com IDs
    function exibirTodosFuncionariosComID() {
        funcionariosTableBody.innerHTML = ""; // Limpa a tabela antes de preenchê-la

        const ref = firebase.database().ref("usuarios");
        ref.once("value", (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const funcionario = childSnapshot.val();
                const funcionarioId = childSnapshot.key;

                // Verifique o status do funcionário e defina a classe com base nele
                let statusClass = "";
                if (funcionario.status === "Inativo") {
                    statusClass = "Inativo";
                } else if (funcionario.status === "Ativo") {
                    statusClass = "Ativo";
                }

                funcionariosTableBody.innerHTML += `
                    <tr>
                        <td>${funcionario.name}</td>
                        <td>${funcionario.email}</td>
                        <td>${funcionario.tag}</td>
                        <td>${funcionario.cpf}</td>
                        <td>${funcionario.cidade}</td>
                        <td class="${statusClass}">${funcionario.status}</td>
                        <td>
                            <button class="editar-button" data-id="${funcionarioId}">
                                <i class="fas fa-pencil-alt"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
        });
    }



    // Função para exibir todos os dados de um funcionário por nome
    function exibirFuncionarioPorNome(nome) {
        funcionariosTableBody.innerHTML = ""; // Limpa a tabela antes de preenchê-la

        const ref = firebase.database().ref("usuarios");
        ref.once("value", (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const funcionario = childSnapshot.val();
                const funcionarioId = childSnapshot.key;

                let statusClass = "";
                if (funcionario.status === "Inativo") {
                    statusClass = "Inativo";
                } else if (funcionario.status === "Ativo") {
                    statusClass = "Ativo";
                }


                if (funcionario.name.toLowerCase().includes(nome.toLowerCase())) {
                    funcionariosTableBodyfiltro.innerHTML += `
                    <tr>
                    <td>${funcionario.name}</td>
                    <td>${funcionario.email}</td>
                    <td>${funcionario.tag}</td>
                    <td>${funcionario.cpf}</td>
                    <td>${funcionario.cidade}</td>
                    <td class="${statusClass}">${funcionario.status}</td>
                    <td>
                        <button class="editar-button" data-id="${funcionarioId}">
                            <i class="fas fa-pencil-alt"></i>
                        </button>
                    </td>
                </tr>
                `;
                }
            });
        });
    }

    // Chama a função para exibir todos os funcionários com IDs quando a página carregar
    exibirTodosFuncionariosComID();


    // Lidar com o botão "Filtrar"
    filtrarButton.addEventListener("click", () => {
        const nameFilter = document.getElementById("nameFilter").value;
        exibirFuncionarioPorNome(nameFilter);
        exibirTodosHeader.style.display = "none";
        filtrarHeader.style.display = "table-row";
        searchHeader.style.display = "none";
        ajustarColunas(); // Adicione esta linha para ajustar as colunas    
    });

    function editarFuncionario(funcionarioId) {
        const ref = firebase.database().ref("usuarios/" + funcionarioId);
        ref.once("value", (snapshot) => {
            const funcionario = snapshot.val();
    
            // Mostre o modal
            modalContainer.innerHTML = `
                <div class="content">
                    <h1 class="centralize">Editar Funcionário</h1>
                    <p>
                        <label for="nomeInput">Nome:</label>
                    </p>
                    <p>
                        <input type="text" id="nomeInput" value="${funcionario.name}">
                    </p>
                    <p>
                        <label for="emailInput">Email:</label>
                    </p>
                    <p>
                        <input type="text" id="emailInput" value="${funcionario.email}">
                    </p>

        
                    <p>
                        <label for="cidadeInput">Cidade:</label>
                    </p>
                    <p>
                        <input type="text" id="cidadeInput" value="${funcionario.cidade}">
                    </p>
                    <p>
                        <label for="tagInput">Tag:</label>
                    </p>
                    <p>
                        <input type="text" id="tagInput" value="${funcionario.tag}">
                    </p>
                    <p>
                        <label for="statusInput">Status:</label>
                    </p>
                    <p>
                        <select class="escolha" id="status" required>
                            <option value="Ativo" ${funcionario.status === "Ativo" ? "selected" : ""}>Ativo</option>
                            <option value="Inativo" ${funcionario.status === "Inativo" ? "selected" : ""}>Inativo</option>
                        </select>
                    </p>
              
                    <button id="salvarEdicaoButton" style="width: 100%;">Salvar</button>
                </div>
            `;
    
            modalContainer.style.display = "block";
    
            // Lógica de atualização do funcionário
            const salvarEdicaoButton = document.getElementById("salvarEdicaoButton");
            salvarEdicaoButton.addEventListener("click", () => {
                const novoNome = document.getElementById("nomeInput").value;
                const novoEmail = document.getElementById("emailInput").value;
                const novaCidade = document.getElementById("cidadeInput").value;
                const novaTag = document.getElementById("tagInput").value;
                const novoStatus = document.getElementById("status").value;
    
                // Atualize o funcionário com os novos valores
                const novoFuncionario = {
                    name: novoNome,
                    email: novoEmail,
                    tag: novaTag,
                    cidade: novaCidade,
                    status: novoStatus,
                };
    
                ref.update(novoFuncionario);
    
                modalContainer.style.display = "none";
                // Atualize a tabela
                exibirTodosFuncionariosComID();

                location.host();
            });
        });
    }
    

    // Adicione eventos de clique para os botões "Editar" e "Excluir"
    funcionariosTableBody.addEventListener("click", (event) => {
        const target = event.target;
        if (target.classList.contains("editar-button")) {
            const funcionarioId = target.getAttribute("data-id");
            editarFuncionario(funcionarioId);
        } else if (target.classList.contains("excluir-button")) {
            const funcionarioId = target.getAttribute("data-id");
            excluirFuncionario(funcionarioId);
        }
    });

    funcionariosTableBodyfiltro.addEventListener("click", (event) => {
        const target = event.target;
        if (target.classList.contains("editar-button")) {
            const funcionarioId = target.getAttribute("data-id");
            editarFuncionario(funcionarioId);
        } else if (target.classList.contains("excluir-button")) {
            const funcionarioId = target.getAttribute("data-id");
            excluirFuncionario(funcionarioId);
        }
    });

    modalContainer.addEventListener("click", (event) => {
        if (event.target.id === "salvarEdicaoButton") {
            modalContainer.style.display = "none";
        }
    });
});
// Adicione um evento de clique ao botão "Imprimir"
document.getElementById('imprimir').addEventListener('click', () => {
    // Obtenha o nome do funcionário pesquisado
    const nameFilter = document.getElementById("nameFilter").value.toLowerCase();

    // Consulte o banco de dados Firebase para encontrar o funcionário com o nome pesquisado
    const ref = firebase.database().ref("funcionario");
    ref.once("value", (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const funcionario = childSnapshot.val();
            if (funcionario.name.toLowerCase() === nameFilter) {

                // Encontrou o funcionário com o nome pesquisado, agora você pode imprimir os dados
                imprimirFormularioParaEditar(funcionario);
                return; // Saia do loop, pois já encontrou o funcionário
            }
        });
    });
});

function imprimirFormularioParaEditar(funcionario) {
    // Verifique se o funcionário foi passado como argumento
    if (!funcionario) {
        alert("Funcionário não definido.");
        return;
    }

    // URL da página de impressão
    var urlDaPaginaDeImpressao = "gerarpdf/userspdf.html";

    // Codifique os dados do funcionário em um formato que pode ser passado na URL
    var dadosDoFuncionario = encodeURIComponent(JSON.stringify(funcionario));

    // Combine o URL com os parâmetros dos dados do funcionário
    var urlComParametros = urlDaPaginaDeImpressao + "?funcionario=" + dadosDoFuncionario;

    // Abra a nova janela para a página de impressão
    var janelaDeImpressao = window.open(urlComParametros, 'tecnoPontoImpressao', 'width=600,height=600');


    setTimeout(function () {
        janelaDeImpressao.print();
        janelaDeImpressao.close();
    }, 1000);
}

// Adicione um evento de clique ao botão "Imprimir Todos"
document.getElementById('imprimirTodos').addEventListener('click', () => {
    // Consulte o banco de dados Firebase para obter todos os funcionários
    const ref = firebase.database().ref("funcionario");
    ref.once("value", (snapshot) => {
        const funcionarios = [];
        snapshot.forEach((childSnapshot) => {
            const funcionario = childSnapshot.val();
            funcionarios.push(funcionario);
        });

        // Verifique se existem funcionários para imprimir
        if (funcionarios.length > 0) {
            imprimirTodosFuncionarios(funcionarios);
        } else {
            alert("Nenhum funcionário encontrado para imprimir.");
        }
    });
});

function imprimirTodosFuncionarios(funcionarios) {
    // Verifique se há funcionários a serem impressos
    if (funcionarios.length === 0) {
        alert("Nenhum funcionário encontrado para imprimir.");
        return;
    }

    // URL da página de impressão em lote
    var urlDaPaginaDeImpressao = "gerarpdf/imprimirtodos.html";

    // Codifique os dados dos funcionários em um formato que pode ser passado na URL
    var dadosDosFuncionarios = encodeURIComponent(JSON.stringify(funcionarios));

    // Combine o URL com os parâmetros dos dados dos funcionários
    var urlComParametros = urlDaPaginaDeImpressao + "?funcionarios=" + dadosDosFuncionarios;

    // Abra a nova janela para a página de impressão em lote
    var janelaDeImpressao = window.open(urlComParametros, 'tecnoPontoImpressao', 'width=800,height=600');

    setTimeout(function () {
        janelaDeImpressao.print();
        janelaDeImpressao.close();
    }, 1000);
}










