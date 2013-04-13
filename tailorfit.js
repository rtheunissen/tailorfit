/**
 * tailorfit
 *
 * @author Rudolf Theunissen <rudolf.theunissen@gmail.com>
 * @copyright Rudolf Theunissen 2013
 * @license MIT <http://opensource.org/licenses/mit-license.php>
 * @link https://github.com/paranoid-android/tailorfit
 * @version 1.0.0
 */

jQuery.fn.tailorfit = function(maxWidth, maxHeight, keepAspect){

	if(keepAspect == undefined) keepAspect = true;
	if(maxWidth   == undefined) maxWidth = 0;
	if(maxHeight  == undefined) maxHeight = 0;

	var element = $(this);
	var container = $(this).parent();

	element.css('position', 'relative');

	$(window).load(function(){
		onResize();
	});

	$(window).resize(function(){
		onResize();
	});

	onResize();

	function onResize(){

		var containerHeight = container.outerHeight(true);
		var containerWidth = container.outerWidth(true);

		var x, y, w, h;

		if(maxWidth == 0) maxWidth = containerWidth;
		if(maxHeight == 0) maxHeight = containerHeight;


		if(!keepAspect){
			if(containerWidth < maxWidth){
				x = 0;
				w = containerWidth;
			} else {
				x = (containerWidth - maxWidth) / 2;
				w = maxWidth;
			}
			
			if(containerHeight < maxHeight){
				y = 0;
				h = containerHeight;
			} else {
				y = (containerHeight - maxHeight) / 2;
				h = maxHeight;
			}
		} else if(containerWidth >= maxWidth && containerHeight >= maxHeight){
				x = (containerWidth - maxWidth) / 2;
				y = (containerHeight - maxHeight) / 2;
				w = maxWidth;
				h = maxHeight;
		} else {
			var maxRatio = maxWidth / maxHeight;
			if(maxRatio > containerWidth / containerHeight){
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
		}
		
		element.css({
			left: x, top: y, width: w, height: h
		});
	}
}

