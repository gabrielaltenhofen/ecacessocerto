firebase.initializeApp(firebaseConfig)

const database = firebase.database()

const submitBtn = document.getElementById('submitBtn');
submitBtn.addEventListener('click', sendData);

const cpfInput = document.getElementById('cpf');
cpfInput.addEventListener('input', formatAndValidateCPF);

const rgInput = document.getElementById('rg');
rgInput.addEventListener('input', formatAndValidateRG);

const telefoneInput = document.getElementById('telefone');
telefoneInput.addEventListener('input', formatPhone);

function formatPhone() {
    let value = telefoneInput.value.replace(/\D/g, '');

    if (value.length > 13) {
        value = value.slice(0, 13);
    }

    if (value.length >= 2) {
        // Adicione parênteses para o DDD
        value = `(${value.substring(0, 2)})${value.substring(2)}`;
    }
    telefoneInput.value = value;
}


function formatAndValidateRG() {
    let value = rgInput.value.replace(/\D/g, '');

    if (value.length > 10) {
        value = value.slice(0, 10);
    }

    rgInput.value = value;
}


function formatAndValidateCPF() {
    let value = cpfInput.value.replace(/\D/g, '');

    if (value.length > 11) {
        value = value.slice(0, 11);
    }

    if (value.length > 9) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
    } else if (value.length > 3) {
        value = value.replace(/(\d{3})(\d{3})/, '$1.$2');
    }

    cpfInput.value = value;
}

function sendData() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const tag = document.getElementById('tag').value;
    const cpfInput = document.getElementById('cpf');
    const cpf = cpfInput.value.replace(/\D/g, '');
    const cidade = document.getElementById('cidade').value;
    const status = document.getElementById('status').value;


    document.getElementById('tagError').textContent = '';
    document.getElementById('cpfError').textContent = '';

    const cpfRef = database.ref('usuarios/' + cpf);

    cpfRef.once('value').then(function(cpfSnapshot) {
        if (cpfSnapshot.exists()) {
            document.getElementById('cpfError').textContent = 'CPF já cadastrado. Por favor, insira um CPF único.';
        } else {
            // CPF não existe, pode prosseguir com a verificação da tag
            const tagRef = database.ref('usuarios').orderByChild('tag').equalTo(tag);

            tagRef.once('value').then(function(tagSnapshot) {
                if (tagSnapshot.exists()) {
                    document.getElementById('tagError').textContent = 'Tag já cadastrada. Por favor, escolha uma tag única.';
                } else {
                    // Tag não existe, pode prosseguir com o salvamento
                    const listRef = database.ref('usuarios/' + cpf);

                    listRef.set({
                        'name': name,
                        'email': email,
                        'cidade': cidade,
                        'tag': tag,
                        'cpf': cpf,
                        'status': status
                    }).then(() => {
                        // Limpe os campos após o cadastro bem-sucedido
                        document.getElementById('name').value = '';
                        document.getElementById('email').value = '';
                        document.getElementById('tag').value = '';
                        cpfInput.value = '';
                        document.getElementById('cidade').value = '';
                       document.getElementById('status').value = '';
                
                        alert('Cadastro criado com sucesso!');
                    }).catch((error) => {
                        alert('Erro ao salvar os dados: ', error);
                    });
    
                }
            });
        }
    });
}
