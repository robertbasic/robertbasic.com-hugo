+++
date = "2009-01-05T20:25:38+02:00"
title = "Login example with Zend_Auth"
slug = "login-example-with-zend_auth"
description = "A login system with Zend Frameworks Zend_Auth component."
tags = ["authenticate", "authentication", "example", "framework", "login", "php", "zend"]
categories = ["Development", "Programming"]
2009 = ["01"]
+++
<strong>Happy New Year!</strong> Hope everyone had a blast for New Year's Eve and managed to get some rest :) This is my first working day for this year. I'm still kinda lazy and sleepy. And I wanna eat something all the time. Damn you candies!!!

So, here's what I'm going to do: authenticate an user against a database table using Zend Framework's Zend_Auth component. It's really a piece of cake. You can see a working example here: <a href="http://robertbasic.com/dev/login/">http://robertbasic.com/dev/login/</a>. Feel free to test it and report any misbehavior down in the <a href="http://robertbasic.com/blog/login-example-with-zend_authlogin-example-with-zend_auth/#comments">comments</a>. In the codes below all paths, class names, actions, etc. will be as are in the example, so you probably will need to changed those according to your setup.

<h2>Preparation</h2>

Because I'm gonna use a database, be sure to have set the default database adapter in the bootstrap file, I have it setup like this:

``` php
<?php
$config = new Zend_Config_Ini('../application/dev/config/db_config.ini', 'offline');
$registry = Zend_Registry::getInstance();
$registry->set('db_config',$config);
$db_config = Zend_Registry::get('db_config');
$db = Zend_Db::factory($db_config->db);
Zend_Db_Table::setDefaultAdapter($db);
```

I'll need it later in the code. The table structure is as follows:

``` sql
--
-- Table structure for table `zendLogin`
--

CREATE TABLE `zendLogin` (
  `id` int(11) NOT NULL auto_increment,
  `username` varchar(32) NOT NULL,
  `password` varchar(32) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;
```

<!--more-->

<h2>The login controller</h2>

The magic happens in the <code>LoginController</code>. It has two actions: <code>indexAction</code> and <code>logoutAction</code>. The <code>indexAction</code> will take care of showing the login form and processing the login process. The <code>logoutAction</code> will just logout the user. You would never figure out that one on your own, right?

Now, let's get to the fun part &#151; the code:

``` php
<?php
class Dev_LoginController extends Zend_Controller_Action
{
    public function indexAction()
    {
        // If we're already logged in, just redirect
        if(Zend_Auth::getInstance()->hasIdentity())
        {
            $this->_redirect('dev/secured/index');
        }

        $request = $this->getRequest();
        $loginForm = $this->getLoginForm();

        $errorMessage = "";
```

Not much happening here: if the user is already logged in, I don't want him at the login form, so just redirect him somewhere else; most likely to a home page or a control panel's index page.

The <code>Zend_Auth</code> implements the Singleton pattern &#151; if you're not familiar with it read <a href="http://framework.zend.com/manual/en/zend.auth.html#zend.auth.introduction">http://framework.zend.com/manual/en/zend.auth.html#zend.auth.introduction</a> and <a href="http://www.php.net/manual/en/language.oop5.patterns.php">http://www.php.net/manual/en/language.oop5.patterns.php</a> (at php.net scroll down to the example #2).

So, I'm just asking the <code>Zend_Auth</code> does it have an user identity stored in it; the identity gets stored only upon successful log in. I'm also getting the request object. The <code>getLoginForm()</code> is a function that I wrote for assembling the login form and is a part of the <code>LoginController</code>, I'll show it's code later.

``` php
<?php
if($request->isPost())
{
    if($loginForm->isValid($request->getPost()))
    {
        // get the username and password from the form
        $username = $loginForm->getValue('username');
        $password = $loginForm->getValue('password');
```

This doesn't needs a lot of explanation: if it's a post request, it means the form is submitted. If the submitted data is valid, just get the wanted values from the form.

``` php
<?php
        $dbAdapter = Zend_Db_Table::getDefaultAdapter();
        $authAdapter = new Zend_Auth_Adapter_DbTable($dbAdapter);

        $authAdapter->setTableName('zendLogin')
                    ->setIdentityColumn('username')
                    ->setCredentialColumn('password')
                    ->setCredentialTreatment('MD5(?)');
```

Here I'm getting the default database adapter, so I know whit which database I'm working with. Then I'm creating an adapter for Zend_Auth, which is used for authentication; the docs give good explanation on the adapter, read it here: <a href="http://framework.zend.com/manual/en/zend.auth.html#zend.auth.introduction.adapters">http://framework.zend.com/manual/en/zend.auth.html#zend.auth.introduction.adapters</a>.

