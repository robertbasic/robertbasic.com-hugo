+++
draft = false
date = "2017-04-10T15:38:48+02:00"
title = "Read-only Symfony form field"
slug = "readonly-symfony-form-field"
description = "How to set the read-only attribute on a Symfony form field"
tags = ["php", "symfony", "form"]
categories = ["Programming", "Development"]
2017 = ["04"]

+++

The future me will be grateful for this post. I always get it wrong the first time.

To set a Symfony form field as a read-only, we can't set the `readonly` attribute as an option on that field:

<div class='filename'>src/AppBundle/Form/FooType.php</div>

``` php
<?php
declare(strict_types=1);

namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;

class FooType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('title', TextType::class, [
                'readonly' => true,
            ]);
    }
}
```

This won't work, and will give the `The option "readonly" does not exist. Defined options are:...` exception.

We need to set it as an attribute of that field:

<div class='filename'>src/AppBundle/Form/FooType.php</div>

``` php
<?php
declare(strict_types=1);

namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;

class FooType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('title', TextType::class, [
                'attr' => ['readonly' => true],
            ]);
    }
}
```

Happy hackin'!
