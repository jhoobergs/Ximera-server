var version = require('../../package.json').version;
var mathjaxRoot = '/node_modules/mathjax/';

var cacheUrls = [
    window.toValidPath('/public/v' + version + '/javascripts/main.min.js'),
    window.toValidPath('/public/v' + version + '/stylesheets/base.css'),
    window.toValidPath('/public/v' + version + '/images/logo/logo.svg'),
    window.toValidPath('/public/v' + version + '/images/osu/osu-web-footer-wordmark-rev.png'),
    window.toValidPath('/public/json/symbols.json'),
    window.toValidPath('/node_modules/guppy-dev/build/guppy-default.min.css'),
    window.toValidPath(mathjaxRoot + '/jax/input/TeX/jax.js'),   
    window.toValidPath(mathjaxRoot + '/jax/element/mml/jax.js'),   
    window.toValidPath(mathjaxRoot + '/jax/output/HTML-CSS/jax.js'), 
    window.toValidPath(mathjaxRoot + '/jax/output/HTML-CSS/fonts/TeX/fontdata.js'),
    window.toValidPath(mathjaxRoot + '/extensions/TeX/AMSmath.js'),  
    window.toValidPath(mathjaxRoot + '/extensions/MathEvents.js'),   
    window.toValidPath(mathjaxRoot + '/extensions/TeX/AMSsymbols.js'), 
    window.toValidPath(mathjaxRoot + '/extensions/TeX/noErrors.js'),   
    window.toValidPath(mathjaxRoot + '/extensions/TeX/noUndefined.js'),
    window.toValidPath(mathjaxRoot + '/extensions/TeX/color.js'),  
    window.toValidPath(mathjaxRoot + '/extensions/TeX/cancel.js'),
    window.toValidPath(mathjaxRoot + '/extensions/toMathML.js'),    
    window.toValidPath(mathjaxRoot + '/extensions/AssistiveMML.js'),
    window.toValidPath(mathjaxRoot + '/extensions/MathMenu.js'),
    window.toValidPath(mathjaxRoot + '/extensions/MathZoom.js'),        
    window.toValidPath(mathjaxRoot + '/extensions/a11y/accessibility-menu.js'),
];

//GET /node_modules/mathjax//jax/input/TeX/config.js?V=2.7.3 200 8.363 ms - 1268
//GET /node_modules/mathjax//extensions/tex2jax.js?V=2.7.3 200 5.973 ms - 6959
//GET /node_modules/mathjax//jax/output/HTML-CSS/config.js?V=2.7.3 200 8.134 ms - 3570
//GET /node_modules/mathjax//extensions/fast-preview.js?V=2.7.3 200 5.903 ms - 3177
//GET /node_modules/mathjax//extensions/CHTML-preview.js?V=2.7.3 200 5.184 ms - 829

self.addEventListener('install', function(event) {
    event.waitUntil(
	caches.open(version).then(function(cache) {
	    return cache.addAll(cacheUrls);
	})
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
	caches.keys().then(function(cacheNames) {
	    return Promise.all(
		cacheNames.filter(function(cacheName) {
		    return (cacheName != version);
		}).map(function(cacheName) {
		    return caches.delete(cacheName);
		})
	    );
	})
    );
});

// cache woff
self.addEventListener('fetch', function(event) {
    // Eliminate query strings from mathjax requests
    if (event.request.url.startsWith(mathjaxRoot)) {
        var requestClone = event.request.clone();

	var normalizedUrl = new URL(event.request.url);
	normalizedUrl.search = '';
	
	return event.respondWith(caches.match(normalizedUrl).then(function(response) {
	    console.log("Found!",response);
	    if (response !== undefined) {	    
		return response;
	    } else {
		return fetch(event.request);
	    }
	}));
    }
    
    event.respondWith(caches.open(version).then(function(cache) {
	return cache.match(event.request).then(function(response) {
	    // caches.match() always resolves
	    // but in case of success response will have value
	    if (response !== undefined) {
		return response;
	    } else {
		return fetch(event.request);
	    }
	})
    }));

    return;		      

    
  event.respondWith(caches.match(event.request).then(function(response) {
    // caches.match() always resolves
    // but in case of success response will have value
    if (response !== undefined) {
      return response;
    } else {
      return fetch(event.request).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        var responseClone = response.clone();
        
        caches.open(version).then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function () {
        return caches.match('/sw-test/gallery/myLittleVader.jpg');
      });
    }
  }));
});
