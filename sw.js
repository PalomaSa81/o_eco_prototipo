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

// Ontem, deixamos isso vazio ou apenas com um log. 
// O Firebase SDK já gerencia a exibição se o GAS mandar o objeto 'notification'
messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] Notificação recebida e tratada pelo Firebase SDK.', payload);
});

// Isso garante que ao clicar, ele abra o site do DAHJ
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://dahj-uff.github.io/o-eco/')
  );
});
