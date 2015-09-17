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
            click    : 'click.uxrTreelist',
            collapsed: 'collapsed.uxTreelist',
            expanded : 'expanded.uxTreelist'
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
        this.headers = [];
        this.contents = [];

        this.init();
    };

    $.extend(Treelist.prototype, {
        init: function() {
            this.$el.addClass('uxr-treelist-ready');
            this.$rows = this.$el.find('> thead > tr, > tbody > tr, > tr');

            this.prepare();

            this.bindUIActions();
        },

        prepare: function() {
            this.getRows();

            this.setHeaders();
            this.setContents();
        },

        getRows: function() {
            var _this = this,
                headers = [];

            this.$rows.filter('[data-uxrtl-parent]').map(function(item) {
                var _parentID = $(this).data('uxrtl-parent');

                _this.contents.push($(this));


                if(headers.indexOf(_parentID) < 0) {
                    headers.push(_parentID);
                    _this.headers.push(_this.$rows.filter('[data-uxrtl-id="' + _parentID + '"]'));
                }
            });
        },

        setHeaders: function() {
            var _this = this;

            this.headers.map(function(item) {
                item
                    .addClass('uxr-treelist-header')
                    .data('uxrtl-leaves', _this.$el.find('[data-uxrtl-parent="' + item.data('uxrtl-id') + '"]'));

                if(item.find('> .uxr-treelist-toggle').length === 0) {
                    item.addClass('uxr-treelist-toggle');
                }
            });
        },

        setContents: function() {
            this.contents.map(function(item) {
                item.addClass('uxr-treelist-content uxr-treelist-collapsed');
            });
        },

        bindUIActions: function() {
            var _this = this;

            _this.$el
                .on(events.click, '.uxr-treelist-toggle', function(e) {
                    e.preventDefault();

                    var $branch = $(this).is('.uxr-treelist-header') ? $(this) : $(this).parent();

                    if($branch.is('.uxr-treelist-expanded')) {
                        _this.collapse($branch);
                    }
                    else {
                        _this.expand($branch);
                    }
                })
                .on(events.collapsed, '.uxr-treelist-content', function() {
                    _this.onCollapsed(this);
                });
        },

        expand: function($branch) {
            $branch.addClass('uxr-treelist-expanded');
            $branch.data('uxrtl-leaves').removeClass('uxr-treelist-collapsed');
        },

        collapse: function($branch) {
            $branch.removeClass('uxr-treelist-expanded');
            $branch.data('uxrtl-leaves').addClass('uxr-treelist-collapsed').trigger('collapsed');
        },

        onCollapsed: function(leaf) {
            var $leaf = $(leaf);

            if($leaf.is('.uxr-treelist-header')) {
                this.collapse($leaf);
            }
        },

        removeClasses: function() {
            this.$el.removeClass('uxr-treelist-ready');
        },

        destroy: function() {
            return ux.destroy(this.el);
        }
    });

    ux = $.fn.treelist = $.fn.uxrtreelist = $.uxrtreelist = function(options) {
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
                _instance = _this.data(ns.data);

            // remove ready class
            _instance.removeClasses('uxr-treelist-ready');

            // remove branch info
            _this.headers.removeData('uxrtl-leaves');

            // remove plugin data
            _this.removeData(ns.data);
        });
    };

// version
    ux.version = '0.1.0';

// default settings
    ux.settings = defaults;
}));