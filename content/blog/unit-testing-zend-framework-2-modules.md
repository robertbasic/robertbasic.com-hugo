+++
date = "2012-09-15T15:13:07+02:00"
title = "Unit testing Zend Framework 2 modules"
slug = "unit-testing-zend-framework-2-modules"
description = "How to unit test Zend Framework 2 modules with the help of Mockery"
tags = ["zend framework 2", "unit test", "testing", "mockery", "modules"]
categories = ["Development", "Programming", "Software"]
2012 = ["09"]
+++
Porting this blog to Zend Framework 2, I decided to write some unit tests as well, while I'm at it. Not that the current code base doesn't have unit tests, just it doesn't have much of it... Anyway, I'd like to show how to get unit tests for modules up and running, as well how to throw in <a href="https://github.com/padraic/mockery">Mockery</a> in the mix, as it can help us greatly with mocking out objects. Some of the parts shown here probably could be written in a more cleaner/nicer way, especially the autoloading bit, but so far it works for me.

The <code>phpunit.xml</code> file is rather simple:

``` xml
<phpunit bootstrap='./bootstrap.php' colors='true'>
    <testsuite name='ZF2 Module Test Suite'>
        <directory>.</directory>
    </testsuite>
    <filter>
        <whitelist>
            <directory suffix='.php'>../src/</directory>
        </whitelist>
    </filter>
    <listeners>
        <listener class="\Mockery\Adapter\Phpunit\TestListener"
            file="Mockery/Adapter/Phpunit/TestListener.php"></listener>
    </listeners>
</phpunit>
```

The Mockery TestListener, as <a href="https://github.com/padraic/mockery/issues/83">I found out the hard way</a>, is needed for Mockery to work properly. You might add in some more stuff, like generating code coverage reports, and the like.

In the <code>bootstrap.php</code> we set up the autoloading for the modules, the ZF2 library, and Mockery:

``` php
<?php
putenv('ZF2_PATH=' . __DIR__ . '/../../../vendor/ZF2/library');
include_once __DIR__ . '/../../../init_autoloader.php';
set_include_path(implode(PATH_SEPARATOR, array(
    '.',
    __DIR__ . '/../src',
    __DIR__ . '/../../SomeRequiredModule/src',
    __DIR__ . '/../../../vendor',
    get_include_path(),
)));
spl_autoload_register(function($class) {
    $file = str_replace(array('\\', '_'), DIRECTORY_SEPARATOR, $class) . '.php';
    if (false === ($realpath = stream_resolve_include_path($file))) {
        return false;
    }
    include_once $realpath;
});
$loader = new \Mockery\Loader;
$loader->register();
```

It assumes that the currently tested module lives inside a ZF2 application. If not, you'll probably need to adjust the paths accordingly. It also assumes that the Mockery files are in the <code>vendor/</code> directory.

<h3>Testing the service layer</h3>

Don't want to get into a fight about terminology, but the service layer for me, is the layer that lives between the controller layers and the database layers. It allows for keeping other layers clean of business logic, and easier testing. These services implement the <code>Zend\ServiceManager\ServiceLocatorAwareInterface</code>, which greatly simplifies unit testing, as it is easier to replace concrete objects with mocks.

Let's assume that we have a "post" service, which we can use to get the recent posts. The post service itself does not interact with the databse, but calls an <code>AbstractTableGateway</code> which does all the database work. A test case for this post service, to avoid database calls, should mock the AbstractTableGateway, and use the ServiceManager to replace the concrete implementation with the mock object. An example test case for this post service could look something like this:

``` php
<?php
namespace BlogModule\Service;
use PHPUnit_Framework_TestCase as TestCase;
use Zend\ServiceManager\ServiceManager;
use Zend\Db\ResultSet\ResultSet;
use \Mockery as m;
class PostTest extends TestCase
{
    protected $postService;
    /**
    * @var Zend\ServiceManager\ServiceLocatorInterface
    */
    protected $serviceManager;
    public function setup()
    {
        $this->postService = new Post;
        $this->serviceManager = new ServiceManager;
        $this->postService->setServiceLocator($this->serviceManager);
    }
    public function testGetRecentPosts()
    {
        $mock = m::mock('Blog\Model\Table\Post');
        $this->serviceManager->setService('blogModelTablePost', $mock);
        $result = array(
            array(
                'id' => 1,
                'title' => 'Foo',
            ),
        );
        $resultSet = new ResultSet;
        $resultSet->initialize($result);
        $mock->shouldReceive('getRecentPosts')
            ->once()
            ->andReturn($resultSet);
        $posts = $this->postService->getRecentPosts();
        $this->assertSame($posts, $resultSet);
    }
}
```

On line 18 we set the service manager to be used with the post service, on line 22 we create a mock object, and on line 23 we set that mock object in the service manager. We set some expectations on the mock object - what method should be called, how many times and what should it return. Finally we call the actual method that is being tested on the post service and assert that the returned result is correct.

<h3>Testing the database layer</h3>

For testing the database layer, that is the AbstractTableGateway implementations, I use a little... trick. I don't actually test what is returned from the database, but that the correct <code>Sql\Select</code> objects are being called, with the correct parameters in a correct order. This, in turn, means that I trust the underlying <code>Zend\Db</code> code that in the end, it will assemble the correct SQL queries, but I also don't have to bother with setting up a test database, and also the tests run faster, as they don't actually call the database. An example test case, continuing our example of getting recent posts:

``` php
<?php
namespace Blog\Model\Table;
use PHPUnit_Framework_TestCase as TestCase;
use Zend\ServiceManager\ServiceManager;
use Zend\Db\Sql\Select;
use \Mockery as m;
class PostTest extends TestCase
{
    protected $postTable;
    protected $select;
    protected $tableName = 'blog_posts';
    public function setup()
    {
        $adapter = $this->getAdapterMock();
        $this->postTable = new Post($adapter);
        $this->select = m::mock(new Select($this->tableName));
        $this->postTable->setSelect($this->select);
    }
    public function testGetRecentPosts()
    {
        $this->select->shouldReceive('from')
            ->once()
            ->with($this->tableName)
            ->andReturn($this->select);
        $this->select->shouldReceive('where')
            ->once()
            ->with(array('published = ?' => 1))
            ->andReturn($this->select);
        $this->select->shouldReceive('order')
            ->once()
            ->with('id DESC')
            ->andReturn($this->select);
        $this->select->shouldReceive('limit')
            ->once()
            ->with(10)
            ->andReturn($this->select);
        $this->postTable->getRecentPosts();
    }
}
```

Here we create a mock adapter (the getAdapterMock method can be seen in <a href="https://gist.github.com/3717485">this gist</a>), and use that mock adapter in our AbstractTableGateway implementation. We also create a mock <code>Sql\Select</code> object and we set expectations on that mock Select object. As I said, this way of testing might not be the best way out there, but it did help me catch a bug where I failed to add the <i>where</i> clause on the actual Select object. Yey for Mockery! Oh, and please do note that the adapter mock might not work in all cases, but again, so far it worked nicely for me.

One other thing would probably be interesting to show how to test, and that's the action controllers, but I haven't got around to write any controllers yet, so I'll probably leave that for part 2. Or you could do it for homework.

Happy hackin'!
