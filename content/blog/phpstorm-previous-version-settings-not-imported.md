+++
draft = false
date = 2019-03-29T06:06:04+01:00
title = "PhpStorm previous version settings not imported"
slug = "phpstorm-previous-version-settings-not-imported"
description = "After upgrading PhpStorm to 2019.1 the settings from 2018.3 were not imported"
tags = ["phpstorm", "php", "settings", "ide"]
categories = ["Software", "Development"]
2019 = ["03"]
+++

[PhpStorm 2019.1](https://www.jetbrains.com/phpstorm/whatsnew/) was released yesterday. During the first run after the upgrade PhpStorm usually asks from what previous version would I like to import the settings from, but this time it didn't ask that. It rather imported some of my old settings, but not the latest ones I had for 2018.3.

I've tried to import old settings from the "Import settings" menu, but whatever version I chose, it said something about "can't find settings.zip".

Turns out the fix is to delete the settings folder for the newest version, in my case under Ubuntu it's the `~/.PhpStorm2019.1` folder, start PhpStorm again and this time it should ask about which older settings to import.

Not sure why this happened, it might be due to the fact that I have installed and updated PhpStorm with [snap](https://snapcraft.io/)? In any case, it's fixed now.

Happy hackin'!
