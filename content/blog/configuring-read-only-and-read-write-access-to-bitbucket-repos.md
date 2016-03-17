+++
date = "2015-01-30T11:17:13+02:00"
title = "Configuring read-only and read-write access to bitbucket repos"
slug = "configuring-read-only-and-read-write-access-to-bitbucket-repos"
description = "Setting up read-only and read-write access on bitbucket repositories."
tags = ["bitbucket", "ssh", "keys", "setup"]
categories = ["Development"]
2015 = ["01"]
+++

Trying to automate things on my server, I ended up needing read-only for one group of my bitbucket repos and read-write access to another group.

On bitbucket, if read-only access is required for a repository, a <a href='https://confluence.atlassian.com/display/BITBUCKET/Use+deployment+keys'>deployment key</a> can be added for that repository.

Create one ssh key that will be a deployment, read-only key:

{{< highlight bash >}}
user@server$ ssh-keygen -f ~/.ssh/id_rsa_ro -t rsa -C "email@domain.com"
{{< /highlight >}}

and add it to repositories needing read-only access.

Create a second ssh key that will be used for repositories needing read and write access:

{{< highlight bash >}}
user@server$ ssh-keygen -f ~/.ssh/id_rsa_rw -t rsa -C "email@domain.com"
{{< /highlight >}}

and add it as an ssh key under your bitbucket account.

Next, configure ssh a bit, telling it what identity to use for what host by adding something like this to the <code>~/.ssh/config</code> file:

{{< highlight bash >}}
Host bitbucket.org-ro
    HostName bitbucket.org
    IdentityFile ~/.ssh/id_rsa_ro

Host bitbucket.org-rw
    HostName bitbucket.org
    IdentityFile ~/.ssh/id_rsa_rw
Host
{{< /highlight >}}

With all that in place, for repositories where read-only access is needed, set the remote url for the origin like:

{{< highlight bash >}}
git remote set-url origin git@bitbucket.org-ro:user/repo_with_ro_access.git
{{< /highlight >}}

and where read-write access is needed:

{{< highlight bash >}}
git remote set-url origin git@bitbucket.org-rw:user/repo_with_rw_access.git
{{< /highlight >}}

Now for repositories with the <code>bitbucket.org-ro</code> hostname I have read-only access and for repositories with the <code>bitbucket.org-rw</code> hostname read and write access. Neat.
