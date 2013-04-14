# tailorfit

jQuery plugin that allows you to fit elements (like images) within their containers.

Latest version will always be hosted at http ??

## [Demo](http://dev.fhmp.net/tailorfit/demo/)

#### Usage
```javascript
    $('#container > img').load(function(){
        // maxWidth, maxHeight, maintain aspect ratio
        $(this).tailorfit({
			'maxWidth'	  : this.width,
			'maxHeight'   : this.height
		});
    });
```
