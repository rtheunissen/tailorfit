# TailorFit

## jQuery plugin that fits and centers elements within their containers.

## [Demo](http://dev.fhmp.net/tailorfit/demo/)


Tested on all user-agents available on Chrome 26 dev tools:
* IE 7+
* FF 4+
* iOS 3+ (iPad and iPhone)
* Android
* BlackBerry
* MeeGo
    
* [Screenshots](http://dev.fhmp.net/tailorfit/browsertest/results/) of tests done on browsershots.org:


### Latest version will always be hosted at 
> http://dev.fhmp.net/tailorfit/tailorfit-latest.min.js

#### Usage
```javascript
    $('#parent > img').load(function(){
        // maxWidth, maxHeight, maintain aspect ratio
        $(this).tailorfit({
                maxWidth  : this.width,
                maxHeight : this.height,
                ratio     : this.width / this.height
        });
    });
```

### Available options:
* max-width
* max-height
* aspect-ratio
* x-offset
* y-offset
* h-position
* v-position
* rounding-method
