# UX Rocket Treelist
UX Rocket Treelist component provides an expandable/collapsible row systems for the tables. Semantically, all rows are in the same level but visually they are bound with `id` and *parent*/*child* relation.

## Installation
According to your usage, you can use directly __dist__ version or, add __lib__ to your project. First you need to checkout the packages from either [npm](https://www.npmjs.com/) or [bower](https://bower.io)

__npm__
```Shell
npm install uxrocket.treelist
```

or __bower__
```Shell
bower install uxrocket.treelist
```

## For Development
If you want to add your project source, import JS and Sass files in __lib__ folder to your project. For the Sass files, use `_uxrocket-treelist.scss` partial file instead of `uxrocket.treelist.scss`

```SCSS
// styles.scss
// Plugin styles
@import "<path-to-treelist>/lib/_uxrocket-treelist";

// Your project styles
```

```JS
// app.js
// If you use Grunt or Gulp, add <path-to-treelist>/lib/uxrocket.treelist.js to your config
// For Codekit or similar tools
// @codekit-append '<path-to-treelist>/lib/uxrocket.treelist.js'
```

## For Direct Usage
In your __HTML__ after jQuery add `uxrocket.treelist.min.js` and add styles to your `head` 
```HTML
<head>
    ...
    <link rel="stylesheet" href="<path-to-treelist>/dist/uxrocket.treelist.min.css" />
    <script src="<path-to-jquery>/jquery.js"></script>
    <script src="<path-to-treelist>/dist/uxrocket.treelist.min.js"></script>
    ...
</head>
```

## Usage
Sample HTML structure as follows,

```HTML
<table class="treelist" data-on-destroy="console.log('removed')">
    <thead>
        <tr>
            <th>Name</th>
            <th>Version</th>
            <th>Type</th>
        </tr>
    </thead>
    <tbody>
        <tr data-uxrtl-id="1" data-on-expand="console.log('expanded')">
            <td class="uxr-treelist-toggle">UX Rocket Treelist</td>
            <td>0.1.0</td>
            <td>Plugin</td>
        </tr>
        <tr data-uxrtl-id="2" data-uxrtl-parent="1">
            <td>jQuery</td>
            <td>Latest</td>
            <td>Dependency</td>
        </tr>
        <tr data-uxrtl-id="3" data-active="true">
            <td>UX Rocket Autocomplete</td>
            <td>2.0.2</td>
            <td>Plugin</td>
        </tr>
        <tr data-uxrtl-id="4" data-uxrtl-parent="3">
            <td>jQuery</td>
            <td>Latest</td>
            <td>Dependency</td>
        </tr>
        <tr data-uxrtl-id="5">
            <td>UX Rocket Modal</td>
            <td>0.8.0</td>
            <td>Plugin</td>
        </tr>
    </tbody>
</table>
```

After preparing above HTML, bind plugin to your table
```JavaScript
$(function(){
    // standard
    $('.treelist').treelist();
});
```
By default, _treelist_ does not have a configurable options. You can define, `onReady` and `onRemove` callbacks for related events. However, you can add options via `data` attributes to nodes.

### Options
Property			 | Default		 | Description
-------------- | ----------- | ------------------------------------------------------------------------
header         | null        | Custom class names for parent rows
content        | null        | Custom class names for child rows
toggle         | null        | Custom class names for toggle

Data Attributes   | Description
----------------- | ------------------------------------------------------------------------
data-on-expand    | Function/method called after parent row expaned. Applies to parent row
data-on-collapse  | Function/method called after parent row collapsed. Applies to parent row
data-active       | If set `true` parent row and its sub rows will be expanded on load.
data-uxrtl-id     | Generic ID attribute for rows. Only required if row is a parent
data-uxrtl-parent | Parent ID for the child rows. Required for obtaining parent/child relation
data-on-ready     | Function called after plugin binded to table. Applies to table itself
data-on-remove    | Function called when plugin destroyed. Applies to table itself

Callback			 | &nbsp;
-------------- | ------------------------------------------------------------------------
onReady 			 | Function called after plugin binded to table. Applies to table itself
onRemove			 | Function called when plugin destroyed. Applies to table itself

Events   			   | &nbsp;
---------------- | -----
uxrready         | Triggered when plugin bind to table
uxrexpanded      | Triggered when a row expanded
uxrcollapsed     | Triggered when a row collapsed
uxrleafcollapsed | Triggered when a child row, is also a parent row, collapsed
uxrremove        | Triggered when plugin destroyed/removed from table

### Public Methods
Method						     | Description
----------------------------- | -------------------------------------------------------
$(selector).treelist(options) | Binds plugin to a table
$.uxrtreelist                 | Plugin name
$.uxrtreelist.version         | Displays the plugin version
$.uxrtreelist.settings        | Displays the default plugin settings