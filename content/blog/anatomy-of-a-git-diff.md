+++
draft = false
date = "2016-12-20T12:58:34+01:00"
title = "Anatomy of a git diff"
slug = "anatomy-of-a-git-diff"
description = "A simple example explaining how to read git diffs"
tags = ["git", "diff", "hunk"]
categories = ["Development", "Software"]
2016 = ["12"]

+++

I'm looking at git diffs every day, all day. Diffs hold a lot of information that can be valuable, and I think it's a good thing to know how to fully read a git diff.

A simple diff looks something like this:

``` diff
diff --git a/example.php b/example.php
index a5174a9..11aeb84 100644
--- a/example.php
+++ b/example.php
@@ -11,7 +11,10 @@ class Greeter
         $this->name = $name;
     }
 
-    public function greet()
+    /**
+     * Return the greeting message.
+     */
+    public function greet() : string
     {
         return sprintf("Hello %s" . PHP_EOL, $this->name);
     }
```

This simple example holds most of the information that is needed from a diff.

The first line tells that the diff is in the `git` format and the filename(s) before and after the changes.

The second line tells about the type of file and its permissions (`100644`) and the two hashes are just that - shortened hashes of the pre- and post-images. AFAIK, this line is used when 
doing 3-way merges.

The lines 3 and 4 again deal with the name of the file(s). If it's a new file, the source - `---` - is `/dev/null`, and if an existing file was deleted, the target - `+++` - will be `/dev/null`.

I'll skip line 5 for a moment and come back to it later.

The next part, the actuall diff, shows what lines in the current hunk were added and what lines were removed:

``` diff
         $this->name = $name;
     }
 
-    public function greet()
+    /**
+     * Return the greeting message.
+     */
+    public function greet() : string
     {
         return sprintf("Hello %s" . PHP_EOL, $this->name);
     }
```

Lines that start with a `+` sign were added, and lines with a `-` sign were removed. Lines with no `+` or `-` are here just to give us some context of the code. Looking at this diff we
see that one line was removed and 4 lines were added.

Now back to line 5 as this is probably the hardest part to understand:

``` diff
@@ -11,7 +11,10 @@ class Greeter
```

These numbers always seemed random to me.

This line is, I belive, called "unified diff hunk identifier", and the format of this line is:

``` diff
@@ from-file-range to-file-range @@ [header]
```

which to be honest, isn't that helpful. The `@` signs are just delimiters.

The first pair of numbers, `-11,7`, means that the current hunk in the source file starts at line 11 and has a total of 7 lines.

The starting line can be confirmed in any editor: `$this->name = $name;` really is the 11th line in the edited file. That's easy.

The number 7 means that there are 7 lines in total that have a `-` sign or no sign at all (contextual lines). If we count the number of contextual lines and lines with a `-`,
skipping the lines with the `+` at the beginning, we see the total is 7.

The second pair of numbers, `+11,10` means that the current hunk in the target file starts at line 11 and has a total of 10 lines.

The number 10 means that there are 10 lines in total that have a `+` sign or no sign at all (contextual lines). If we count the number of contextual lines and lines with a `+`,
skipping the lines with the `-` at the beginning, we see the total is 10.

Finally, `class Greeter`, the `[header]` part of this line, tells us were did the change happen. This may, or may not, be present.

This example is a simple one, but I think it covers most of the use cases of a git diff output, and it helps us understand the unified diff hunk identifier line (the line with `@@`s),
which is useful to know, especially when editing git hunks manually.

Happy hackin'!
