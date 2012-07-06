SwallowApps is a graphic tool for creating applications and components
that run in a browser.

The tool lets you create components by placing other components graphically
in an interactive editor.

The tool supports styling and skinning. Styling lets you choose the appearance
of your content and use the same display attributes for many different
elements. Skinning lets you override the styles of the components that
you require (e.g. you don't like the color of the slider? you can override
it inside your own component). Styling and skinning are interactive operations.

Every component can be required and used by other components or simply used as
a standalone application.

Programmatically, a component is essentially a constructor exported by a
CommonJS module. Many components can reside in a CommonJS package. Of course,
it is possible to create non-graphic packages or share packages between
the server and the client.

Standard packages are provided for most of the standard stuff (http, urls,
events, etc.) so that programming cilent components is as close as possible
to programming server stuff in Node.js.

Swallow is developped with Swallow. It runs in a browser. When you know
how to use it, you know how to improve and extend it.

Before you start
================
+ Make sure you have a recent version of NodeJS (ubuntu: installation with
chris lea's ppa or from the sources, windows: recent install).

+ Make sure you have a recent version of Google Chrome, or a recent version
of Firefox (Chrome is preferable). Other browsers (like all those based
on webkit) may work but have not been tested).

Installation
============
npm install swallowapps -g

Note that the -g is optional

Execution
=========
From the console:

swallowapps
(or if you did not install with -g, swallowapps/editor/server/lib/editsrver.js)

Then, open Chrome or Firefox at localhost:1337. This will start the
launcher. From the launcher, you can select existing modules to edit,
or create new ones.

Getting Started with Programming
================================

Your work directory has the following structure:

    work/
        packages/
            myPackage/
                package.json
                lib/
                    MyModule1.js
                    MyModule2.js
        publish/
        generated/

packages is where the packages that you create in the Launcher will go. In
a given package (let's say myPackage) you will find a lib directory that
will contain one js file per module that you create (here MyModule1.js and
MyModule2.js).

The code of a new module looks like this:

    /**
        MyModule1.js
    */
    var visual = require('visual'),
        domvisual = require('domvisual'),
        group = require('/testcontent/lib/groups').groups.MyModule1;

    function MyModule1(config) {
        domvisual.DOMElement.call(this, config, group);
    }
    MyModule1.prototype = visual.inheritVisual(domvisual.DOMElement, group, 'testcontent', 'MyModule1');
    MyModule1.prototype.getConfigurationSheet = function () {
        return {  };
    };
    exports.MyModule1 = MyModule1;

Adding interactions (event handlers) consists in doing something like this
instead (the differences are in the MyModule1 constructor. Note that after
the call to domvisual.DOMElement, the MyModule1 visual element is fully
constructed and its children can be accessed).


    /**
        MyModule1.js
    */
    var visual = require('visual'),
        domvisual = require('domvisual'),
        group = require('/testcontent/lib/groups').groups.MyModule1;

    function MyModule1(config) {
        domvisual.DOMElement.call(this, config, group);
        this.getChild('myChild').on('mousedown', function (evt) {
            console.log('mouse event!');
        });
    }
    MyModule1.prototype = visual.inheritVisual(domvisual.DOMElement, group, 'testcontent', 'MyModule1');
    MyModule1.prototype.getConfigurationSheet = function () {
        return {  };
    };
    exports.MyModule1 = MyModule1;



API Documentation
=================
From the launcher, click the 'i' button, then click make. The documentation
will be regenerated for all packages, including yours.

The following server side apis are supported in the client: assert, events,
http, test and url.

Goals Of The Project
====================

Here are the key ideas behind this project:
-------------------------------------------

+ No matter how great HTML and CSS are, it should be possible to create
most web content interactively and graphically (that's how newspapers,
movies, reports, computer games etc. are designed, this should also
apply to web pages), using interactive design tools.

+ Using the same programming language on the client and on the server is a
good idea.

+ Using the same packaging and module loading mechanisms on the client and
on the server (e.g. require()) is also a good idea.

+ Using the same apis on the client and the server is a good idea.

Here are the goals of the project
---------------------------------

+ Create an interactive application creation tool for the web, based on
Node.js and CommonJS, that can run inside a browser.


What's Missing, what's Wrong, etc.
===================================

The project is still very young, the apis are not in their final form,
some documentation is missing, some tests are missing etc.

Other than that (fixes, improvements, polishing), 3 new categories of
functionnalities will be added:

a) HTML integration
There will be a way to replace DOM elements by swallowapps elements. This
will be highly inspired (in terms of apis) on the query part of jQuery (so
that people who know jQuery will immediately feel comfortable with the api).

Use case: you want to add interactivity to a document by replacing some of
its elements by swallowapps elements.

b) LIST support
A minimalistic client side templating system will be added to facilate
the client side generation of content from JSON data.

Use case: you load a JSON from a server and want to generate visual elements
from it.

c) Repository support
There will be a way to publish components on a central repositorty. This
will facilitate code exchange between developers.

Roadmap
=======

The project is currently in an early usable state. It is a few months away from
a first official release (a first minimalistic 1.0 release).

On the WEB
==========

http://www.swallowapps.com
