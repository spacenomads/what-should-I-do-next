'use strict';
importScripts('./cache-polyfill.js');


self.addEventListener('install', function (event) {
	event.waitUntil(
		caches.open('airhorner').then(function (cache) {
			return cache.addAll([
				'./',
				'./index.html',
				'./css/app.css',
				'./css/buttons.css',
				'./css/core.css',
				'./css/forms.css',
				'./css/screens.css',
				'./img/1925.png',
				'./img/menu.svg',
				'./img/menu-disabled.svg',
				'./img/close.svg',
				'./img/close-white.svg',
				'./js/app.js'
			]);
		})
	);
});

self.addEventListener('fetch', function (event) {
	console.log(event.request.url);

	event.respondWith(
		caches.match(event.request).then(function (response) {
			return response || fetch(event.request);
		})
	);
});

