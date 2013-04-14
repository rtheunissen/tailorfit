# TailorFit

## jQuery plugin that fits and centers elements within their containers.

Latest version will always be hosted at 
> https://raw.github.com/rtheunissen/tailorfit/master/tailorfit-latest-min.js

## [Demo](http://dev.fhmp.net/tailorfit/demo/)

#### Usage
```javascript
    $('#container > img').load(function(){
        // maxWidth, maxHeight, maintain aspect ratio
        $(this).tailorfit({
                'maxWidth'  : this.width,
                'maxHeight' : this.height
        });
    });
```

![TailorFit Logo](http://i.imgur.com/4281ImN.png)
