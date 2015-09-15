/**
 * UX Rocket TreeList
 * Treeview in Tables
 * @author Bilal Cinarli
 */

(function(factory) {
    'use strict';
    if(typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if(typeof exports === 'object' && typeof require === 'function') {
        // Browserify
        factory(jQuery);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($) {
    'use strict';

    var ux,
        rocketName = 'uxrTreelist',

        defaults = {},

        events = {
            click: 'click.uxrTreelist'
        },

        ns = {
            prefix: 'uxr-',
            rocket: 'uxRocket',
            data  : rocketName,
            name  : 'treelist'
        };

    var Treelist = function(el, options, selector) {
        this._name = rocketName;
        this._defaults = defaults;

        this.el = el;
        this.$el = $(el);
        this.options = $.extend(true, {}, defaults, options, this.$el.data());
        this.selector = selector;

        this.init();
    };

    $.extend(Treelist.prototype, {
        init: function() {
            this.$el.addClass('uxr-treelist-ready');
        },

        removeClasses: function() {
            this.$el.removeClass('uxr-treelist-ready');
        },

        destroy: function() {
            return ux.destroy(this.el);
        }
    });

    ux = $.fn.treelist = $.fn.uxrtreelist = $.uxrpreloader = function(options) {
        var selector = this.selector;

        return this.each(function() {
            if($.data(this, ns.data)) {
                return;
            }

            // Bind the plugin and attach the instance to data
            $.data(this, ns.data, new Treelist(this, options, selector));
        });
    };

    ux.destroy = function(el) {
        var $el = el !== undefined ? $(el) : $('.uxr-treelist-ready');

        $el.each(function() {
            var _this = $(this),
                _instance = _this.data(ns.data),
                _uxrocket = _this.data(ns.rocket);

            // remove ready class
            _instance.removeClasses('uxr-treelist-ready');

            // remove plugin data
            _this.removeData(ns.data);
        });
    };

// version
    ux.version = '0.1.0';

// default settings
    ux.settings = defaults;
}));