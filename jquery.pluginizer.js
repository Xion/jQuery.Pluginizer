/**
 * jQuery.Pluginizer
 * Framework for creating specialized jQuery plugins
 * @author Karol Kuczmarski "Xion"
 */


(function($) {

    $.pluginize = function(name, methods, initialData) {
        var fn = {};
        fn[name] = function(arg) {
            var rest = [].slice.call(arguments, 1);

            return this.each(function() {
                var $this = $(this);
            
                // methods can be supplied as a function or as object
                var _methods = methods;
                if (typeof _methods === 'function') {
                    var data = (function() {
                        // note that the following relies on fact that object passed to $.data()
                        // is stored by as-is and not copied, because we utilize reference to it directly
                        var domData  = $this.data(name) || new Object(initialData);
                        $this.data(name, domData);
                        return domData;
                    })();
                    
                    _methods = _methods.apply($this, [data]);
                }
                
                // dispatch call to appropriate method
                if (typeof arg === 'string') {
                    var method = arg;
                    if (_methods[method])
                        _methods[method].apply($this, rest);
                    else
                        $.error("Method '" + method + "' does not exist on $." + name);
                }
                else {
                    if ('init' in _methods)
                        _methods.init.apply($this, [arg]);
                }
            });
        };
        $.fn.extend(fn);
    };
    
})(jQuery);
