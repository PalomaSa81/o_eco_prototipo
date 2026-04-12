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

// 2. Comandos de ativação imediata (evita cache de versão antiga)
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => clients.claim());

// 3. OUVINTE NATIVO DE PUSH (O Matador de Sininho)
self.addEventListener('push', function(event) {
  console.log('[sw.js] Push recebido!');
  
  let payload = {
    title: "Novo no O Eco!",
    body: "Confira a nova matéria publicada.",
    url: "https://dahj-uff.github.io/o-eco/"
  };

  if (event.data) {
    try {
      const json = event.data.json();
      // Captura os dados que você configurou no GAS
      const d = json.data || json;
      payload.title = d.title || payload.title;
      payload.body = d.body || payload.body;
      payload.url = d.url || payload.url;
    } catch (e) {
      console.error("Erro ao ler JSON do push", e);
    }
  }

  const options = {
    body: payload.body,
    icon: 'logo-dahj.jpg',
    badge: 'logo-dahj.jpg',
    tag: 'dahj-notificacao-unica', // Garante que só apareça UMA
    renotify: true,
    data: { url: payload.url }
  };

  // O pulo do gato: avisa ao Android para esperar a notificação ser montada
  event.waitUntil(self.registration.showNotification(payload.title, options));
});

// 4. Ação ao clicar na notificação
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
