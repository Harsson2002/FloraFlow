self.addEventListener("install", function (event) {
    self.skipWaiting();
});

self.addEventListener("activate", function (event) {
    event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function (event) {
    event.respondWith(fetch(event.request));
});

self.addEventListener("push", function (event) {
    let payload = {};

    try {
        payload = event.data ? event.data.json() : {};
    } catch (error) {
        payload = {
            title: "FloraFlow",
            message: event.data ? event.data.text() : "You have a new FloraFlow notification."
        };
    }

    const title = payload.title || "FloraFlow";
    const options = {
        body: payload.message || payload.body || "You have a new FloraFlow notification.",
        icon: "/icon.png",
        badge: "/icon.png",
        tag: payload.tag || "floraflow-notification",
        renotify: false,
        data: {
            action_url: payload.action_url || "/",
            type: payload.type || "GENERAL"
        }
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
    event.notification.close();
    const targetUrl = new URL(event.notification.data?.action_url || "/", self.location.origin).href;

    event.waitUntil(
        self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
            for (const client of clientList) {
                if (client.url === targetUrl && "focus" in client) {
                    return client.focus();
                }
            }

            if (self.clients.openWindow) {
                return self.clients.openWindow(targetUrl);
            }
        })
    );
});
