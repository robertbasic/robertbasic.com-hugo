+++
date = "2011-04-16T07:29:57+02:00"
title = "Grouping Zend Framework controllers in subdirectories"
slug = "grouping-zend-framework-controllers-in-subdirectories"
description = "A simple example how controllers can be grouped in subdirectories in Zend Framework"
tags = ["controllers", "zend framework"]
categories = ["Development", "Programming"]
+++
<p>Thanks to a <a href="http://zend-framework-community.634137.n4.nabble.com/subcontroller-path-separator-td3446708.html">discussion</a> on the Zend Framework mailing list I learned about a new feature, a feature that allows for grouping action controllers in subdirectories! Well, this is more of an unknown and <a href="http://framework.zend.com/issues/browse/ZF-3590">undocumented</a> feature than new, as it is the part of the framework for at least 3 years.</p>
<div id="" class="wp-caption alignright" style="width: 211"><img alt="Subdirectories example" src="https://lh5.googleusercontent.com/_7vS_Lw8rn0E/Tak8y6iMdcI/AAAAAAAAAlk/jKZ_BpYnUh4/subdirectories.png" title="Subdirectories example" width="211" height="323" /><p class="wp-caption-text">Subdirectories example</p></div>
<p>Why am I so hyped about this? Because it allows for better code organisation on larger projects. Heck, it might be useful on smaller ones too. For example, if a module Foo has both a backend and a frontend, what I was doing so far was to have the file and class names prefixed with an <code>Admin</code> prefix for the backend files and no prefix for the frontend files, so I can actually see what file belongs where. This can go out of control quite easily.</p>
<p>On the other hand, with this grouping of controllers I can make an <code>Admin</code> directory and just place all the backend related controllers there. Easy, clean and much more easier to see what's where. In my opinion at least :)</p>
<h3>Example</h3>
<p>Best part is that this feature requires no additional configuration. Create a subdirectory under the controllers directory and place the controller file under that subdirectory. In that pretty screenshot image you can see a <code>FooController.php</code> in the directory called <code>Sub</code>; the class name in that example is <code>Sub_FooController</code> and is accessible via the <code>sub_foo/controller</code> URI. The corresponding view files should be placed in <code>views/scripts/sub/foo/</code> directory.</p>
<p>A few notes on this:</p>
<ul>
<li>the subdirectory separator in the URI is the underscore and not the slash.</li>
<li>The subdirectory name is uppercase: Subdirectory, not subdirectory. In the URI it's lowercase.</li>
<li>The view directories for these subdirectories are lowercased, and not uppercase.</li>
</ul>
<p>The uppercase subdirectory sounds weird, but meh. If needed, the underscore can be "changed" to the slash with a route.</p>
<p>I think the level of possible subdirectories is not limited, but I really can't see an use-case for more than one subdirectory.</p>
<p>Happy hackin'!</p>
