/**
 * tailorfit
 *
 * @author Rudolf Theunissen <rudolf.theunissen@gmail.com>
 * @copyright Rudolf Theunissen 2013
 * @license MIT <http://opensource.org/licenses/mit-license.php>
 * @link https://github.com/rtheunissen/tailorfit
 * @version 1.3
 */

 (function( $ ) {
    "use strict";

     jQuery.fn.tailorfit = function(options){

        // Create some defaults, extending them with any options that were provided
        var settings = $.extend({
            'maxWidth'      : 0,
            'maxHeight'   : 0,
            'forceAspect' : true
        }, options);

        return this.each(function() {

            var element = $(this);
            var container = element.parent();

            element.css({
                position: 'relative',
                display: 'block'
            });

            // fit when window is resized
            $(window).load(fit);

            // fit when page has loaded
            $(window).resize(fit);
            
            fit();

            function fit() {

                var x, y, w, h;

                if(settings.maxWidth === 0 || settings.maxHeight === 0){
                    // if max size wasn't specified, position only
                    //
                    // we only want to center the components regardless of
                    // aspect ratio or max- & min size.

                    x = (container.width() - element.width()) / 2;
                    y = (container.height() - element.height()) / 2;

                    // position only, size is not affected
                    element.css({
                        left: x, top: y
                    });

                } else {
                    // we want to center the element as well as check size constraints
                
                    if(!settings.forceAspect){
                        // we don't care about the aspect ratio here (loose)

                        if(container.width() < settings.maxWidth){
                            // the container is not as wide as the max width,
                            // fill the entire width of the container
                            
                            w = container.width();
                            x = 0;
                            
                        } else {
                            // the container is wider than the maximum
                            // fill the element to the max width
                            // and adjust the x position as well

                            w = settings.maxWidth;
                            x = (container.width() - w) / 2;
                            
                        }

                        if(container.height() < settings.maxHeight){
                            // the container is not as tall as the max height,
                            // fill the entire height of the container

                            h = container.height();
                            y = 0;
                            
                        } else {
                            // the container is taller than the maximum
                            // fill the element to the max height
                            // and adjust the y position as well

                            h = settings.maxHeight;
                            y = (container.height() - h) / 2;
                        }

                    } else {
                        // we care about the ascpect ratio here (strict)

                        if(container.width() >= settings.maxWidth && container.height() >= settings.maxHeight){
                            // the container is both taller and wider than the max
                            // so all we have to do is fill the element to the max
                            // and adjust the position accordingly

                            w = settings.maxWidth;
                            h = settings.maxHeight;
                            x = (container.width() - w) / 2;
                            y = (container.height() - h) / 2;

                        } else {
                            // the container is smaller than the maximum size
                            // so the element will have to be scaled down

                            // the ratio to constrict the size to
                            var maxRatio = settings.maxWidth / settings.maxHeight;
                            
                            if(maxRatio > container.width() / container.height()){
                                // container is too tall
                                // fill to width and calculate relative height

                                w = container.width();
                                h = container.width() / maxRatio;
                                
                                x = 0;
                                y = (container.height() - h) / 2;        
                                
                            } else {
                                // container is too wide
                                // fill to height and calculate relative width

                                w = container.height() * maxRatio;
                                h = container.height();
                                
                                x = (container.width() - w) / 2;
                                y = 0;
                            } 
                        }
                    }

                    // position and size of element
                    element.css({
                        left: x, top: y, width: w, height: h
                    });
                }
            }
        });
    };
})( jQuery );