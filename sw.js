importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDtMO8dbJWXcIdmhCAtvYdxKlntulcYqBI",
    projectId: "dahj-hub",
    messagingSenderId: "964532263352",
    appId: "1:964532263352:web:fe3d32318ed86be611d74d"
});

const messaging = firebase.messaging();

// Mostra a notificação quando o app está em segundo plano
messaging.onBackgroundMessage((payload) => {
    console.log("Mensagem recebida em segundo plano:", payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'logo-dahj.jpg',
        badge: 'logo-dahj.jpg',
        data: {
            url: 'https://palomasa81.github.io/o_eco_prototipo/'
        }
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Faz o celular abrir o site ao clicar na notificação
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
