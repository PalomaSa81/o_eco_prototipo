importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDtMO8dbJWXcIdmhCAtvYdxKlntulcYqBI",
  projectId: "dahj-hub",
  messagingSenderId: "964532263352",
  appId: "1:964532263352:web:fe3d32318ed86be611d74d"
};

firebase.initializeApp(firebaseConfig);

// 1. Forçar atualização imediata
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => clients.claim());

// 2. O SEGREDO: Ouvinte nativo de Push (Mais rápido que o do Firebase)
self.addEventListener('push', function(event) {
  console.log('[sw.js] Push recebido!');
  
  let data = {};
  if (event.data) {
    try {
      // O FCM V1 entrega os dados dentro de um objeto 'data'
      const payload = event.data.json();
      data = payload.data || payload; 
    } catch (e) {
      console.error("Erro ao ler JSON do push", e);
    }
  }

  const title = data.title || "Novo no O Eco!";
  const options = {
    body: data.body || "Confira as novidades no portal.",
    icon: 'logo-dahj.jpg',
    badge: 'logo-dahj.jpg',
    tag: 'dahj-notificacao-unica',
    renotify: true, // Faz o celular vibrar de novo se chegar outra
    data: {
      url: 'https://dahj-uff.github.io/o-eco/'
    }
  };

  // Aqui dizemos para o navegador: "Não mostre o sininho genérico, use a MINHA notificação"
  event.waitUntil(self.registration.showNotification(title, options));
});

// 3. Ação de clique
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url === event.notification.data.url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(event.notification.data.url);
    })
  );
});
