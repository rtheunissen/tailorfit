/**
 * tailorfit
 *
 * @author Rudolf Theunissen <rudolf.theunissen@gmail.com>
 * @copyright Rudolf Theunissen 2013
 * @license MIT <http://opensource.org/licenses/mit-license.php>
 * @link https://github.com/rtheunissen/tailorfit
 * @version 1.4
 */
(function ($) {

    "use strict";

    // Create some defaults, extending them with any options that were provided
    var defaults = {

        // pixel value or percentage of parent
        'maxWidth': 0,
        'maxHeight': 0,

        // floating point ratio of width to height 
        'ratio': 0,
        
        // value to offset x-position by
        'offsetX': 0,
        
         // value to offset y-position by
        'offsetY': 0,
       
        // horizontal, vertical, both
        'center': 'both',
        
        // floor, ceiling, round
        'round': 'round' 
    };

    jQuery.fn.tailorfit = function (options, value) {

        return this.each(function () {

            var $this = $(this);

            var loaded = $this.data('tailorfit') === 'init';

            if (typeof options === 'string' && value !== undefined) {
                $this.data(options, value);
                if (loaded) {
                    _setBounds($this);
                }
                return $this;
            } else {
                $.extend($this.data(), $.extend(defaults, options));
                $this.data('tailorfit', 'init');
            }

            // if tailorfit has already been initialised on this $this
            if (loaded) {
                $(window).off('.tailorfit');
            }

            $this.css({
                position: 'relative',
                display: 'block'
            });

            // fit when window is loaded and resized
            $(window).on('load.tailorfit resize.tailorfit', function () {
                _setBounds($this);
            });

            _setBounds($this);

        });

        function _setBounds(element) {

            var parent = element.parent();
            var parentWidth = parent.width();
            var parentHeight = parent.height();

            var ratio = parseDimension(element.data('ratio'));
            var rounding = getRounding(element.data('round'));
            var center = element.data('center');
            var maxWidth = parseDimension(element.data('maxWidth'), parentWidth);
            var maxHeight = parseDimension(element.data('maxHeight'), parentHeight);

            var w, h;

            if(maxWidth <= 0 && maxHeight <= 0){
                // maximum wasn't set
                w = element.width;
                h = element.height;
            } else if (ratio === 0) {
                h = Math.min(maxHeight, parentHeight);
                w = Math.min(maxWidth, parentWidth);
            } else {
                var availableWidth = Math.min(maxWidth, parentWidth);
                var availableHeight = Math.min(maxHeight, parentHeight);
                h = Math.min(availableHeight, availableWidth / ratio);
                w = ratio * h;
            }

            var x = positionX(center, parentWidth, w);
            var y = positionY(center, parentHeight, h);

            var bounds = $.map([x, y, w, h], rounding);

            element.css({
                left:   bounds[0] + parseDimension(element.data('offsetX')),
                top:    bounds[1] + parseDimension(element.data('offsetY')),
                width:  bounds[2],
                height: bounds[3]
            });
        }

        // rounds a value according to the rounding scheme

        function getRounding(option) {
            switch (option) {
                case 'floor':
                    return Math.floor;
                case 'ceiling':
                    return Math.ceil;
                default:
                    return Math.round;
                }
        }

        // returns true if a value is a string percentage

        function isPercentage(dimension) {
            return typeof dimension === 'string' && dimension.slice(-1) === '%';
        }

        // returns the pixel value of a dimension relative to the parent
        // for example, a percentage of a relative dimension
        // we don't know if dimension is a value or a percentage

        function parseDimension(dimension, relativeDimension) {
            if (isPercentage(dimension)) {
                return parsePercentage(dimension) * (relativeDimension || 1);
            }
            return parseNumber(dimension);
        }

        function parseNumber(n, fallback) {
            if(typeof n === 'number' && !isNaN(n) || !isNaN(n = parseFloat(n))){
                return n;
            }
            return fallback || 0;
        }


        // converts a percentage string to a float

        function parsePercentage(percentage) {
            return parseFloat(percentage.slice(0, -1)) / 100;
        }

        // positions the x-value according to the centering scheme

        function positionX(center, parentWidth, elementWidth) {
            return center === 'vertical' ? 0 
            : (parentWidth - elementWidth) >> 1;
        }

        // positions the y-value according to the centering scheme

        function positionY(center, parentHeight, elementHeight) {
            return center === 'horizontal' ? 0 
            : (parentHeight - elementHeight) >> 1;
        }
    };
})(jQuery);