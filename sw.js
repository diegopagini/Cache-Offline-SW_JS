/** @format */

//App shell. (todo lo que requiere la app para funcionar)
self.addEventListener('install', (event) => {
	const cacheProm = caches.open('cache-1').then((cache) => {
		//Grabando todo en el cache.
		return cache.addAll([
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
