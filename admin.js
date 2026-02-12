// admin.js
// Página de administração - Audit Educa
// Integração com Firebase e workflow preparar, revisar, aprovar

// Firebase config (substitua pelos dados do seu projeto)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Inicialização Firebase
let firebaseApp, db, auth;

function initFirebase() {
  if (!window.firebase) {
    const script = document.createElement('script');
    script.src = "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
    script.onload = () => {
      const authScript = document.createElement('script');
      authScript.src = "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
      document.head.appendChild(authScript);
      const firestoreScript = document.createElement('script');
      firestoreScript.src = "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
      document.head.appendChild(firestoreScript);
      authScript.onload = firestoreScript.onload = setupFirebase;
    };
    document.head.appendChild(script);
  } else {
    setupFirebase();
  }
}

function setupFirebase() {
  firebaseApp = firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
  auth = firebase.auth();
}

// Login
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById('admin-login').style.display = 'none';
      document.getElementById('admin-workflow').style.display = 'block';
      loadContentList();
    })
    .catch(err => {
      document.getElementById('login-error').innerText = err.message;
      document.getElementById('login-error').style.display = 'block';
    });
});

// Logout
const logoutBtn = document.getElementById('logout-btn');
logoutBtn.addEventListener('click', function() {
  auth.signOut().then(() => {
    document.getElementById('admin-login').style.display = 'block';
    document.getElementById('admin-workflow').style.display = 'none';
  });
});

// Workflow
const prepareBtn = document.getElementById('prepare-btn');
const reviewBtn = document.getElementById('review-btn');
const approveBtn = document.getElementById('approve-btn');

prepareBtn.addEventListener('click', () => updateWorkflow('preparar'));
reviewBtn.addEventListener('click', () => updateWorkflow('revisar'));
approveBtn.addEventListener('click', () => updateWorkflow('aprovar'));

function updateWorkflow(status) {
  // Exemplo: atualizar status do conteúdo no Firestore
  // db.collection('conteudos').doc(id).update({status})
  alert('Workflow: ' + status);
}

function loadContentList() {
  // Exemplo: buscar conteúdos do Firestore
  // db.collection('conteudos').get().then(snapshot => { ... })
  document.getElementById('content-list').innerHTML = '<p>Lista de conteúdos (exemplo)</p>';
}

initFirebase();

// Git integração
const gitCommitBtn = document.getElementById('git-commit-btn');
const gitLogBtn = document.getElementById('git-log-btn');

gitCommitBtn.addEventListener('click', function() {
  // Exemplo: commit de todas políticas
  db.collection('politicas').get().then(snapshot => {
    const politicas = [];
    snapshot.forEach(doc => politicas.push(doc.data()));
    const mensagem = prompt('Mensagem do commit:', 'Atualização de políticas');
    if (mensagem) {
      gitCommit(politicas, mensagem);
    }
  });
});

gitLogBtn.addEventListener('click', function() {
  gitLog();
});

// Carregar funções git
const gitScript = document.createElement('script');
gitScript.src = 'admin-git.js';
document.head.appendChild(gitScript);

// Políticas de excelência
const policyIds = [
  'privacidade',
  'termos-de-uso',
  'notificacoes-legais',
  'politica-de-acessibilidade',
  // Adicione outros IDs conforme necessário
];

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
        lista.innerHTML += `<div><h3>${p.titulo}</h3><p>Status: ${p.status}</p><button onclick=\"editarPolitica('${p.id}')\">Editar</button></div>`;
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

// Carregar políticas ao acessar workflow
function loadContentList() {
  carregarPoliticas();
  carregarDataTests();
}

// Função para carregar e aprovar documentos da coleção data_tests
function carregarDataTests() {
  db.collection('data_tests').get()
    .then(snapshot => {
      const lista = document.getElementById('data-tests-list');
      if (!lista) return;
      lista.innerHTML = '';
      snapshot.forEach(doc => {
        const d = doc.data();
        lista.innerHTML += `<div><h4>${doc.id}</h4><p>Status: ${d.status}</p><button onclick="aprovarDataTest('${doc.id}')">Aprovar</button></div>`;
      });
    });
}

function aprovarDataTest(id) {
  db.collection('data_tests').doc(id).update({status: 'aprovado'})
    .then(() => {
      alert('Data Test aprovado!');
      carregarDataTests();
    })
    .catch(err => alert('Erro ao aprovar: ' + err.message));
}
