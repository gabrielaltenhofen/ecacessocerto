function gerarCodigo() {
    const codigoAleatorio = Math.floor(100000 + Math.random() * 900000);
    const codigoInput = document.getElementById("name");
    codigoInput.value = codigoAleatorio;

    // Envia uma solicitação GET para a API com o código gerado
    fetch(`https://apiacessocerto.vercel.app/atualizar-codigo/${codigoAleatorio}`, {
        method: 'GET'
    })
    .then(response => {
        if (response.ok) {
            console.log('API notificada sobre o novo código com sucesso.');
        } else {
            console.error('Falha ao notificar a API sobre o novo código.');
        }
    })
    .catch(error => {
        console.error(error);
    });
}
