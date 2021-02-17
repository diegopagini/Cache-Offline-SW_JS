/** @format */

const CACHE_STATIC_NAME = 'static-v5';
const CACHE_DYNAMIC_NAME = 'dynamic-v1';
const CACHE_INMUTABLE_NAME = 'inmutable-v1';
const CACHE_DYNAMIC_LIMIT = 50;

function limpiarCache(cacheName, numeroItems) {
	caches.open(cacheName).then((cache) => {
		return cache.keys().then((keys) => {
			if (keys.length > numeroItems) {
				cache.delete(keys[0]).then(limpiarCache(cacheName, numeroItems));
			}
		});
	});
}

self.addEventListener('install', (event) => {
	const cacheProm = caches.open(CACHE_STATIC_NAME).then((cache) => {
		//Grabando todo en el cache.
		return cache.addAll([
			'/',
			'/index.html',
			'/css/style.css',
			'/img/main.jpg',
			'/js/app.js',
			'/img/no-img.jpg',
			'/pages/offline.html',
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

//Borrar caches viejos
self.addEventListener('activate', (event) => {
	const activacion = caches.keys().then((keys) => {
		keys.forEach((key) => {
			if (key !== CACHE_STATIC_NAME && key.includes('static')) {
				return caches.delete(key);
			}
		});
	});
	event.waitUntil(activacion);
});

self.addEventListener('fetch', (event) => {
	const respuesta = caches.match(event.request).then((resp) => {
		if (resp) return resp;

		//Si no existe el archivo lo busco en la web.
		console.log('No existe', event.request.url);

		return fetch(event.request)
			.then((newResp) => {
				caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
					cache.put(event.request, newResp);
					limpiarCache(CACHE_DYNAMIC_NAME, CACHE_DYNAMIC_LIMIT);
				});
				return newResp.clone();
			})
			.catch((err) => {
				//Si lo que se solicita es una pagina web.
				if (event.request.headers.get('accept').includes('text/html')) {
					return caches.match('/pages/offline.html');
				}
			});
	});
	event.respondWith(respuesta);
});
