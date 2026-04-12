importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDtMO8dbJWXcIdmhCAtvYdxKlntulcYqBI",
  projectId: "dahj-hub",
  messagingSenderId: "964532263352",
  appId: "1:964532263352:web:fe3d32318ed86be611d74d"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// SOLUÇÃO PARA NOTIFICAÇÃO DUPLICADA:
// O onBackgroundMessage intercepta a chegada e nós controlamos a exibição
messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] Mensagem recebida:', payload);

  // Se a notificação já foi processada pelo SO, a gente não força outra
  if (payload.notification) {
    const notificationTitle = payload.notification.title || "O Eco!";
    const notificationOptions = {
      body: payload.notification.body || "Nova atualização disponível",
      icon: 'logo-dahj.jpg',
      badge: 'logo-dahj.jpg',
      // O 'tag' é o segredo: notificações com a mesma tag se sobrescrevem 
      // em vez de criar várias entradas na tela do celular
      tag: 'dahj-notificacao-unica', 
      data: {
        url: 'https://dahj-uff.github.io/o-eco/' // Link para abrir ao clicar
      }
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
  }
});

// Opcional: Faz a notificação abrir o site ao ser clicada
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
