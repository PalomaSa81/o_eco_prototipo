importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Essas infos têm que ser IDÊNTICAS às do seu index.html
const firebaseConfig = {
  apiKey: "AIzaSyDtMO8dbJWXcIdmhCAtvYdxKlntulcYqBI",
  projectId: "dahj-hub",
  messagingSenderId: "964532263352",
  appId: "1:964532263352:web:fe3d32318ed86be611d74d"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Isso aqui é o que faz a mágica da notificação aparecer com o Chrome fechado
messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] Recebida mensagem em background: ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'logo-dahj.jpg', // Certifique-se que esse arquivo existe na raiz
    badge: 'logo-dahj.jpg'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
