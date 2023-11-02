function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "index.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}

function getCookie(nome) {
    var cookies = document.cookie.split(';'); 
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim(); 
        if (cookie.indexOf(nome + '=') === 0) {
            return cookie.substring(nome.length + 1, cookie.length);
        }
    }
    return null;
}

