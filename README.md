Content and theme for my website, built with [Hugo](http://gohugo.io/).

# hugo

`~/bin/hugo`

`hugo version`

`hugo server`

`hugo server -D` aliased as `blog`

`hugo new blog/slug-for-post.md` aliased as `blog-new` where `$1` is `slug-for-post`

`fab deploy` aliased as `blog-deploy`

Call `:BlogWrite` in vim to call frontmatter reoder, title to slug and turn on spellcheck.

## bash helpers

Put these in `~/.bashrc`

```
function blog() {
    cd "/home/robert/projects/robertbasic.com-hugo/"
    hugo server -D &> blog.log &
    sleep 3s
    firefox http://localhost:1313/blog/
}

function blog_stop() {
    cd "/home/robert/projects/robertbasic.com-hugo/"
    pkill hugo
    rm blog.log
}
```


# writing

Change case for title: `:4vi"u~`