Next, I'm telling the authentication adapter which table to use from the database, and which columns from that table. Also, I'm telling it how to treat the credentials &#151; the passwords are stored as MD5 hashes, so the submitted passwords will first be MD5ed and then checked.

``` php
<?php
        // pass to the adapter the submitted username and password
        $authAdapter->setIdentity($username)
                    ->setCredential($password);

        $auth = Zend_Auth::getInstance();
        $result = $auth->authenticate($authAdapter);
```

I'm passing to the adapter the user submitted username and password, and then trying to authenticate with that username and password.

``` php
<?php
        // is the user a valid one?
        if($result->isValid())
        {
            // get all info about this user from the login table
            // ommit only the password, we don't need that
            $userInfo = $authAdapter->getResultRowObject(null, 'password');

            // the default storage is a session with namespace Zend_Auth
            $authStorage = $auth->getStorage();
            $authStorage->write($userInfo);

            $this->_redirect('dev/secured/index');
        }
```

If the user is successfully authenticated, get all information about him from the table (if any), like the real name, E-mail, etc. I'm leaving out the password, I don't need that. Next I'm getting the <code>Zend_Auth</code>'s <a href="http://framework.zend.com/manual/en/zend.auth.html#zend.auth.introduction.persistence.default">default storage</a> and storing in it the user information. In the end I'm redirecting it where I want it.

``` php
<?php
else
{
    $errorMessage = "Wrong username or password provided. Please try again.";
}
}
}
$this->view->errorMessage = $errorMessage;
$this->view->loginForm = $loginForm;
}
```

And this is the end of the <code>indexAction</code>. I know I could take the correct message from <code>$result</code> with <code>getMessages()</code>, but I like more this kind of message, where I'm not telling the user which part did he got wrong.

``` php
<?php
public function logoutAction()
{
    // clear everything - session is cleared also!
    Zend_Auth::getInstance()->clearIdentity();
    $this->_redirect('dev/login/index');
}
```

This is the <code>logoutAction</code>. I'm clearing the identity from <code>Zend_Auth</code>, which is also clearing all data from the <code>Zend_Auth</code> session namespace. And, of course, redirecting back to the login form.

``` php
<?php
protected function getLoginForm()
{
    $username = new Zend_Form_Element_Text('username');
    $username->setLabel('Username:')
            ->setRequired(true);

    $password = new Zend_Form_Element_Password('password');
    $password->setLabel('Password:')
            ->setRequired(true);

    $submit = new Zend_Form_Element_Submit('login');
    $submit->setLabel('Login');

    $loginForm = new Zend_Form();
    $loginForm->setAction('/dev/login/index/')
            ->setMethod('post')
            ->addElement($username)
            ->addElement($password)
            ->addElement($submit);

    return $loginForm;
}
```

As promised, here's the code for <code>getLoginForm</code> function. That's the whole <code>LoginController</code> code, not really a rocket science :) Sorry if it's a bit hard to keep up with the code, I needed it to break it up in smaller pieces...

And here's the view script for the <code>indexAction</code>.

``` php
<?php
<h2>Zend_Login example</h2>

<p>
Hello! This is an example of authenticating users with the Zend Framework...
</p>

<p>Please login to proceed.</p>

<?php if($this->errorMessage != ""): ?>
<p class="error"><?= $this->errorMessage; ?></p>
<?php endif; ?>

<?= $this->loginForm; ?>
```

<h2>Other controllers</h2>

Couldn't come up with a better subtitle :(

Here's an example how to require the user to log in to see the page: in the <code>init()</code> method ask <code>Zend_Auth</code> is the user logged in, and if not redirect him to the login form. This way the user will have to log in to the "whole controller". Implement the same only to the <code>indexAction</code>, and the user will have to only log in to see the index page; he'll be able to access another page without logging in. 

``` php
<?php
class Dev_SecuredController extends Zend_Controller_Action
{
    function init()
    {
        // if not logged in, redirect to login form
        if(!Zend_Auth::getInstance()->hasIdentity())
        {
            $this->_redirect('dev/login/index');
        }
    }

    public function indexAction()
    {
        // get the user info from the storage (session)
        $userInfo = Zend_Auth::getInstance()->getStorage()->read();

        $this->view->username = $userInfo->username;
        $this->view->name = $userInfo->name;
        $this->view->email = $userInfo->email;
    }

    public function anotherAction()
    {
    }
}
```

I'm also reading out the user information from the <code>Zend_Auth</code>'s storage, that I have stored there during the log in process.

So there. A fully working login system, which can be setup in a really short time.

<strong>Update: If you want, you can get an example source code from here: <a href="http://robertbasic.com/downloads/zendLogin.zip">zendLogin.zip</a> ~8kB</strong>

Happy hacking!
