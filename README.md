# TailorFit

## jQuery plugin that fits and centers elements within their containers.


#### Usage
```js
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

For example: `max-width: 0.8*w-(200-h/4)` or `max-width: h / 2 - 20`, where `w` and `h` are the parent's width and height.

Note: `(expr) = expression, using (w, h, +, -, *, /, ^, %)`

### Available options:
* max-width         (expr)
* max-height        (expr)
* aspect-ratio      (expr)
* x-offset          (expr)
* y-offset          (expr)
* h-position        (left | center | right)
* v-position        (top | center | bottom)
* rounding-method   (round | floor | ceiling)
* overflow          (contain | crop)
