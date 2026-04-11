// Nome do cachê (versão do app)
const CACHE_NAME = 'o-eco-v1';
const assets = [
  './',
  './index.html',
  './logo-dahj.jpg'
];

// Instala o Service Worker e guarda arquivos básicos no cachê
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Escuta as notificações que chegam do Firebase
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : { title: 'O Eco!', body: 'Nova atualização disponível!' };
  
  const options = {
    body: data.body,
    icon: 'logo-dahj.jpg', // Ícone que aparece na notificação
    badge: 'logo-dahj.jpg', // Ícone pequeno da barra de status
    vibrate: [100, 50, 100],
    data: {
      url: data.click_action || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Faz o celular abrir o site quando o aluno clica na notificação
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});

// Responde com arquivos do cachê se estiver sem internet
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
