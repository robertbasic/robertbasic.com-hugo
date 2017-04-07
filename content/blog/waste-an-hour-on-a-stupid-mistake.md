+++
draft = false
date = "2017-04-07T17:06:35+02:00"
title = "Waste an hour on a stupid mistake"
slug = "waste-an-hour-on-a-stupid-mistake"
description = "What a stupid mistake to waste an hour on."
tags = ["stupid", "php"]
categories = ["Programming", "Development", "Blablabla"]
2017 = ["04"]

+++

I made such a stupid mistake today <strong>and</strong> lost an hour of my time trying to figure out what the hell is wrong, that I just have to blog it.

I was working on embedding a Symfony form into another form, following [the documentation](https://symfony.com/doc/current/form/form_collections.html) to the letter... Yet there I was staring at this stupid error message:

``` text
The options "0", "1" do not exist. Defined options are: "action", "allow_add", "allow_delete",
"allow_extra_fields", "attr", "auto_initialize", "block_name", "by_reference", "compound",
"constraints", "csrf_field_name", "csrf_message", "csrf_protection", "csrf_token_id",
"csrf_token_manager", "data", "data_class", "delete_empty", "disabled", "empty_data",
"entry_options", "entry_type", "error_bubbling", "error_mapping", "extra_fields_message",
"help", "inherit_data", "invalid_message", "invalid_message_parameters", "label", "label_attr",
"label_format", "mapped", "method", "post_max_size_message", "property_path", "prototype",
"prototype_data", "prototype_name", "required", "translation_domain", "trim",
"upload_max_size_message", "validation_groups".
```

What the hell...

Excerpt of the code that was throwing the error:

``` php
<?php
declare(strict_types=1);

namespace AppBundle\Form;

use AppBundle\Form\SampleType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class MultiSampleType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('samples', CollectionType::class, [
                'entry_type', SampleType::class,
                'allow_add' => true,
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => null,
        ));
    }
}
```

I read the documentation over and over again, searched for any one else coming up with the same error, went through the issues on the Symfony repositories... Nothing.

Now when I look at this code sample the error is poking my eyes out, but this morning when I was looking for it... Crickets.

Let's "zoom" in:

``` php
<?php
->add('samples', CollectionType::class, [
    'entry_type', SampleType::class,
    'allow_add' => true,
]);
```

Do you see it?

The error is that the `entry_type` should be a key, instead of a value, and `SampleType::class` is the value for the `entry_type` key.

``` php
<?php
->add('samples', CollectionType::class, [
    'entry_type' => SampleType::class,
    'allow_add' => true,
]);
```

So stupid.

Oh well, I guess this also part of programming.

Happy hackin'!
