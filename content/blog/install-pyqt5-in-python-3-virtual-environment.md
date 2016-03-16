+++
date = "2015-02-04T07:52:34+02:00"
title = "Install PyQt5 in Python 3 virtual environment"
slug = "install-pyqt5-in-python-3-virtual-environment"
description = "Get PyQt5 working under a virtualenv with python3.4"
tags = ["python", "pyqt5", "virtualenv"]
categories = ["Software", "Development", "Programming"]
+++
<p>
    It's been a while since I last made something with <a href="http://www.riverbankcomputing.co.uk/software/pyqt/intro">PyQt</a>, so I decided to check out what's it like nowadays. I'm curious to see what's new in Qt5 and how does it differ from Qt4. Qt5 also can run under python 3 so I figured to give it a try.
</p>

<p>
    Fedora 21 comes with both python 2.7 and python 3.4, but the default version is 2.7, which means if PyQt5 is installed through the package manager, it will be installed against 2.7. As I'm not currently in the mood of bricking my laptop by changing the default python version, I decided to install PyQt5 in a python <a href="https://virtualenv.pypa.io/en/latest/">virtual environment</a>. Btw, Fedora 22 should have python 3 <a href="http://fedoraproject.org/wiki/Changes/Python_3_as_Default">by default</a>.
</p>

<p>
    In the code samples below, assume the working directory is always <code>~/pyqt</code>.
</p>

<h3>Create a virtual environment</h3>

<p>
    First off, let's create a virtualenv with python 3.4:
</p>


<pre name="code" class="bash">virtualenv --python=python3.4 env
</pre>

<p>
    Activate the virtualenv and check the python version to verify:
</p>


<pre name="code" class="bash">source env/bin/activate
python --version
</pre>

<p>
    And that should print something like <code>Python 3.4.1</code>. Leave the virtualenv active, as that's where PyQt5 is going to be installed.
</p>

<h3>PyQt5 dependencies</h3>

<p>
    Cool, now with that set up, let's get PyQt5 dependencies sorted out:
</p>


<pre name="code" class="bash">sudo yum install gcc gcc-c++ python3-devel qt5-base qt5-base-devel
</pre>

<p>
    As the <a href="http://pyqt.sourceforge.net/Docs/PyQt5/installation.html">documentation</a> says, SIP must be installed before PyQt5. Lets grab the sources, configure and make and install them.
</p>


<pre name="code" class="bash">wget http://sourceforge.net/projects/pyqt/files/sip/sip-4.16.5/sip-4.16.5.tar.gz
tar xzf sip-4.16.5.tar.gz
cd sip-4.16.5
python configure.py
make
sudo make install
cd ..
rm -r sip-4.16.5*
</pre>

<p>
    Not sure why I had to do <code>sudo make install</code>. Verify sip is installed correctly by starting a python shell and typing in the following:
</p>


<pre name="code" class="python">import sip
sip.SIP_VERSION_STR
</pre>

<p>
    That should show the sip version <code>4.16.5</code>.
</p>

<h3>Installing PyQt5</h3>

<p>
    All the dependencies should be met now, so let's install PyQt5.
</p>


<pre name="code" class="bash">wget http://sourceforge.net/projects/pyqt/files/PyQt5/PyQt-5.4/PyQt-gpl-5.4.tar.gz
tar xzf PyQt-gpl-5.4.tar.gz
cd PyQt-gpl-5.4
python configure.py --qmake /usr/bin/qmake-qt5
make
make install
cd ..
rm -r PyQt-gpl-54*
</pre>

<p>
    This will install PyQt5 with the basic modules such as QtCore, QtWidgets and QtSql. Check the output of the <code>python configure.py</code> step to see what modules will be installed. If you need additional modules in your PyQt5 setup, you'll have to install additional Qt packages on your system. For example, to get the QtWebKit module, install the <code>qt5-qtwebkit</code> package through your package manager first.
</p>

<p>
    Writing a basic PyQt5 app we can verify that it all works. Save the following as <code>pyqt.py</code>:
</p>


<pre name="code" class="python">import sys
from PyQt5.QtWidgets import QApplication, QMainWindow
if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = QMainWindow()
    window.show()
    sys.exit(app.exec_())
</pre>

<p>
    Running it with <code>python pyqt.py</code> should start the application that's just one small window.
</p>

<p>
    Happy hacking!
</p>
