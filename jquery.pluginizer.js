/**
 * jQuery.Pluginizer
 * Framework for creating specialized jQuery plugins
 * @author Karol Kuczmarski
 */


(function($) {

    $.pluginize = function(name, methods) {
        var fn = {};
        fn[name] = function(arg) {
            var $this = this;
            
            // 'methods' can be a function that returns the methods dictionary
            if (typeof methods === 'function') {
                var data = (function() {
                    // note that the following relies on fact that object passed to $.data()
                    // is stored by as-is and not copied, because we utilize reference to it directly
                    var domData  = $this.data(name) || {};
                    $this.data(name, domData);
                    return domData;
                })();
                
                methods = methods.apply($this, [data]);
            }
            
            // dispatch call to appropriate method
            if (typeof arg === 'string') {
                var method = arg;
                var methodArgs = [].slice.call(arguments, 1);   // omit method name
                if (methods[method])
                    methods[method].apply($this, methodArgs);
                else
                    $.error("Method '" + method + "' does not exist on $." + name);
            }
            else {
                if ('init' in methods)
                    methods.init.apply($this, [arg]);
            }
            
            return $this;
        };
        $.fn.extend(fn);
    };
    
})(jQuery);
