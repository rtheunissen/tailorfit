/**
 * tailorfit
 *
 * @author Rudolf Theunissen <rudolf.theunissen@gmail.com>
 * @copyright Rudolf Theunissen 2013
 * @license MIT <http://opensource.org/licenses/mit-license.php>
 * @link https://github.com/paranoid-android/tailorfit
 * @version 1.0.0
 */

jQuery.fn.fitElement = function(maxWidth, maxHeight, keepAspect){

	keepAspect = keepAspect || true;
	var element = $(this);
	var container = element.parent();

	$(window).load(function(){
		onResize();
	});

    $(window).resize(function(){
    	onResize();
	});

	function onResize(){

		var containerHeight = container.height();
		var containerWidth = container.width();
		var maxRatio = maxWidth / maxHeight;
		var containerRatio = containerWidth / containerHeight;

		var x, y, w, h;

		if(!keepAspect){
			if(containerWidth < maxWidth){
				x = 0;
				y = (containerHeight - maxHeight) / 2;
				w = containerWidth;
				h = maxHeight;
			} else if(containerHeight < maxHeight){
				x = (containerWidth - maxWidth) / 2;
				y = 0;
				w = maxWidth;
				h = containerHeight;
			} else {
				x = (containerWidth - maxWidth) / 2;
				y = (containerHeight - maxHeight) / 2;
				w = maxWidth;
				h = maxHeight;
			}
		} else if(containerWidth >= maxWidth && containerHeight >= maxHeight){
				x = (containerWidth - maxWidth) / 2;
				y = (containerHeight - maxHeight) / 2;
				w = maxWidth;
				h = maxHeight;
		} else if(maxRatio > containerRatio){ // too wide
				var rh = containerWidth / maxRatio;
				x = 0;
				y = (containerHeight - rh) / 2;
				w = containerWidth;
				h = rh;
		} else {
				var rw = containerHeight * maxRatio;
				x = (containerWidth - rw) / 2;
				y = 0;
				w = rw;
				h = containerHeight;
		} 

		element.css({
			left: x, top: y, width: w, height: h
		});
	}
}

jQuery.fn.fitImage = function(){
	$(this).load(function(){
		$(this).fitElement(this.width, this.height, true);
	});
}

