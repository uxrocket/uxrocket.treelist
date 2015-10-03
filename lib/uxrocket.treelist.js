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

        defaults = {
            onReady : false,
            onRemove: false
        },

        events = {
            click        : 'click.uxrTreelist',
            ready        : 'uxrready.uxTreelist',
            collapsed    : 'uxrcollapsed.uxTreelist',
            expanded     : 'uxrexpanded.uxTreelist',
            leafcollapsed: 'uxrleafcollapsed.uxrTreelist',
            remove       : 'uxrremove.uxTreelist'
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

            this.emitEvent('ready');
        },

        prepare: function() {
            this.getRows();

            this.setContents();
            this.setHeaders();
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
                var $leaves = _this.$el.find('[data-uxrtl-parent="' + item.data('uxrtl-id') + '"]');

                item
                    .addClass('uxr-treelist-header')
                    .data('uxrtl-leaves', $leaves);

                if(item.data('active') === true){
                    item.addClass('uxr-treelist-expanded');
                    $leaves.removeClass('uxr-treelist-collapsed');
                }

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
                .on(events.ready, function() {
                    _this.onReady();
                })
                .on(events.remove, function() {
                    _this.onDestroy();
                })
                .on(events.expanded, '.uxr-treelist-header', function() {
                    _this.onBranchExpanded(this);
                })
                .on(events.collapsed, '.uxr-treelist-header', function() {
                    _this.onBranchCollapsed(this);
                })
                .on(events.leafcollapsed, '.uxr-treelist-content', function() {
                    _this.onLeafCollapsed(this);
                });
        },

        unbindUIActions: function() {
            this.$el.off('.' + rocketName);
        },

        expand: function($branch) {
            $branch
                .addClass('uxr-treelist-expanded')
                .trigger('uxrexpanded')
                .data('uxrtl-leaves')
                .removeClass('uxr-treelist-collapsed');
        },

        collapse: function($branch) {
            $branch
                .removeClass('uxr-treelist-expanded')
                .trigger('uxrcollapsed')
                .data('uxrtl-leaves')
                .addClass('uxr-treelist-collapsed')
                .filter('.uxr-treelist-header')
                .trigger('uxrleafcollapsed');
        },

        onReady: function() {
            utils.callback(this.options.onReady);
        },

        onBranchExpanded: function(branch) {
            this.triggerCallback(branch, 'expand');
        },

        onBranchCollapsed: function(branch) {
            this.triggerCallback(branch, 'collapse');
        },

        onLeafCollapsed: function(leaf) {
            var $leaf = $(leaf);

            if($leaf.is('.uxr-treelist-header')) {
                this.collapse($leaf);
            }
        },

        onDestroy: function() {
            utils.callback(this.options.onRemove);
        },

        removeClasses: function() {
            this.$el.removeClass('uxr-treelist-ready');
        },

        destroy: function() {
            return ux.destroy(this.el);
        },

        emitEvent: function(which) {
            this.$el.trigger('uxr' + which);
        },

        triggerCallback: function(el, event) {
            var $el = $(el),
                callback = $el.data('on-' + event) || false;

            utils.callback(callback);
        }
    });

    var utils = {
        callback: function(fn) {
            // if callback string is function call it directly
            if(typeof fn === 'function') {
                fn.apply(this);
            }

            // if callback defined via data-attribute, call it via new Function
            else {
                if(fn !== false) {
                    var _fn = /([a-zA-Z._$0-9]+)(\(?(.*)?\))?/.exec(fn),
                        _fn_ns = _fn[1].split('.'),
                        _args = _fn[3] ? _fn[3] : '',
                        func = _fn_ns.pop(),
                        context = _fn_ns[0] ? window[_fn_ns[0]] : window;

                    for(var i = 1; i < _fn_ns.length; i++) {
                        context = context[_fn_ns[i]];
                    }

                    return context[func](_args);
                }
            }
        },

        getStringVariable: function(str) {
            var val;
            // check if it is chained
            if(str.indexOf('.') > -1) {
                var chain = str.split('.'),
                    chainVal = window[chain[0]];

                for(var i = 1; i < chain.length; i++) {
                    chainVal = chainVal[chain[i]];
                }

                val = chainVal;
            }

            else {
                val = window[str];
            }

            return val;
        },

        getClassname: function(which) {
            return ns.prefix + ns.name + '-' + ns.classes[which];
        }
    };

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

            _instance.unbindUIActions();

            // remove plugin data
            _this.removeData(ns.data);
        });
    };

// version
    ux.version = '0.2.0';

// default settings
    ux.settings = defaults;
}))
;