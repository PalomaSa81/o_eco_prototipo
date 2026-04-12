importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDtMO8dbJWXcIdmhCAtvYdxKlntulcYqBI",
    projectId: "dahj-hub",
    messagingSenderId: "964532263352",
    appId: "1:964532263352:web:fe3d32318ed86be611d74d"
});

const messaging = firebase.messaging();

// GESTOR DE NOTIFICAÇÕES EM SEGUNDO PLANO
messaging.onBackgroundMessage((payload) => {
    console.log("Recebido em segundo plano:", payload);
    
    // Extrai os dados enviados pelo Apps Script
    const notificationTitle = payload.notification.title || "O Eco! - DAHJ";
    const notificationOptions = {
        body: payload.notification.body || "Nova matéria disponível!",
        icon: 'logo-dahj.jpg',
        badge: 'logo-dahj.jpg',
        data: {
            url: 'https://palomasa81.github.io/o_eco_prototipo/'
        }
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
