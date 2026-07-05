self.addEventListener("install", function () {
    console.log("FloraFlow installed");
});

self.addEventListener("fetch", function (event) {
    event.respondWith(fetch(event.request));
});