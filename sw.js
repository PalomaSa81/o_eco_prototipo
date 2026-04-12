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

    // Se o payload já possui um objeto 'notification', o Firebase SDK 
    // vai exibir a notificação automaticamente. 
    // Não precisamos (e não devemos) chamar showNotification() aqui,
    // a menos que queiramos customizar algo que o Firebase não enviou.
    
    if (payload.notification) {
        console.log("Firebase cuidará da exibição. Evitando duplicidade.");
        return; 
    }

    // Caso o payload venha APENAS com 'data' (sem notification), 
    // aí sim criamos uma manualmente:
    const notificationTitle = "📰 O Eco!";
    const notificationOptions = {
        body: payload.data.body || "Nova matéria disponível!",
        icon: 'logo-dahj.jpg',
        badge: 'logo-dahj.jpg',
        tag: 'o-eco-notifica', // Tag de segurança
        data: {
            url: 'https://palomasa81.github.io/o_eco_prototipo/'
        }
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    // Pega a URL dos dados ou usa a padrão do site
    const urlParaAbrir = (event.notification.data && event.notification.data.url) 
                         ? event.notification.data.url 
                         : 'https://palomasa81.github.io/o_eco_prototipo/';

    event.waitUntil(
        clients.openWindow(urlParaAbrir)
    );
});
