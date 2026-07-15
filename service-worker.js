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
        payload = { title: "FloraFlow", message: event.data ? event.data.text() : "New notification" };
    }

    const title = payload.title || "FloraFlow";
    const options = {
        body: payload.message || payload.body || "You have a new FloraFlow notification.",
        icon: "/icon.png",
        badge: "/icon.png",
        tag: payload.tag || "floraflow-notification",
        renotify: false,
        data: {
            url: payload.action_url || payload.url || "/"
        }
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
    event.notification.close();
    const targetUrl = event.notification.data?.url || "/";

    event.waitUntil(
        self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clients) {
            for (const client of clients) {
                if ("focus" in client) {
                    client.navigate(targetUrl);
                    return client.focus();
                }
            }
            if (self.clients.openWindow) {
                return self.clients.openWindow(targetUrl);
            }
        })
    );
});
