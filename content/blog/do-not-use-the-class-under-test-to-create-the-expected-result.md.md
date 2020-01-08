+++
draft = false
date = 2020-01-08T09:52:44+01:00
title = "Don't use the class under test to create the expected result"
slug = "do-not-use-the-class-under-test-to-create-the-expected-result"
description = "The expected result in a test should not be created using the same method or algorithm that we are testing."
tags = ["unit tests", "testing"]
categories = ["Programming", "Development"]
2020 = ["01"]
+++

From time to time I come across a mistake in unit tests that makes them useless. The mistake is that we use the class and method that we are testing to create the expected result of the test:

<div class='filename'>BadTest.php</div>

``` php
<?php

class BadTest extends TestCase
{
    public function testThatPasswordIsHashed(): void
    {
        $hasher = new PasswordHasher();

        $actualResult = $hasher->hash('super secret');

        $expectedResult = $hasher->hash('super secret');

        $this->assertSame($expectedResult, $actualResult);
    }
}
```

If we were to break the behavior of the `hash` method, the test would pass. Returning an empty string is enough to break it but leave the tests green.

The `SortOfFixedTest` example shows an improvement over the `BadTest`. The problem here is that we repeat the underlying algorithm in the test. Sometimes we can't avoid this, but those are rare cases.

<div class='filename'>SortOfFixedTest.php</div>

``` php
<?php

class SortOfFixedTest extends TestCase
{
    public function testThatPasswordIsHashed(): void
    {
        $hasher = new PasswordHasher();

        $actualResult = $hasher->hash('super secret');

        $expectedResult = password_hash('super secret', PASSWORD_DEFAULT);

        $this->assertSame($expectedResult, $actualResult);
    }
}
```

Repeating algorithms like this will slow down the test suite. We are lazy, we would copy/paste the algorithm from the actual method. If we made a bug in the original algorithm, we would have it in our test as well.

We have to set the expected result to the result that we are expecting:

<div class='filename'>FixedTest.php</div>

``` php
<?php

class FixedTest extends TestCase
{
    public function testThatPasswordIsHashed(): void
    {
        $hasher = new PasswordHasher();

        $actualResult = $hasher->hash('super secret');

        $expectedResult = '$2y$10$PfAO94tkT3whsYZRpzAmG.aNb9HOVUP9j92zn2Nfc8Qi8bxv5rx8O';

        $this->assertSame($expectedResult, $actualResult);
    }
}
```

If the `hash` method changes, the test will fail. We are not repeating the underlying algorithm in our test code, so there is no chance of repeating a bug from the tested method.

Happy hackin'!
