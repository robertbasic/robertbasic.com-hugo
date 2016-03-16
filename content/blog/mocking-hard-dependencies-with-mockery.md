+++
date = "2014-12-23T21:44:32+02:00"
title = "Mocking hard dependencies with Mockery"
slug = "mocking-hard-dependencies-with-mockery"
description = "Example how to use overloading in Mockery to mock hard dependencies."
tags = ["mockery", "php", "testing", "unit tests"]
categories = ["Development", "Programming"]
+++
<p>
One problem with unit testing legacy applications is that the code has <code>new</code> statements all over the place, instantiating new objects in a way that doesn't really makes it easier to test the code.
</p>

<p>
Of course, the easy answer to this is "Just refactor your application!", but that's almost always easier said than done.
</p>

<p>
If refactoring <b>is</b> an option, do it. If not, one option is to use <a href="https://github.com/padraic/mockery">Mockery</a> to mock the hard dependencies.
</p>

<p>
One prerequisite to make this work is that the code we are trying to test uses autoloading.
</p>

<p>
Let's take the following code for an example:
</p>

<pre class="php" name="code">
&lt;?php
namespace App;
class Service
{
    function callExternalService($param)
    {
        $externalService = new Service\External();
        $externalService-&gt;sendSomething($param);
        return $externalService-&gt;getSomething();
    }
}
</pre>

<p>
The way we can test this without doing any changes to the code itself is by creating <a href="http://docs.mockery.io/en/latest/reference/instance_mocking.html">instance mocks</a> by using the <code>overload</code> prefix.
</p>

<pre class="php" name="code">
&lt;?php
namespace AppTest;
use Mockery as m;
class ServiceTest extends \PHPUnit_Framework_TestCase {
    public function testCallingExternalService()
    {
        $param = 'Testing';

        $externalMock = m::mock('overload:App\Service\External');
        $externalMock-&gt;shouldReceive('sendSomething')
            -&gt;once()
            -&gt;with($param);
        $externalMock-&gt;shouldReceive('getSomething')
            -&gt;once()
            -&gt;andReturn('Tested!');

        $service = new \App\Service();

        $result = $service-&gt;callExternalService($param);

        $this-&gt;assertSame('Tested!', $result);
    }
}
</pre>

<p>
If we run this test now, it should pass. Mockery does it's job and our <code>App\Service</code> will use the mocked external service instead of the real one.
</p>

<p>
The problem whit this is when we want to, for example, test the <code>App\Service\External</code> itself, or if we use that class somewhere else in our tests.
</p>

<p>
When Mockery overloads a class, because of how PHP works with files, that overloaded class file must not be included otherwise Mockery will throw a "class already exists" exception. This is where autoloading kicks in and makes our job a lot easier.
</p>

<p>
To make this possible, we'll tell PHPUnit to run the tests that have overloaded classes in separate processes and to not preserve global state. That way we'll avoid having the overloaded class included more than once. Of course this has it's downsides as these tests will run slower.
</p>

<p>
Our test example from above now becomes:
</p>

<pre class="php" name="code">
&lt;?php
namespace AppTest;
use Mockery as m;
/**
 * @runTestsInSeparateProcesses
 * @preserveGlobalState disabled
 */
class ServiceTest extends \PHPUnit_Framework_TestCase {
    public function testCallingExternalService()
    {
        $param = 'Testing';

        $externalMock = m::mock('overload:App\Service\External');
        $externalMock-&gt;shouldReceive('sendSomething')
            -&gt;once()
            -&gt;with($param);
        $externalMock-&gt;shouldReceive('getSomething')
            -&gt;once()
            -&gt;andReturn('Tested!');

        $service = new \App\Service();

        $result = $service-&gt;callExternalService($param);

        $this-&gt;assertSame('Tested!', $result);
    }
}
</pre>

<p>
And that should be pretty much it. If nothing else, it should make parts of old code easier to test.
</p>

<p>
For anyone interested, I put the <a href="https://github.com/robertbasic/mockery-hard-dependency">example code up on Github</a>.
</p>
