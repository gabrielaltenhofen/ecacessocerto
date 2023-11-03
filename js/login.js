function onChangeEmail() {
    toggleButtonsDisable();
    toggleEmailErrors();
}

function onChangePassword() {
    toggleButtonsDisable();
    togglePasswordErrors();
}

function emailToPath(email) {
    // Substitua "." por "___" para criar um caminho válido
    return email.replace(".", "___");
}
function login() {
    showLoading();
    const userEmail = form.email().value;

    // Faça uma consulta no Realtime Database para obter o CPF com base no e-mail
    const usersRef = firebase.database().ref('usuarios');
    usersRef.orderByChild('email').equalTo(userEmail).once('value').then(snapshot => {
        hideLoading();

        if (snapshot.exists()) {
            // Obtenha o CPF do usuário
            const userCPF = Object.keys(snapshot.val())[0];

            // Faça login com o CPF
            firebase.auth().signInWithEmailAndPassword(userEmail, form.password().value).then(response => {
                if (response) {
                    if (response.user._delegate.email === userEmail) {
                        // Redireciona o usuário com o CPF correspondente
                        document.cookie = `userName=${userEmail}`;
                        if (userCPF) {
                            const userData = snapshot.val()[userCPF];
                            if (userData.nivelAcesso === 'admin') {
                                // Redireciona o usuário para o menu.html
                                window.location.href = "menu.html";
                            } else {
                                // Redireciona o usuário para o home.html
                                window.location.href = "home.html";
                            }
                        } else {
                            alert('Usuário não encontrado no banco de dados.');
                        }
                    }
                }
            }).catch(error => {
                alert(getErrorMessage(error));
            });
        } else {
            alert('Usuário não encontrado no banco de dados.');
        }
    }).catch(error => {
        hideLoading();
        alert('Erro ao buscar informações do usuário: ' + error.message);
    });
}



function getErrorMessage(error) {
    if (error.code == "auth/user-not-found") {
        return "Usuário não encontrado";
    }
    if (error.code == "auth/wrong-password") {
        return "Senha inválida";
    }
    if (error.code == "auth/invalid-login-credentials") {
        return "Email ou senha inválidos!";
    }
    if (error.code == "auth/invalid-email") {
        return "Email inválido!";
    }
    return error.message;
}


function toggleEmailErrors() {
    const email = form.email().value;
    form.emailRequiredError().style.display = email ? "none" : "block";

    form.emailInvalidError().style.display = validateEmail(email) ? "none" : "block";
}

function togglePasswordErrors() {
    const password = form.password().value;
    form.passwordRequiredError().style.display = password ? "none" : "block";
}

function toggleButtonsDisable() {
    const emailValid = isEmailValid();
    form.recoverPasswordButton().disabled = !emailValid;

    const passwordValid = isPasswordValid();
    form.loginButton().disabled = !emailValid || !passwordValid;
}

function isEmailValid() {
    const email = form.email().value;
    if (!email) {
        return false;
    }
    return validateEmail(email);
}

function isPasswordValid() {
    return form.password().value ? true : false;
}

function recoverPassword() {
    showLoading();
    firebase.auth().sendPasswordResetEmail(form.email().value).then(() => {
        hideLoading();
        alert('Email enviado com sucesso');
    }).catch(error => {
        hideLoading();
        alert(getErrorMessage(error));
    });
}

const form = {
    email: () => document.getElementById("email"),
    emailInvalidError: () => document.getElementById("email-invalid-error"),
    emailRequiredError: () => document.getElementById("email-required-error"),
    loginButton: () => document.getElementById("login-button"),
    password: () => document.getElementById("password"),
    passwordRequiredError: () => document.getElementById("password-required-error"),
    recoverPasswordButton: () => document.getElementById("recover-password-button"),
} 