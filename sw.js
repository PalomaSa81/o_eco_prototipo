importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// 1. Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDtMO8dbJWXcIdmhCAtvYdxKlntulcYqBI",
  projectId: "dahj-hub",
  messagingSenderId: "964532263352",
  appId: "1:964532263352:web:fe3d32318ed86be611d74d"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// 2. Forçar a atualização imediata do Service Worker
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Faz este SW virar o ativo imediatamente
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim()); // Assume o controle das abas abertas na hora
});

// 3. Processar a mensagem recebida (formato 'data' do GAS)
messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] Mensagem recebida:', payload);

  // Verificamos se os dados vieram no campo 'data' (estratégia anti-duplicata)
  if (payload.data) {
    const notificationTitle = payload.data.title || "O Eco!";
    const notificationOptions = {
      body: payload.data.body || "Nova atualização disponível",
      icon: 'logo-dahj.jpg', // Certifique-se que este arquivo está na raiz do GitHub
      badge: 'logo-dahj.jpg',
      tag: 'dahj-notificacao-unica', // Evita que apareçam várias notificações
      data: {
        url: 'https://dahj-uff.github.io/o-eco/'
      }
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
  }
});

// 4. Ação ao clicar na notificação (Abrir o site)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Se o site já estiver aberto, foca nele. Se não, abre nova aba.
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});
