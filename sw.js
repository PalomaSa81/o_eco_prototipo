importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDtMO8dbJWXcIdmhCAtvYdxKlntulcYqBI",
  projectId: "dahj-hub",
  messagingSenderId: "964532263352",
  appId: "1:964532263352:web:fe3d32318ed86be611d74d"
});

const messaging = firebase.messaging();

// Lógica para exibir notificação em segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log('Notificação em background:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'logo-dahj.jpg'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
