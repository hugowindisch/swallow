SwallowApps is a graphic tool for creating applications and components
that run in a browser.

Features
========

+ Graphic Editor for creating visual components
+ Small javascript framework based on CommonJS
+ Cient side apis (http, events, assert, etc) based on NodeJS or CommonJS
+ Styling and skinning of components using css3 features
+ Ultra efficient workflow: f5 'remakes' everything almost instantaneously
* Integrated documentation generation
* Integrated code validation
* Integrated asynchronous testing
* Built with itself (mastering the framework lets you modify all the tools)

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
