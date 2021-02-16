/** @format */

//Instalar el SW
if (navigator.serviceWorker) {
	navigator.serviceWorker.register('/sw.js');
}

if (window.caches) {
	//Crea un cache .open
	caches.open('prueba-1');
	caches.open('prueba-2');
	//Verifica si existe algun cache .has
	caches.has('prueba-3').then((existe) => {
		console.log(existe);
	});
	//Borrar un cache
	caches.delete('prueba-1').then(console.log);
	//Guardar el index.html en cache
	caches.open('cache-v1.1').then((cache) => {
		//Agregar de a 1 archivo
		cache.add('/index.html');
		//Agregar varios a la vez.
		cache
			.addAll(['/index.html', '/css/style.css', '/img/main.jpg'])
			.then(() => {
				//Borrar algo de este cache especifico
				cache.delete('/css/style.css');
			});
		//Consulta si existe
		cache.match('/index.html').then((resp) => {
			resp.text().then(console.log);
		});
	});
}
