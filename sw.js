/** @format */

const CACHE_NAME = 'cache-1';

//App shell. (todo lo que requiere la app para funcionar)
self.addEventListener('install', (event) => {
	const cacheProm = caches.open(CACHE_NAME).then((cache) => {
		//Grabando todo en el cache.
		return cache.addAll([
			'/',
			'/index.html',
			'/css/style.css',
			'/img/main.jpg',
			'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css',
			'/js/app.js',
		]);
	});
	//Esperar a que todo lo anterior este cargado.
	event.waitUntil(cacheProm);
});

self.addEventListener('fetch', (event) => {
	//1- CACHE ONLY: toda la app desde el cache.
	// event.respondWith(caches.match(event.request));

	//2- CACHE WITH NETWORK FALLBACK
	const respuesta = caches.match(event.request).then((resp) => {
		if (resp) return resp;

		//Si no existe el archivo lo busco en la web.
		console.log('No existe', event.request.url);

		return fetch(event.request).then((newResp) => {
			caches.open(CACHE_NAME).then((cache) => {
				cache.put(event.request, newResp);
			});
			return newResp.clone();
		});
	});

	event.respondWith(respuesta);
});
