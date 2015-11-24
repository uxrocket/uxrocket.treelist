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

        defaults   = {
            header:  '',
            content: '',
            toggle:  '',

            onReady:  false,
            onRemove: false
        },

        events     = {
            click:         'click.' + rocketName,
            ready:         'uxrready.uxTreelist',
            collapsed:     'uxrcollapsed.uxTreelist',
            expanded:      'uxrexpanded.uxTreelist',
            leafcollapsed: 'uxrleafcollapsed.' + rocketName,
            remove:        'uxrremove.uxTreelist'
        },

        ns         = {
            prefix:  'uxr-',
            rocket:  'uxRocket',
            data:    rocketName,
            name:    'treelist',
            id:      'uxrtl-id',
            parent:  'uxrtl-parent',
            leaves:  'uxrtl-leaves',
            classes: {
                ready:     'ready',
                header:    'header',
                toggle:    'toggle',
                expanded:  'expanded',
                collapsed: 'collapsed',
                content:   'content',
                arrow:     'arrow'
            }
        };

    var Treelist = function(el, options, selector) {
        this._name     = rocketName;
        this._defaults = defaults;

        this.el       = el;
        this.$el      = $(el);
        this.options  = $.extend(true, {}, defaults, options, this.$el.data());
        this.selector = selector;
        this.headers  = [];
        this.contents = [];

        this.init();
    };

    $.extend(Treelist.prototype, {
        init: function() {
            this.$el.addClass(utils.getClassname('ready'));
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
            var _this   = this,
                headers = [];

            this.$rows.filter('[data-' + ns.parent + ']').map(function(item) {
                var _parentID = $(this).data(ns.parent);

                _this.contents.push($(this));

                if(headers.indexOf(_parentID) < 0) {
                    headers.push(_parentID);
                    _this.headers.push(_this.$rows.filter('[data-' + ns.id + '="' + _parentID + '"]'));
                }
            });
        },

        setHeaders: function() {
            var _this  = this,
                toggle = _this.options.toggle || utils.getClassname('toggle');

            this.headers.map(function(item) {
                var $leaves = _this.$el.find('[data-' + ns.parent + '="' + item.data(ns.id) + '"]');

                item
                    .addClass(utils.getClassname('header') + ' ' + _this.options.header)
                    .data(ns.leaves, $leaves)
                    .children(0).prepend('<span class="' + utils.getClassname('arrow') + '"></span>');

                if(item.data('active') === true) {
                    item.addClass(utils.getClassname('expanded'));
                    $leaves.removeClass(utils.getClassname('collapsed'));
                }

                if(item.find('> .' + toggle).length === 0) {
                    item.addClass(utils.getClassname('toggle'));
                }
                else {
                    item.find('> .' + toggle).addClass(utils.getClassname('toggle'));
                }
            });
        },

        setContents: function() {
            var _this = this;

            this.contents.map(function(item) {
                item.addClass(utils.getClassname('content') + ' ' + utils.getClassname('collapsed') + ' ' + _this.options.content);
            });
        },

        bindUIActions: function() {
            var _this = this;


            _this.$el
                .on(events.click, '.' + utils.getClassname('toggle'), function(e) {
                    e.preventDefault();

                    var $branch = $(this).is('.' + utils.getClassname('header')) ? $(this) : $(this).parent();

                    if($branch.is('.' + utils.getClassname('expanded'))) {
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
                .on(events.expanded, '.' + utils.getClassname('header'), function() {
                    _this.onBranchExpanded(this);
                })
                .on(events.collapsed, '.' + utils.getClassname('header'), function() {
                    _this.onBranchCollapsed(this);
                })
                .on(events.leafcollapsed, '.' + utils.getClassname('content'), function() {
                    _this.onLeafCollapsed(this);
                });
        },

        unbindUIActions: function() {
            this.$el.off('.' + rocketName);
        },

        expand: function($branch) {
            $branch
                .addClass(utils.getClassname('expanded'))
                .trigger('uxrexpanded')
                .data(ns.leaves)
                .removeClass(utils.getClassname('collapsed'));
        },

        collapse: function($branch) {
            $branch
                .removeClass(utils.getClassname('expanded'))
                .trigger('uxrcollapsed')
                .data(ns.leaves)
                .addClass(utils.getClassname('collapsed'))
                .filter('.' + utils.getClassname('header'))
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

            if($leaf.is('.' + utils.getClassname('header'))) {
                this.collapse($leaf);
            }
        },

        onDestroy: function() {
            utils.callback(this.options.onRemove);
        },

        removeClasses: function() {
            this.$el.removeClass(utils.getClassname('ready'));
        },

        destroy: function() {
            return ux.destroy(this.el);
        },

        emitEvent: function(which) {
            this.$el.trigger('uxr' + which);
        },

        triggerCallback: function(el, event) {
            var $el      = $(el),
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
                    var func = new Function('return ' + fn);
                    func();
                }
            }
        },

        getStringVariable: function(str) {
            var val;
            // check if it is chained
            if(str.indexOf('.') > -1) {
                var chain    = str.split('.'),
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
            var _this     = $(this),
                _instance = _this.data(ns.data);

            // remove ready class
            _instance.removeClasses('uxr-treelist-ready');

            _instance.unbindUIActions();

            // remove plugin data
            _this.removeData(ns.data);
        });
    };

// version
    ux.version = '0.5.0';

// default settings
    ux.settings = defaults;
}));