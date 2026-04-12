importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDtMO8dbJWXcIdmhCAtvYdxKlntulcYqBI",
    projectId: "dahj-hub",
    messagingSenderId: "964532263352",
    appId: "1:964532263352:web:fe3d32318ed86be611d74d"
});

const messaging = firebase.messaging();

// GESTOR DE SEGUNDO PLANO
messaging.onBackgroundMessage((payload) => {
    // Se a notificação já veio pronta (como configuramos no Apps Script),
    // o navegador vai usar a TAG para unificar.
    console.log("Notificação recebida:", payload);
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const urlParaAbrir = 'https://palomasa81.github.io/o_eco_prototipo/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((windowClients) => {
                for (let client of windowClients) {
                    if (client.url === urlParaAbrir && 'focus' in client) return client.focus();
                }
                if (clients.openWindow) return clients.openWindow(urlParaAbrir);
            })
    );
});
