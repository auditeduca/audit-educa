// admin-policies.js
// Gerenciamento de políticas no Firebase

// Exemplo de estrutura de política
/*
{
  id: "privacidade",
  titulo: "Política de Privacidade",
  conteudo: "Texto completo da política...",
  ultimaAtualizacao: "2026-02-12",
  status: "preparar|revisar|aprovar"
}
*/

function salvarPolitica(politica) {
  db.collection('politicas').doc(politica.id).set(politica)
    .then(() => alert('Política salva com sucesso!'))
    .catch(err => alert('Erro ao salvar: ' + err.message));
}

function carregarPoliticas() {
  db.collection('politicas').get()
    .then(snapshot => {
      const lista = document.getElementById('content-list');
      lista.innerHTML = '';
      snapshot.forEach(doc => {
        const p = doc.data();
        lista.innerHTML += `<div><h3>${p.titulo}</h3><p>Status: ${p.status}</p><button onclick="editarPolitica('${p.id}')">Editar</button></div>`;
      });
    });
}

function editarPolitica(id) {
  db.collection('politicas').doc(id).get()
    .then(doc => {
      if (doc.exists) {
        const p = doc.data();
        // Exibir modal ou formulário para edição
        alert('Editar: ' + p.titulo);
      }
    });
}

// Exemplo de uso:
// salvarPolitica({id: 'privacidade', titulo: 'Política de Privacidade', conteudo: '...', ultimaAtualizacao: '2026-02-12', status: 'preparar'});
// carregarPoliticas();
