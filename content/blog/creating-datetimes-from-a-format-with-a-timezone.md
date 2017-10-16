+++
draft = false
date = 2017-10-16T07:39:57+02:00
title = "Creating datetimes from a format with a timezone"
slug = "creating-datetimes-from-a-format-with-a-timezone"
description = "For those of us who don't read the fineprint in the manual."
tags = ["php", "datetime", "format", "timezone"]
categories = ["Programming", "Development"]
2017 = ["10"]
+++

I wouldn't be writing this blog post, if I'd read all the "fineprints" in the PHP manual. Alas, here we are.

The `DateTime` and `DateTimeImmutable` classes have a `createFromFormat` method. As you can probably guess from it's name, it [creates a datetime object](https://secure.php.net/manual/en/datetime.createfromformat.php) from a datetime string formatted in the specified format. Something like this:

``` php
<?php

$dtString = '2017-10-16 07:50:00';
$format = 'Y-m-d H:i:s';

$dt = \DateTimeImmutable::createFromFormat($format, $dtString);

print_r($dt);
```

gives an immutable datetime object:

``` text
DateTimeImmutable Object (
    [date] => 2017-10-16 07:50:00.000000
    [timezone_type] => 3
    [timezone] => Europe/Belgrade
)
```

Nothing wrong with that. The timezone is `Europe/Belgrade`, as we didn't provide the third parameter to the `createFromFormat` method, which is the optional timezone, and in this case PHP
defaulted to the server's timezone. Business as usual.

If we tell it to use a specific timezone, it'll use that one instead of the server's timezone:

``` php
<?php

$dtString = '2017-10-16 07:50:00';
$format = 'Y-m-d H:i:s';
$timezone = new \DateTimeZone('America/New_York');

$dt = \DateTimeImmutable::createFromFormat($format, $dtString, $timezone);

print_r($dt);
```

and an expected result of:

``` text
DateTimeImmutable Object (
    [date] => 2017-10-16 07:50:00.000000
    [timezone_type] => 3
    [timezone] => America/New_York
)
```

Again, business as usual, because we told PHP in what timezone the datetime string is, `America/New_York`.

## A format with a timezone offset

When the format has a timezone offset though, that's... the part I skipped in the manual:

``` php
<?php

$dtString = '2017-10-16T07:50:00+00:00';
$format = 'Y-m-d\TH:i:sP';
$timezone = new \DateTimeZone('America/New_York');

$dt = \DateTimeImmutable::createFromFormat($format, $dtString, $timezone);

print_r($dt);
```

and a result of:

``` text
DateTimeImmutable Object (
    [date] => 2017-10-16 07:50:00.000000
    [timezone_type] => 1
    [timezone] => +00:00
)
```

Errr... Not really what I wanted, but okay. I guess.

The `createFromFormat` method ignores the provided timezone (or the server's timezone if there's none provided), if the datetime string and it's format have a timezone offset.

It's noted in the manual, my bad for not reading carefully, but this still caught me by surprise.

Not being aware of this can cause some hard to track down bugs in applications. While the `DateTime` objects are being created without an error, they are being created with a different `timezone_type` from what I originally expected and can potentially lead to a loss of information as the timezone identifier can't be retrieved from the timezone offset.

Happy hackin'!
