#Swallowapps: an open source and interactive application authoring tool for the web

Swallowapps provides fully interactive tools for the design of web content: you create the visual part of your application using visual tools and get instant feedback while you adjust dimensions, transformation matrices, colors, shadows, gradients and all other styling elements in an intuitive and interactive way.

When comes the time for programming, swallowapps combines the convenience of the commonJS packaging specification (the require() function, package.json etc.), with a totally transparent build process: modify any source module of any package that you use, hit F5 in the browser and your updated application is reloaded. In terms of apis, client side implementations of nodeJS apis (http, events, assert, url, etc.) are used whenever it's possible to allow maximum knowledge sharing and code reuse between server side and client side programming, while swallowapps specific packages deal with the visual side of things.

Finally, swallowapps development tools are built with themselves so as you learn how to use the tools you also learn how to modify them and make them tightly fit your specific needs.

![Screenshot](https://github.com/hugowindisch/swallow/raw/master/screenshot.png)

#Intro
http://www.youtube.com/watch?v=m0os24I4PUc

#Features
+ Graphic Editor (with copy, paste, undo, redo, styling, skinning, free positioning, z ordering etc) for creating visual components
+ JSON based document format (for the editor)
+ Small javascript framework based on CommonJS
+ Client side apis (http, events, assert, etc) based on NodeJS or CommonJS
+ Middleware operation in Express, Connect or plain NodeJS, OR Standalone operation
+ Integrated documentation generation (DOX, JSDoc)
+ Integrated code validation (JSLint)
+ Integrated asynchronous testing
+ Built with itself (mastering the framework lets you modify all the tools)

#Release Notes
+ 0.0.4 Adds support for editing multiple documents from the same page (previously, only one visual component could be edited in one editor page, now it is no longer the case). Video: http://www.youtube.com/watch?v=TV7rRGpe5po&feature=youtu.be

#Before you start
+ Make sure you have a recent version of NodeJS (ubuntu: installation with
chris lea's ppa or from the sources, windows: recent install).

+ Make sure you have a recent version of Google Chrome, or a recent version
of Firefox (Chrome is preferable). Other browsers (like all those based
on webkit) may work but have not been tested).

#Installation
npm install swallowapps -g
(you may need to use sudo)

Note that the -g is optional

#Execution
From the console:

(mkdir work, then:)

swallowapps -work=./work
(or if you did not install with -g, node swallowapps/editor/server/lib/editsrver.js -work=./work)

Then, open Chrome or Firefox at localhost:1337. This will start the launcher. From the launcher, you can select existing modules to edit, or create new ones.

#Getting Started with Programming
Please read https://github.com/hugowindisch/swallow/blob/master/MANUAL.md for instructions about programming with swallowapps.

Please read https://github.com/hugowindisch/swallow/blob/master/CONTRIBUTING.md for instructions about contributing.

#API Documentation
The documentation of the various packages can be generated from the JSDOC in the package source files. From the launcher, click the 'i' button, then click make. The documentation will be regenerated for all packages, including yours.
