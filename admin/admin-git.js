// admin-git.js
// Automação de git integrada à página admin

// Exemplo de chamada para backend (Node.js/Express ou Firebase Functions)
// O backend deve expor endpoints para git add, commit, push, log, etc.

function gitCommit(conteudo, mensagem) {
  fetch('/api/git/commit', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({conteudo, mensagem})
  })
  .then(res => res.json())
  .then(data => alert('Commit realizado: ' + data.status))
  .catch(err => alert('Erro no commit: ' + err.message));
}

function gitLog() {
  fetch('/api/git/log')
    .then(res => res.json())
    .then(data => {
      alert('Log:
' + data.log);
    });
}

// Exemplo de uso:
// gitCommit({id: 'privacidade', conteudo: '...'}, 'Atualização da política de privacidade');
// gitLog();
