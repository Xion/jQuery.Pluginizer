# jQuery.Pluginizer

_jQuery.Pluginizer_ is a kind of "meta-plugin" for jQuery: a plugin that simplifies creation of other plugins.
It works especially well in complex web applications, where it allows to easily modularize pieces of JavaScript
which are used to render interactive elements on page.

## Example

Let's say we have some sort of dynamically loaded list of items - for example, a stream of events from social network such as Twitter:

```html
<ul class="stream">
	<li>Creating a polaroid photo viewer with #CSS3 and #jQuery http://dld.bz/Czwu</li>
	<li>50 Useful New jQuery Techniques and Tutorials - Smashing Magazine http://bit.ly/rsQP11 #jquery</li>
	<li>Simplest SOAP example using Javascript - Stack Overflow http://bit.ly/mT2iyW #jQuery #javascript</li>
	<li class="loader"><a href="#">Load more</a></li>
</ul>
```
Besides some HTML markup, the stream also needs some JavaScript to handle user interaction and make AJAX requests.
We can use _jQuery.Pluginizer_ to easily turn this logic into dedicated jQuery plugin which we'll then
apply to the DOM above:

```javascript
$.pluginize('stream', function(data) {
	var $stream = this;
	var $loader = $stream.find('.loader');

	var loaderLink_click = function(event) {
		var ajaxArgs = data.time ? { time: data.time } : {};
		$.getJSON('/api/stream/load', ajaxArgs).done(function(items) {
			$.each(items, function() {
				var $li = $('<li/>').html(this.text);
				$stream.insertBefore($loader);
			});
			if (items.length > 0)
				data.time = items[items.length - 1].time;
		});
	};

	return {
		init: function() {
			data.time = null;
			$loader.find('a').on('click', loaderLink_click);
		};
	};
});

$(document).ready(function() {
	$('.stream').stream();
});
```
Thanks to this encapsulation, we can now effortlessly use our stream on multiple pages - or possibly even more
than once on single page.

## Usage

<code>$.pluginize</code> is the sole function exposed by _jQuery.Pluginizer_:

```javascript
$.pluginize = function(name, methods, initialData)
```
* <code>name</code> - Plugin name, and also a name for function that will be attached to <code>$()</code> objects.
                      Should be unique. Using valid JavaScript identifiers is recommended.
* <code>methods</code> - Methods exposed by the plugin.
* <code>initialData</code> - Plugin's initial data.

The <code>methods</code> parameter can be either a JavaScript object or a function returning such object.

If it's a function, it can accept a single argument: an object that can be populated with plugin-specific data.
It will be stored as properly namespaced <code>$.data</code> within DOM element. This data object is initialized
using <code>initialData</code> argument, if present.

The DOM element itself (<code>$</code>-wrapped) will be accessible through <code>this</code> inside the
<code>methods</code> function.
