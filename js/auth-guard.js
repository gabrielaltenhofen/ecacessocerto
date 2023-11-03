firebase.auth().onAuthStateChanged(user => {
    if (user) {
        const userEmail = user.email;
        
        isUserAdmin(userEmail).then(isAdmin => {
            if (isAdmin) {
                // Usuário é um administrador, permita o acesso a páginas de admin
                if (window.location.pathname === "/menu.html" || 
                    window.location.pathname === "/cadastro.html" ||
                    window.location.pathname === "/users.html" ||
                    window.location.pathname === "/historico.html" ||
                    window.location.pathname === "/gerarcodigo.html") {
                    // O usuário pode acessar esta página
                } else {
                    // Redirecione para uma página de acesso negado
                    redirectToLoginPage();
                }
            } else {
                if (window.location.pathname === "/home.html" || window.location.pathname === "/codigouser.html") {
                    // O usuário pode acessar estas páginas
                } else {
                    // Redirecione para uma página de acesso negado
                    redirectToLoginPage();
                }
            }
        });
    } else {
        // O usuário não está autenticado, redirecione para a página de login
        redirectToLoginPage();
    }
});


function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}

// Função para verificar se o usuário é um administrador
function isUserAdmin(userEmail) {
    const usersRef = firebase.database().ref('usuarios');
    return usersRef.orderByChild('email').equalTo(userEmail).once('value').then(snapshot => {
        if (snapshot.exists()) {
            const userCPF = Object.keys(snapshot.val())[0];
            if (userCPF) {
                const userData = snapshot.val()[userCPF];
                return userData.nivelAcesso === 'admin';
            }
        }
        return false;
    });
}

// Função para redirecionar o usuário para a página de login se não estiver autenticado
function redirectToLoginPage() {
    window.location.href = "index.html";
}
