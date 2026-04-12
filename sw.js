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
    console.log("Recebido:", payload);
    
    // Se o payload já tem notification, o Firebase vai tentar exibir.
    // Para evitar que o 'App' e o 'Chrome' exibam juntos, a TAG é vital.
    if (payload.notification) {
        return; 
    }
});

// O SEGREDO ESTÁ AQUI: Gerenciar o clique e as janelas
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const urlParaAbrir = 'https://palomasa81.github.io/o_eco_prototipo/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((windowClients) => {
                // 1. Verifica se o site/app já está aberto
                for (let client of windowClients) {
                    if (client.url === urlParaAbrir && 'focus' in client) {
                        return client.focus();
                    }
                }
                // 2. Se não estiver aberto, abre uma nova janela (ou o app)
                if (clients.openWindow) {
                    return clients.openWindow(urlParaAbrir);
                }
            })
    );
});
