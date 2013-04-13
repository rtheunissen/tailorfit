# tailorfit

jQuery plugin that allows you to fit elements (like images) within their containers.

## [Demo](http://github.com)

#### Usage
```javascript
    $('#container > img').load(function(){
        // maxWidth, maxHeight, maintain aspect ratio
        $(this).tailorfit(this.width, this.height);
    });
```
