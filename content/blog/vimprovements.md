+++
date = "2015-03-26T07:38:03+02:00"
title = "Vimprovements"
slug = "vimprovements"
description = "Some improvements I made to my day-to-day usage of vim"
tags = ["vim", "plugins", "ctrlp", "movements"]
categories = ["Blablabla", "Software", "Development"]
+++
One part where I always felt (and still feel) that I could improve on my Vim usage, is when moving around. I don't use the mouse, I don't use the arrow keys, but for a while now I felt that spamming hjkl to get from one place to another is not really efficient. To be honest, it is kind of easy to just press down jjjjjjj ... to move down lines. Went a bit too far? Just kk back. But there has to be a better way.

First off, I installed <a href="https://github.com/takac/vim-hardtime">vim-hardtime</a> to break the habit of spamming hjkl. That plugin limits the number of times one can press hjkl in a set time frame. I have it set up to block me from moving for a second after pressing the same motion twice in a row. jj is OK, but if I want to do jjj, well...

And this gets annoying. I want to edit code, not sit around and wait!

<h3>Faster moving around</h3>

I know about relative line numbers. I tried using them. And I guess my brain is just not wired in such a way that I could find relative numbers easy to use.

The second plugin I installed is <a href="https://github.com/Lokaltog/vim-easymotion">vim-easymotion</a>. It is supposed to make moving around in Vim much easier. There's a lot of stuff going on in there, it has a lot of features. For now, I use 2 bits from it - jump to anywhere with <code><leader>s<char></char></code> and <code><leader>k</code> and <code><leader>j</code> to move in lines up and down. I especially like these in visual mode, makes selecting text real nice.

I started using <code>:<line_number><cr></code> more to jump to specific lines, <code>f</code> and <code>F</code> to search on the current line, <code>{</code> and <code>}</code> to move in paragraphs. I'm also more comfortable with general search with <code>/</code> and <code>?</code>.

One other pair of commands that help me reduce spamming jk is <code><ctrl>u</code> and <code><ctrl>d</code> to scroll the window up and down.

<h3>Faster working with files</h3>

The third plugin I installed is <a href="https://github.com/kien/ctrlp.vim">CtrlP</a>. I stumbled upon it in a <a href="http://www.reddit.com/r/vim">/r/vim</a> thread and decided to try it out. Up until then I was using NERDTree exclusively to navigate around files and I can't really remember when was the last time I hit <code><ctrl>n</code> to open it since I have CtrlP. It's just amazing to work with files now.

NERDTree still has it's use cases, for example in a project where I don't really know what files are in there, but for projects on which I work frequently... Oh boy! Wonderful stuff.

I left the default <code><ctrl>p</code> for searching for files, but remapped <code>&lt;tab&gt;</code> to open CtrlP's find buffer mode.

<h3>Misc</h3>

Other stuff I did to make working in Vim more comfortable...

I set leader to be <code><space></code>. I had it as <code>,</code> for a long while, but realised that it's to close on the keyboard to the <code>.</code> and I kept repeating the last command when I actually wanted to do some magical incantation.

I learned about <code>:m[ove]</code> to move and <code>:co[py]</code> to copy lines. Good stuff.

<code>dap</code> and <code>cap</code> pairs are also useful from time to time. They just simply delete, or change, around the current paragraph.

Finally, I added the following bit to my <code>.vimrc</code> to highlight the current line:

{{< highlight bash >}}augroup CursorLine
    au!
    au VimEnter,WinEnter,BufWinEnter * setlocal cursorline
    au WinLeave * setlocal nocursorline
augroup End
{{< /highlight >}}

So, that's pretty much it. I don't think that I'm super fast navigating around in vim, but it's definitely better than some 3 months ago.

Next thing I want to tackle is using registers, and especially macros.

And read more of that nice <code>:help holy-grail</code>.
