importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDtMO8dbJWXcIdmhCAtvYdxKlntulcYqBI",
  projectId: "dahj-hub",
  messagingSenderId: "964532263352",
  appId: "1:964532263352:web:fe3d32318ed86be611d74d"
};

firebase.initializeApp(firebaseConfig);

// Força o SW a atualizar na hora
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => clients.claim());

// O QUE RESOLVE O SININHO: Ouvinte de Push nativo
self.addEventListener('push', function(event) {
  let data = {};
  if (event.data) {
    try {
      // No FCM V1, o JSON vem com um objeto 'data' dentro
      const msg = event.data.json();
      data = msg.data || msg; 
    } catch (e) {
      console.error("Erro ao ler JSON", e);
    }
  }

  const title = data.title || "Novo no O Eco!";
  const options = {
    body: data.body || "Confira a nova matéria publicada.",
    icon: 'logo-dahj.jpg',
    badge: 'logo-dahj.jpg',
    tag: 'dahj-notificacao-unica',
    data: { url: 'https://dahj-uff.github.io/o-eco/' }
  };

  // OBRIGATÓRIO: event.waitUntil garante que a notificação apareça 
  // antes do Android desistir e mostrar o sininho genérico
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
