+++
draft = false
date = "2016-06-16T19:37:48+02:00"
title = "Import custom Python modules in Vim plugins"
slug = "import-custom-python-modules-in-vim-plugins"
description = "Import custom Python modules in Vim plugins"
tags = ["vim", "python", "plugin"]
categories = ["Programming", "Development"]
2016 = ["06"]

+++
This took me a while to figure out so I'm writing it down for future self and anyone else who needs it.

I started writing a new Vim plugin that will use the Python interface as most of the work will be done there, mostly to keep my sanity.

Having a plugin layout such as:

``` bash
.
├── lib
│   └── mypymodule
│       └── ham.py
└── plugin
    └── my-vim-plugin.vim
```

I want to be able to do a

``` python
from mypymodule import ham
```

from within the `my-vim-plugin.vim` file.

For that to happen the `<sfile>` command line special comes to rescue. It is the file name of the sourced file in Vim, that is, the file name of the Vim plugin. Using the `:p` and `:h` file name modifiers it gives us the full path to the plugin directory of our plugin.

``` vim
" This will give something like
" /home/robert/projects/my-vim-plugin/plugin
let g:plugin_path = expand('<sfile>:p:h')
```

And here comes the kicker: the `<sfile>` needs to be expanded outside of our Vim function where it is used, otherwise the `<sfile>` points to the path of the file that called the Vim function.

In code, this would be incorrect:

``` vim
" ./plugin/my-vim-plugin.vim
function! MyVimPlugin()
python << endpython

import vim

vim.command("let a:plugin_path = expand('<spath>:p:h')
plugin_path = vim.eval("a:plugin_path")
print plugin_path

endpython
endfunction
```

because it would end up printing the current working directory from where the `MyVimPlugin` function is called.

The correct way to do is:

``` vim
" ./plugin/my-vim-plugin.vim
let g:plugin_path = expand('<spath>:p:h')

function! MyVimPlugin()
python << endpython

import vim

vim.command("let a:plugin_path = expand('<spath>:p:h')
plugin_path = vim.eval("a:plugin_path")
print plugin_path

endpython
endfunction
```

Finally, to be able to import the `mypymodule` from the lib, we need to point to the `lib` directory and add it to the system paths. Complete example:

``` vim
" ./plugin/my-vim-plugin.vim
let g:plugin_path = expand('<spath>:p:h')

function! MyVimPlugin()
python << endpython

import os
import sys
import vim

" Get the Vim variable to Python
plugin_path = vim.eval("g:plugin_path")
" Get the absolute path to the lib directory
python_module_path = os.path.abspath('%s/../lib' % (plugin_path))
" Append it to the system paths
sys.path.append(python_module_path)

" And import!
from mypymodule import ham

endpython
endfunction
```

By the way, the here's the [documentation for the Vim](http://vimdoc.sourceforge.net/htmldoc/if_pyth.html) Python module.

Happy hackin'!
