+++
draft = false
date = 2018-07-19T06:17:30+02:00
title = "Legacy code is 3rd party code"
slug = "legacy-code-is-3rd-party-code"
description = "Think of your legacy code the same way you think about your 3rd party code"
tags = ["legacy", "design", "code"]
categories = ["Programming", "Development", "Blablabla"]
2018 = ["07"]
+++

Within the TDD community there's an advice saying that we [shouldn't mock types we don't own](https://github.com/mockito/mockito/wiki/How-to-write-good-tests#dont-mock-type-you-dont-own). I believe it is good advice and do my best to follow it. Of course, there are people who say that we shouldn't mock in the first place. Whichever TDD camp you're in I think this "don't mock what you don't own" advice has an even better advice hidden in it. An advice that people often overlook because they see the word "mock" in it and go full berserk.

This hidden advice is that we should create interfaces, clients, bridges, adapters between our application and the 3rd party code we use. Will we create mocks from those interfaces in our tests doesn't even matter that much. What matters is that we create and use these interfaces so that our application is better decoupled from the 3rd party code. A classic example of this in the PHP world would be to create and use an HTTP client within the application that uses the [Guzzle HTTP client](https://github.com/guzzle/guzzle), instead of using the Guzzle client directly in the application code.

Why? Well, for one, Guzzle has a much bigger public API than what your application (in most cases) needs. Creating a custom HTTP client that exposes only the required subset of Guzzle's API will limit what the application developers can do with it. If Guzzle's API changes in the future, we'll have to change how we call it in only one place, instead of trying to make the required changes in the entire application and hope that we broke nothing. Two very good reasons and I haven't even mentioned mocks! *gasp*

I don't think this is that hard to achieve. 3rd party code lives in a separate folder from our application code, usually in `vendor/` or `library/`. It also has a different namespace and naming convention than our application code. It is fairly easy to spot 3rd party code and with a bit of a discipline we can make our application code less dependant on 3rd parties.

## What if we apply the same rule to legacy code?

What if we start looking at our legacy code the same way we look at the 3rd party code? This might be difficult to do, or even counterproductive, if the legacy code is in a maintenance-only mode, where we only fix bugs and tweak bits and pieces of it. But if we are writing new code that is (re)using legacy code, I believe we should look at legacy code the same way we look at 3rd party code, at least from the perspective of the new code.

If at all possible legacy and new code should live in different folders and use different namespaces. It's been a long time since I last saw a system *without* autoloading so this is doable. But instead of just blindly using legacy code within the new code, what if we create interfaces for the legacy code and use those in the new code?

Legacy code is all too often full of "god" objects that do way too many things. They reach out to global state, have public properties or magic methods that expose privates as if they were public, have static methods that are just **so convenient** to call from anywhere and everywhere. Well, guess what? That convenience got us in this situation in the first place.

Another, maybe an even bigger issue with legacy code is that we are so ready to change it, fix it, hack it, because we don't see it as a 3rd party code. What do we do when we see a bug or when we want to add a new feature to 3rd party code? We open up an issue and/or create a pull request. What we **don't do** is go inside the `vendor/` folder and make our changes there. Why would we do that to legacy code? And then we cross our fingers and hope we didn't break anything.

Instead of blindly using legacy code within new code, let's try writing interfaces that will expose only the required subset of the legacy "god" object's API. Say we have a `User` object in the legacy code that knows everything about everyone. It knows how to change emails and passwords, how to promote forum members to moderators, how to update a user's public profile, set notification settings, how to save itself, and so much more.

<div class="filename">src/Legacy/User.php</div>

``` php
<?php
namespace Legacy;
class User
{
    public $email;
    public $password;
    public $role;
    public $name;

    public function promote($newRole)
    {
        $this->role = $newRole;
    }

    public function save()
    {
        db_layer::save($this);
    }
}

```

It's a crude example, but shows the problems: every property is public and can be easily changed to whatever value, we have to remember to explicitly call the `save` method after any change for these changes to persist, etc.

Let's limit and prohibit ourselves from reaching out to those public properties and having to guess how does the legacy system work any time we want to promote a user:

<div class="filename">src/LegacyBridge/Promoter.php</div>

``` php
<?php
namespace LegacyBridge;
interface Promoter
{
    public function promoteTo(Role $role);
}
```

<div class="filename">src/LegacyBridge/LegacyUserPromoter.php</div>

``` php
<?php
namespace LegacyBridge;
class LegacyUserPromoter implements Promoter
{
    private $legacyUser;
    public function __construct(Legacy\User $user)
    {
        $this->legacyUser = $user;
    }

    public function promoteTo(Role $newRole)
    {
        $newRole = (string) $newRole;
        // I guess you thought $role in legacy is a string? Guess again!
        $legacyRoles = [
            Role::MODERATOR => 1,
            Role::MEMBER => 2,
        ];
        $newLegacyRole = $legacyRoles[$newRole];
        $this->legacyUser->promote($newLegacyRole);
        $this->legacyUser->save();
    }
}
```

Now when we want to promote a `User` from the new code we use this `LegacyBridge\Promoter` interface that deals with all the details of promoting a user within the legacy system.

## Change the language of the legacy

An interface for the legacy code gives us an opportunity to improve the design of the system. An interface can free us from any potential naming mistakes we did in the legacy. The process of changing a user's role from a moderator to a member is not a "promotion", but rather a "demotion". Nothing stops us from creating two interfaces for these two different things, even though the legacy code sees it the same:

<div class="filename">src/LegacyBridge/Promoter.php</div>

``` php
<?php
namespace LegacyBridge;
interface Promoter
{
    public function promoteTo(Role $role);
}
```

<div class="filename">src/LegacyBridge/LegacyUserPromoter.php</div>

``` php
<?php
namespace LegacyBridge;
class LegacyUserPromoter implements Promoter
{
    private $legacyUser;
    public function __construct(Legacy\User $user)
    {
        $this->legacyUser = $user;
    }

    public function promoteTo(Role $newRole)
    {
        if ($newRole->isMember()) {
            throw new \Exception("Can't promote to a member.");
        }
        $legacyMemberRole = 2;
        $this->legacyUser->promote($legacyMemberRole);
        $this->legacyUser->save();
    }
}
```


<div class="filename">src/LegacyBridge/Demoter.php</div>

``` php
<?php
namespace LegacyBridge;
interface Demoter
{
    public function demoteTo(Role $role);
}
```

<div class="filename">src/LegacyBridge/LegacyUserDemoter.php</div>

``` php
<?php
namespace LegacyBridge;
class LegacyUserDemoter implements Demoter
{
    private $legacyUser;
    public function __construct(Legacy\User $user)
    {
        $this->legacyUser = $user;
    }

    public function demoteTo(Role $newRole)
    {
        if ($newRole->isModerator()) {
            throw new \Exception("Can't demote to a moderator.");
        }
        $legacyModeratorRole = 1;
        $this->legacyUser->promote($legacyModeratorRole);
        $this->legacyUser->save();
    }
}
```

Not that big of a change, yet the intent of the code is much clearer.

Now the next time you want to reach out to that legacy code and call some methods on it, try and make an interface for it. It might not be feasible, it might be too expensive to do. I know that static method on that god object is really easy to use and will get the job done much quicker, but at least consider this option. You might just improve the design of the new system you're building a tiny little bit.

Happy hackin'!
