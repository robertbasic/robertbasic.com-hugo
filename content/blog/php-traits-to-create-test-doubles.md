+++
draft = false
date = "2017-04-04T10:21:30+02:00"
title = "PHP traits to create test doubles"
slug = "php-traits-to-create-test-doubles"
description = "Use PHP traits to help creating test doubles"
tags = ["php", "traits", "unit testing", "tdd", "testing", "phpunit", "mocks", "test doubles"]
categories = ["Programming", "Development"]
2017 = ["04"]

+++

Keeping your application or library code well organized, easy to follow, and read is important. Your test code should not be exempt from those rules, you should follow good [testing conventions](http://blog.nikolaposa.in.rs/2017/02/13/testing-conventions/).

One part of my tests that I feel like that are out of control are the test doubles. Dummies, fakes, mocks... Seems like they are everywhere and that I keep writing the same ones over and over again.

I do follow some good practices on [how to reduce code duplication in my tests](https://davedevelopment.co.uk/2015/01/14/intro-to-reducing-duplication-in-tests.html), but these mocks...

Ugh.

## Test doubles are everywhere

Lets look at a couple of example test cases:

<div class='filename'>tests/App/UnitTest/Transaction/TransactionTest.php</div>
``` php
<?php declare(strict_types=1);
namespace App\UnitTest\Transaction;

use PHPUnit\Framework\TestCase;
use App\Account\Account;
use App\Account\AccountType;
use App\Transaction\Transaction;

class TransactionTest extends TestCase
{
    protected $asset;
    protected $expense;

    public function setup()
    {
        $this->asset = new Account(new AccountType('asset'), 'Cash');
        $this->expense = new Account(new AccountType('expense'), 'Groceries');
    }

    public function testTransactionCanBeExecutedBetweenAssetAndExpenseAccounts()
    {
        $transaction = new Transaction($this->asset, $this->expense, '5', 'EUR');

        $result = $transaction->execute();

        self::assertTrue($result);
    }

    public function testTransactionCannotBeExecutedBetweenExpenseAndAssetAccounts()
    {
        $transaction = new Transaction($this->expense, $this->asset, '5', 'EUR');

        $result = $transaction->execute();

        self::assertFalse($result);
    }
}
```

It's not so bad, right? We create a couple of account types, so we can create a couple of account objects which are then used to test can a transaction be executed or not.

And then we need to test the persistence of the transaction in another test case. Again we create a couple of account types, accounts, create a transaction...

And then we need to test the `TransactionExecuted` event. Account types, accounts, transaction...

Over and over again.

## Traits to the rescue

What if we move the creation of those test doubles to traits?

A trait for creating account types:

<div class='filename'>tests/Traits/AccountTypeTrait.php</div>
``` php
<?php declare(strict_types=1);
namespace Traits;

use App\Account\AccountType;

trait AccountTypeTrait
{
    public function fakeAssetAccountType() : AccountType
    {
        return new AccountType('asset');
    }

    public function fakeExpenseAccountType() : AccountType
    {
        return new AccountType('expense');
    }
}
```

and a trait for creating accounts:

<div class='filename'>tests/Traits/AccountTrait.php</div>
``` php
<?php declare(strict_types=1);
namespace Traits;

use App\Account\Account;
use Traits\AccountTypeTrait;

trait AccountTrait
{
    use AccountTypeTrait;

    public function fakeAssetAccount() : Account
    {
        return new Account($this->fakeAssetAccountType());
    }

    public function fakeExpenseAccount() : Account
    {
        return new Account($this->fakeExpenseAccountType());
    }
}
```

The example test case from the beginning now becomes a little bit more clear, hopefully:

<div class='filename'>tests/App/UnitTest/Transaction/TransactionTest.php</div>
``` php
<?php declare(strict_types=1);
namespace App\UnitTest\Transaction;

use PHPUnit\Framework\TestCase;
use App\Transaction\Transaction;
use Traits\AccountTrait;

class TransactionTest extends TestCase
{
    use AccountTrait;

    public function testTransactionCanBeExecutedBetweenAssetAndExpenseAccounts()
    {
        $transaction = new Transaction($this->fakeAssetAccount(), $this->fakeExpenseAccount(), '5', 'EUR');

        $result = $transaction->execute();

        self::assertTrue($result);
    }

    public function testTransactionCannotBeExecutedBetweenExpenseAndAssetAccounts()
    {
        $transaction = new Transaction($this->fakeExpenseAccount(), $this->fakeAssetAccount(), '5', 'EUR');

        $result = $transaction->execute();

        self::assertFalse($result);
    }
}
```

A trait for every test double, clearly named as to what they create. `fakeAssetAccount`, `mockTransactionRepository`. Each test double can now be reused more easily across different test cases, if for some reason they need to be changed, we change them only in one place.

Just need to be disciplined on the naming of the traits and the methods they provide.

Currently I see no pitfalls with this approach, but time will tell is this a good idea or not.

Happy hackin'!
