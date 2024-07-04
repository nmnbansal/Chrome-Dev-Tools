self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    clients.claim().then(() => {
      console.log("Service Worker Activated");
    })
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const fetchRequest = request.clone();
  const startTime = performance.now();

  const getNameFromURL = (url) => {
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split("/");
    return pathSegments[pathSegments.length - 1] || urlObj.hostname;
  };

  event.respondWith(
    fetch(fetchRequest)
      .then((response) => {
        const responseClone = response.clone();
        const endTime = performance.now();
        const duration = endTime - startTime;

        responseClone.text().then((responseText) => {
          const responseSize = new Blob([responseText]).size;
          const responseDetails = {
            url: request.url,
            type: getRequestType(request),
            method: request.method,
            headers: [...request.headers.entries()],
            status: response.status,
            statusText: response.statusText,
            responseText,
            time: new Date().toISOString(),
            duration,
            size: responseSize,
            name: getNameFromURL(request.url),
          };

          emitRequestDetails(responseDetails);
        });

        return response;
      })
      .catch((error) => {
        console.error("Fetch failed:", error);
        throw error;
      })
  );
});

function getRequestType(request) {
  const url = new URL(request.url);

  if (request.destination) {
    return request.destination;
  }

  if (request.headers.get("Accept").includes("text/html")) {
    return "document";
  }

  if (request.headers.get("Accept").includes("application/json")) {
    return "fetch";
  }

  if (url.pathname.endsWith(".js")) {
    return "script";
  }

  if (url.pathname.endsWith(".css")) {
    return "style";
  }

  if (/\.(jpg|jpeg|png|gif|svg)(\?.*)?$/.test(url.pathname + url.search)) {
    return "image";
  }

  return "fetch";
}

function emitRequestDetails(detail) {
  clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: "INTERCEPTED_REQUEST",
        detail,
      });
    });
  });
}
