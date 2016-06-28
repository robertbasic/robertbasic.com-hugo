+++
draft = true
date = "2016-06-27T06:19:28+02:00"
title = "Creating a PostgreSQL user in Ansible"
slug = "creating-a-postgresql-user-in-ansible"
description = ""
tags = [""]
categories = [""]
2016 = ["06"]

+++
Lately I've been playing around with provisioning a PostgreSQL server with Ansible in a local Vagrant machine that runs a Fedora 23 image.

The first task after installing and starting the PostgreSQL server is to create a database user and a database. So far I have found an ugly way, a really ugly way and a nice way to do this.

## How it should be done

The proper way to do this would be to use the `postgresql_user` Ansible module and the `become`, `become_user` and `become_method` directives, like so:

``` yaml
- name: Create a PostgreSQL database user
  postgresql_user: name=project password=project role_attr_flags=CREATEDB state=present
  become: yes
  become_user: postgres
  become_method: sudo
```

But this fails because `sudo` expects us to enter the password:

``` bash
TASK [postgresql : Create user] ************************************************
fatal: [default]: FAILED! => {"changed": false, "failed": true, "module_stderr": "", "module_stdout": "sudo: a password is required\r\n", "msg": "MODULE FAILURE", "parsed": false}
```

## The really ugly way

This solution is so bad I'm not even sure I should write it down. It depends on changing the default identification method for `local` connections from `peer` to the `trust` method, so we can use the default `vagrant` user to create new users without any checks, based only on, well, trust.

``` yaml
- name: Change peer identification to trust
  shell: /bin/sed -i '/^local/s/peer/trust/' /var/lib/pgsql/data/pg_hba.conf
  notify: restart dbserver

- meta: flush_handlers

- name: Create a PostgreSQL database user
  postgresql_user: name=project password=project role_attr_flags=CREATEDB state=present

- name: Change trust identification back to peer
  shell: /bin/sed -i '/^local/s/trust/peer/' /var/lib/pgsql/data/pg_hba.conf
  notify: restart dbserver

- meta: flush_handlers
```

This is just bad, there must be a better way.

## The less ugly way

But still ugly. This is based on running a `psql` command using the `shell` Ansible module.

``` yaml
- name: Create a PostgreSQL database user
  shell: sudo -u postgres bash -c "psql -c \"CREATE USER project WITH CREATEDB PASSWORD 'project';\""
```

This one has an additional problem of that it only works when we run it for the first time, because we can't create the same user twice. A possible solution would be to wrap the `CREATE USER ...` in an additional `IF NOT EXISTS (SELECT * FROM pg_catalog.pg_user ...` query, but that's just... Ugh. No.

## Back to square one

Let's go back to the way how it should be done, by using the `become` and `become_user` directives. But how do we handle the sudo password? We tell sudo to not ask for a password by editing the `/etc/sudoers` files. The line to add is:

``` bash
vagrant ALL=(postgres) NOPASSWD:/bin/sh
```

This tells sudo that the user `vagrant` on `ALL` hosts can run the `/bin/sh` program with `NOPASSWD` as the user `postgres`. I'm explicitly limiting the possible commands to `/bin/sh` as that is the only command we need to be able to run to make things work. I don't want to add more if I don't need to.

The Ansible tasks are now:

``` yaml
- name: Enable passwordless sudo
  lineinfile: dest=/etc/sudoers regexp=^vagrant line="vagrant ALL=(postgres) NOPASSWD:/bin/sh"

- name: Create a PostgreSQL database user
  postgresql_user: name=project password=project role_attr_flags=CREATEDB state=present
  become: yes
  become_user: postgres
  become_method: sudo
```

For added bonus we can cleanup the sudoers file after we are done by removing the line we added.

Happy hackin'!
