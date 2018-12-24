+++
draft = false
date = 2018-12-24T11:27:04+01:00
title = "Ignore Errors in Makefile"
slug = "ignore-errors-in-makefile"
description = "Use a dash in front of a recipe in a Makefile to ignore errors"
tags = ["make", "makefile", "errors"]
categories = ["Development"]
2018 = ["12"]
+++

I've been using Make and Makefiles quite extensively over the past few months in my personal projects. One of the make targets I have is to run Behat tests:

 - run Doctrine migrations to create the database,
 - run the Behat tests,
 - run Doctrine migrations to tear down the database.

```Makefile
.PHONY: e2e-tests
e2e-tests:
	docker-compose exec php-fpm /application/bin/console doctrine:migrations:migrate -n -q --env=test
	docker-compose exec php-fpm /application/vendor/bin/behat --verbose
	docker-compose exec php-fpm /application/bin/console doctrine:migrations:migrate first -n -q --env=test
```

This works great, but today I ended up chasing a weird data related bug which at first I didn't tie to the Makefile. In this case, whenever there was a failure in one of the Behat tests, the Doctrine migration to tear down the database didn't happen, leaving bad data in the test database lying around.

The solution is to tell Make to [ignore errors](http://www.gnu.org/software/make/manual/make.html#Errors) from the Behat recipe. By prepending that recipe with a dash `-`, Make doesn't stop if there's a failure in the Behat tests and goes on to tear down the database:

```Makefile
.PHONY: e2e-tests
e2e-tests:
	docker-compose exec php-fpm /application/bin/console doctrine:migrations:migrate -n -q --env=test
	- docker-compose exec php-fpm /application/vendor/bin/behat --verbose
	docker-compose exec php-fpm /application/bin/console doctrine:migrations:migrate first -n -q --env=test
```

Make will still print out that one of the recipes for the target failed and that there were ignored errors:

```text
Makefile:24: recipe for target 'e2e-tests' failed
make: [e2e-tests] Error 1 (ignored)
```

Happy hackin'!
