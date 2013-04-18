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

You can also use expressions to evaluate a value.

For example: `max-width: 80%-(200-h/4)` or `max-width: h / 2 - 20`, where `w` and `h` are the parent's width and height.
Options for which expressions are supported are indicated with an -e below.

Note: `(evp) = (expression | value | percentage)`

### Available options:
* max-width         (evp)
* max-height        (evp)
* aspect-ratio      (evp)
* x-offset          (evp)
* y-offset          (evp)
* h-position        (left | center | right)
* v-position        (top | center | bottom)
* rounding-method   (round | floor | ceiling)
