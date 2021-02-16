/** @format */

// const CACHE_NAME = 'cache-1';
const CACHE_STATIC_NAME = 'static-v2';
const CACHE_DYNAMIC_NAME = 'dynamic-v1';
const CACHE_INMUTABLE_NAME = 'inmutable-v1';

function limpiarCache(cacheName, numeroItems) {
	caches.open(cacheName).then((cache) => {
		return cache.keys().then((keys) => {
			if (keys.length > numeroItems) {
				cache.delete(keys[0]).then(limpiarCache(cacheName, numeroItems));
			}
		});
	});
}

//App shell. (todo lo que requiere la app para funcionar)
self.addEventListener('install', (event) => {
	const cacheProm = caches.open(CACHE_STATIC_NAME).then((cache) => {
		//Grabando todo en el cache.
		return cache.addAll([
			'/',
			'/index.html',
			'/css/style.css',
			'/img/main.jpg',
			'/js/app.js',
		]);
	});
	const cacheInmutable = caches.open(CACHE_INMUTABLE_NAME).then((cache) => {
		return cache.addAll([
			'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css',
		]);
	});
	//Esperar a que todo lo anterior este cargado.
	event.waitUntil(Promise.all([cacheProm, cacheInmutable]));
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
			caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
				cache.put(event.request, newResp);
				limpiarCache(CACHE_DYNAMIC_NAME, 50);
			});
			return newResp.clone();
		});
	});

	event.respondWith(respuesta);
});
