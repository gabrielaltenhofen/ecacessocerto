const database = firebase.database();
const dataContainer = document.querySelector('tbody');

var fetchedData = database.ref('acessoTag/');
fetchedData.on('value', (snapshot) => {
    var data = snapshot.val();
    var htmlData = '';

    for (var userKey in data) {
        var userData = data[userKey];
        for (var dayKey in userData) {
            var dayValue = userData[dayKey].entradaTag;
            htmlData += `
                <tr>
                    <td>${userKey}</td>
                    <td>${dayValue}</td>
                    <td>
                        <button class="delete-button" onclick="confirmDelete('${userKey}', '${dayKey}')">
                            <i class="fas fa-trash-alt"></i> Excluir
                        </button>
                    </td>
                </tr>
            `;
        }
    }

    dataContainer.innerHTML = htmlData;
});

function confirmDelete(userKey, dayKey) {
    if (confirm('Você realmente deseja excluir?')) {
        removeMess(userKey, dayKey);
    }
}

function removeMess(userKey, dayKey) {
    database.ref('acessoTag/' + userKey + '/' + dayKey).remove();
}

// Estilo para o botão de exclusão
const deleteButtons = document.querySelectorAll('.delete-button');
deleteButtons.forEach((button) => {
    button.style.backgroundColor = '#ff0000'; // Cor de fundo vermelha
    button.style.color = '#fff'; // Cor do texto branca
    button.style.border = 'none'; // Remove a borda
    button.style.padding = '10px'; // Aumenta o espaço interno
    button.style.cursor = 'pointer'; // Transforma o cursor em uma mão quando passar o mouse sobre o botão
});



