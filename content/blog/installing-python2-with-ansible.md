+++
draft = false
date = "2016-06-29T07:45:15+02:00"
title = "Installing Python2 with Ansible"
slug = "installing-python2-with-ansible"
description = "Short post on how to install python2 packages on Ansible managed Fedora machines"
tags = ["ansible", "python", "fedora", "provisioning", "vagrant"]
categories = ["Development", "Software"]
2016 = ["06"]

+++
Ansible uses Python2 to run the provisioning commands on the host machines. At this time it does not support Python3, which is the default python version in Fedora releases for quite some time now.

So to be able to manage Fedora machines with Ansible, I need to install Python2, but how to install it when all the Ansible modules depend on Python2 being installed? Turns out it's quite simple, by turning of the [gathering of facts](http://docs.ansible.com/ansible/playbooks_variables.html#turning-off-facts) in Ansible and using the `raw` module to install the required packages:

``` yaml
- hosts: all
  gather_facts: no
  become: yes
  tasks:
    - name: Install python2 and python2-dnf
      raw: dnf -y install python2 python2-dnf
    - name: Gather facts
      setup:
```

Just remember this needs to be the very first thing that happens on all your Fedora hosts. After `python2` is installed, gather the facts for all the hosts by running the `setup` module.

Happy hackin'!
