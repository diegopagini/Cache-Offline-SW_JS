/** @format */

self.addEventListener('fetch', (event) => {
	const offlineResp = new Response(`
    Bienvenido a mi Pagina web,
    Disculpa, pero para usarla, necesitas internet.
  `);
	const resp = fetch(event.request).catch(() => {
		return offlineResp;
	});
	event.respondWith(resp);
});
