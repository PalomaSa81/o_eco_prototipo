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

const CACHE_NAME = 'dahj-eco-v2';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './logo-dahj.png',
  './badge.png',
  './bk0.webp'
];

// 2. Instalação e Cache (Essencial para o PWA ser instalável)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Fazendo cache dos arquivos estáticos');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[SW] Removendo cache antigo', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

// 3. OUVINTE NATIVO DE PUSH
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
      // O Firebase pode enviar os dados dentro de 'notification' ou 'data'
      const d = json.notification || json.data || json;
      payload.title = d.title || payload.title;
      payload.body = d.body || payload.body;
      payload.url = d.url || payload.url;
    } catch (e) {
      console.error("Erro ao ler JSON do push", e);
    }
  }

  const options = {
    body: payload.body,
    icon: 'logo-dahj.png',   // O ícone que você converteu
    badge: 'badge.png',      // A silhueta branca (essencial estar na raiz)
    tag: 'dahj-notificacao-unica',
    renotify: true,
    data: { url: payload.url },
    vibrate: [100, 50, 100]
  };

  event.waitUntil(self.registration.showNotification(payload.title, options));
});

// 4. Ação ao clicar na notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const targetUrl = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Se o site já estiver aberto, foca nele
      for (let client of windowClients) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      // Se não, abre uma nova janela
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
