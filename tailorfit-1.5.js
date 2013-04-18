/**
 * TailorFit
 *
 * Controls resize behaviour of block elements relative to their parents.
 *
 * @author Rudolf Theunissen <rudolf.theunissen@gmail.com>
 * @copyright Rudolf Theunissen 2013
 * @license MIT <http://opensource.org/licenses/mit-license.php>
 * @link https://github.com/rtheunissen/tailorfit
 * @version 1.5
 */

;(function ($) {

    "use strict";

    // default values for unspecified options
    var defaults = {

        // maximum width that the element can grow to
        // this can be a pixel value, % of parent or equation
        'max-width': 0,
        
        // maximum heigh that the element can grow to
        // this can be a pixel value, % of parent or equation
        'max-height': 0,

        // floating point ratio of width to height 
        'aspect-ratio': 0,
        
        // value to offset x-position by
        'x-offset': 0,
        
         // value to offset y-position by
        'y-offset': 0,
       
        // top, bottom, center
        'v-position': 'center',

        // left, right, center
        'h-position': 'center',
        
        // floor, ceiling, round
        'rounding-method': 'round' 
    };

    jQuery.fn.tailorfit = function (options, value) {

       return this.each(function () {

            var $this = $(this);

            // loaded will be true if the active flag has been set
            var loaded = $this.data('tailorfit') === 'active';

            if (typeof options === 'string' && value !== undefined) {
                // this is for a call to set a single value
                // such as with tailorfit(option, value);

                // update the option with the new value
                $this.data(options, value);

                if (loaded) {
                    // update the layout only if we've already loaded the plugin
                    _setBounds($this);
                }
                return $this;
            
            } else {
                // assume that options is an assoc array
                // extend by the defaults and set each data value

                // the reason why we don't use a nested extend here is
                // because jQuery converts all data pairs to camelCase
                // for the sake of consistency, we could use camelCase
                // everywhere or just let jQuery handle it for us
                var settings = $.extend(defaults, options);
                for (var key in settings){
                    if (settings.hasOwnProperty(key)){
                        $this.data(key, settings[key]);  
                    }
                }
            }

            // set active flag -> plugin has been loaded
            $this.data('tailorfit', 'active');


            if (loaded) {
                // if tailorfit had already been initialised
                // unregister previous invocation's bindings
                $(window).off('.tailorfit');
            }

            // relative vs. absolute?
            $this.css({
                position: 'relative',
                display: 'block'
            });

            // update the bounds of the element when window is loaded and resized
            $(window).on('load.tailorfit resize.tailorfit', function () {
                _setBounds($this);
            });

            // run intial pass to set some start values
            _setBounds($this);
        });

        function _setBounds(element) {

            var parent = element.parent();
            var pw = parent.width();
            var ph = parent.height();

            var maxWidth = element.data('max-width');
            var maxHeight = element.data('max-height');

            // element position and size placeholders
            var x, y, w, h;

            // method to round each value with
            var rounded = getRoundingMethod(element.data('rounding-method'));
         
            if(!(maxWidth && maxHeight)){
                // if either or both of max width or max height weren't given
                
                if (!maxWidth) {
                    // max width has not been set
                    // so leave as auto and simply position only
                    // rounds the calculated position first
                    x = positionX(element.data('h-position'), pw, element.width());
                    element.css({
                        left: rounded(x)
                    });
                } 
                if (!maxHeight) {
                    // max height has not been set
                    // so leave as auto and simply position only
                    // rounds the calculated position first
                    y = positionY(element.data('v-position'), ph, element.height());
                    element.css({
                        top: rounded(y)
                    });
                }

                // return early because size is not affected
                return;
            }

            // aspect ratio
            var r =  evaluateExpression(element.data('aspect-ratio'), pw, ph);

            // max width
            var mw = evaluateExpression(maxWidth, pw, ph, pw);

            // max height
            var mh = evaluateExpression(maxHeight, pw, ph, ph);

            if (r === 0) {
                // ratio of zero means that no ratio is enforced
                h = Math.min(mh, ph);
                w = Math.min(mw, pw);
            } else {
                // available width
                var aw = Math.min(mw, pw);
                
                // available height
                var ah = Math.min(mh, ph);
              
                // if we maximise the area we get the equation
                // max(w*h) : w <= aw && h <= ah && w / h = r.
                h = Math.min(ah, aw / r);
                w = r * h;
            }

            // position x according to the h-position option, relative to the parent's width
            x = positionX(element.data('h-position'), pw, w);

            // position y according to the v-position option, relative to the parent's height
            y = positionY(element.data('v-position'), ph, h);

            // add each respective offset to the position values
            x += evaluateExpression(element.data('x-offset'), pw, ph, pw);
            y += evaluateExpression(element.data('y-offset'), pw, ph, ph);

            // set css of element after rounding each value
            element.css({
                left:   rounded(x),
                top:    rounded(y),
                width:  rounded(w),
                height: rounded(h)
            });
        }
    };

    // returns the x value for the given position option
    // relative to the parent and elements widths
    function positionX(position, pw, w) {
        switch(position){
            case 'left'     : return 0;
            case 'right'    : return pw - w;

            // default to center
            default         : return (pw - w) / 2; 
        }
    }

    // returns the y value for the given position option
    // relative to the parent and elements heights
    function positionY(position, ph, h) {
        switch(position){
            case 'top'     : return 0;
            case 'bottom'  : return ph - h;

            // default to center
            default        : return (ph - h) / 2; 
        }
    }

    // this is just a convenience method to look at the top of a stack
    Array.prototype.peek = function(){
        return this[this.length - 1];
    };


    // evaluates an expression that could be either a value, percentage or equation
    // we need the parent width and height to replace 'w' and 'h' in the equation
    // associatedDimension is the parent width or height that percentage values
    // will be calculated against, eg. 20% of parent width as associated dimension.
    function evaluateExpression(expression, pw, ph, associatedDimension){

        if(isEquation(expression)){
           
            //remove whitespace
            expression = expression.replace(/\s+/g, '');

            // replace all occurences of width or w with parent width value
            expression = expression.replace(/width|w/gi, pw);

            // replace all occurences of height or h with parent height value
            expression = expression.replace(/height|h/gi, ph);

            // replace percentage values with decimal values
            var percentages = expression.match(/(\d+)(\.\d+)?\%/g);
            if(percentages){
                // there are at least 1 match for a percentage token 
                
                $.each(percentages, function(){
                    
                    // for each percentage token, parse it and replace it by the result
                    var value = parsePercentage(this, associatedDimension);
                    expression = expression.replace(this, value);
                });
            }
            
            // round all floating point values to integers for postfix conversion
            var floats = expression.match(/\d+\.\d+/g);
            if(floats) {
                // there are at least 1 match for a float token 

                $.each(floats, function(){

                    // for each float token, round it and replace it by the result
                    var value = Math.round(parseFloat(this));
                    expression = expression.replace(this, value);
                });
            }  

            // convert to postfix and proceed to evaluate postfix 
            return evaluatePostfix(toPostfix(expression));
       
        } else {
            // not an equation so just a single value token
            // if it's a percentage, parse and return it
            // otherwise just parse the number value and return it
            return isPercentage(expression) ? parsePercentage(expression, associatedDimension) 
                                            : parseNumber(expression);
        }
    }

    // converts an infix expression such as 2+3+4 to postfix
    // this is required to evaluate the result of an equation
    // we're using tokens instead of single digits and characters,
    // in order to not be limited to single digits only
    function toPostfix(infix){
       
        // create empty stacks for postfix and the processing stack
        // with the initial '(' already pushed to the stack
        var postfix = [];
        var stack = ['('];
                
        // split the expression into tokens
        // for example 200+20+20 -> ['200', '+', '20', '+', '2']
        infix = infix.match(/[\-+*\/()]|\d+/g);
        
        // push initial ')' as per algorithm
        infix.push(')');

        // this is required to keep track of the amount of tokens we've read
        // the alternative is to just use Array.shift, but that shifts the entire 
        // array to the left by one place which isn't necessary in our case.
        var infixReadCount = 0;
        
        while (stack.length > 0) {

            // get next infix token and increment count
            var token = infix[infixReadCount++];

            if (isNumber(token)) {
                // if the token was a number, just push it onto the postfix stack
                postfix.push(token);
            
            } else if (token === '(') {
                // otherwise an open parenthesis, push it onto the stack
                stack.push(token);

            } else if (token === ')') {
                // otherwise a closing parenthesis,
                // while the top of the processing stack is not an opening parenthesis.
                // push onto the postfix stack the top element of the processing stack.
                while (stack.peek() !== '(') {
                    postfix.push(stack.pop());
                }

                // also pop the closing parenthesis
                stack.pop();

            } else {
                // here we can assume that the token is an operator
                
                // while the top of the processing stack is also an operator
                // if that operator has a higher or equal priority than the current token,
                // push it onto postfix, otherwise break out of the while loop.
                while (isOperator(stack.peek())) {
                    if (hasPriority(stack.peek(), token)) {
                        postfix.push(stack.pop());
                    } else {
                        break;
                    }
                }

                // finally push the token onto the processing stack to continue
                stack.push(token);
            }
        }

        // done - returns postfix expression
        return postfix;
    }

    // evaluates a postfix expression and returns its number value
    function evaluatePostfix(postfix) {

        // create empty processing stack
        var stack = [];
       
        $.each(postfix, function(){
            // for each token in the postfix token array
            // if it's a number, push it onto the stack
            // otherwise an operator, pop y first and push
            // onto the stack the result of the calculation

            if(isNumber(this)){
                stack.push(parseFloat(this));
            } else {
                var y = stack.pop(); // y first
                var x = stack.pop();
                stack.push(calculate(x, y, this));
            }
        });

        // the last remaining value is our accumalator and result
        return stack.pop();
    }


    // converts a percentage token to a float
    // parse the token without the % symbol as a float,
    // multiply by 100, and also by the associatedDimension.
    // this is for when the % is to be calculated OF a dimension.
    // eg 20% of 200 where associatedDimension = 200
    // NOTE: if no associatedDimension is specified, just multiply by 1
    function parsePercentage(percentage, associatedDimension) {
        return parseFloat(percentage.slice(0, -1)) / 100 * (associatedDimension || 1);
    }

    // parse string tokens to numbers first to avoid concatenation
    // operator is also an array of 1 element so access with [0]
    // apply operator and return the result
    // if the operator was invalid, log an error message and return NaN
    function calculate(x, y, operator){
        x = parseFloat(x);
        y = parseFloat(y);
        switch(operator[0]){
            case '+' : return x + y;
            case '-' : return x - y;
            case '*' : return x * y;
            case '/' : return x / y;
            default  : {
                window.console.error('Invalid operator:', operator[0]);
                return NaN;
            }
        }
    }
    
    // returns a rounding method option based on the specified rounding option
    function getRoundingMethod(option) {
        switch (option) {
            case 'floor':
                return Math.floor;
            case 'ceiling':
                return Math.ceil;
            default:
                return Math.round;
            }
    }

    // simply returns a value for the operator's precedence order
    function operatorPriority(operator){
        return operator === '*' || operator === '/' ? 1 : 0;
    }

    // returns true if b is not a lower priority than a
    function hasPriority(a, b){
        return operatorPriority(a) >= operatorPriority(b);
    }

    // returns a valid number value or fallback (or 0) on failure to parse.
    function parseNumber(number, fallback) {
            return isNaN(number = parseFloat(number)) ? fallback || 0 : number;
    }

    // returns true if 
    function isNumber(token){
        return (/\d+(\.\d+)?/).test(token);
    }

    // returns true if the token is any of +, -, *, or /.
    function isOperator(token){
        return (/[\-\+\*\/]/).test(token);
    }

    // returns true if the expression contains operators
    // NOTE: identical to isOperator but is more idiomatic
    function isEquation(expression){
        return (/[\-\+\*\/]/).test(expression);
    }

     // returns true if a value is a percentage token
    function isPercentage(value){
        return (/(\d+)(\.\d+)?\%/).test(value);
    }

})(jQuery);