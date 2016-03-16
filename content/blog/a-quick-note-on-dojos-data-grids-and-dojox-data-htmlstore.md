+++
date = "2011-12-23T21:52:10+02:00"
title = "A quick note on Dojo's data grids and dojox.data.HtmlStore"
slug = "a-quick-note-on-dojos-data-grids-and-dojox-data-htmlstore"
description = "A quick note on a stupid error I made with dojox.grid.DataGrid and dojox.data.HtmlStore"
tags = ["data grid", "dojo", "dojo store", "htmlstore"]
categories = ["Development", "Programming"]
+++
<p>I'm spending this day trying to create an "universal" administration dashboard with which I'll finally be happy with. I'm using <a href="http://dojotoolkit.org/">Dojo</a> to spice up the UI, because I think it's awesome and it has a lot of stuff in it and plays well with Zend Framework. This post is dedicated to the future stupid me.</p>
<p>Anyway, when using <a href="http://dojotoolkit.org/reference-guide/dojox/data/HtmlStore.html#dojox-data-htmlstore">dojox.data.HtmlStore</a> as a store for a <a href="http://dojotoolkit.org/reference-guide/dojox/grid/DataGrid.html#dojox-grid-datagrid">dojox.data.DataGrid</a> (or any other grid, really), pay attention to the definition of the columns structure which is passed to the grid. I was doing a really stupid thing which cost me a bunch of hours until I finally figured out what was going on.</p>
<p>Let's take for example this is the given HTML table:</p>
<pre name="code" class="php">
&lt;table id="datastore"&gt;
&lt;thead&gt;
  &lt;tr&gt;
    &lt;th&gt;ID&lt;/th&gt;
    &lt;th&gt;Name&lt;/th&gt;
  &lt;/tr&gt;
&lt;/thead&gt;
&lt;tbody&gt;
  &lt;!-- body comes here --&gt;
&lt;/tbody&gt;
&lt;/table&gt;
</pre>
<p>I was defining the structure for the columns as:</p>
<pre name="code" class="php">
var struct = [[
   { field: 'id', name: 'ID', width: 'auto' },
   { field: 'name', name: 'Name', width: 'auto'}
]];
</pre>
<p>which was wrong. This is the correct one:</p>
<pre name="code" class="php">
var struct = [[
   { field: 'ID', name: 'ID', width: 'auto' },
   { field: 'Name', name: 'Name', width: 'auto'}
]];
</pre>
<p>Use what's in the <strong>TH tags</strong> for the <strong>field</strong> properties! I was trying to be clever and use the name of the fields in the database. The worst part is that there will be no errors, the grid will render correctly the header row and a correct number of rows for the data, but! it will show "..." in each column, instead of the actual data.</p>
<p>Happy hackin'!</p>
