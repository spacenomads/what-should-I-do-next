'use strict';
importScripts('/what-should-I-do-next/cache-polyfill.js');


self.addEventListener('install', function (event) {
	event.waitUntil(
		caches.open('airhorner').then(function (cache) {
			return cache.addAll([
				'/what-should-I-do-next/',
				'/what-should-I-do-next/index.html',
				'/what-should-I-do-next/css/app.css',
				'/what-should-I-do-next/css/buttons.css',
				'/what-should-I-do-next/css/core.css',
				'/what-should-I-do-next/css/forms.css',
				'/what-should-I-do-next/css/screens.css',
				'/what-should-I-do-next/img/1925.png',
				'/what-should-I-do-next/img/menu.svg',
				'/what-should-I-do-next/img/menu-disabled.svg',
				'/what-should-I-do-next/img/close.svg',
				'/what-should-I-do-next/img/close-white.svg',
				'/what-should-I-do-next/js/app.js'
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

