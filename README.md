SwallowApps is a graphic tool for creating applications and components that run in a browser. It has some similarities with the Flash (TM) authoring environment but targets an HTML5 runtime. It borrows its packaging system and some of its apis from CommonJS and NodeJS. Its backend components are developed using NodeJS.

![Screenshot](https://github.com/hugowindisch/swallow/raw/master/screenshot.png)

#Intro
http://www.youtube.com/watch?v=m0os24I4PUc

#Features
+ Graphic Editor for creating visual components
+ Small javascript framework based on CommonJS
+ Cient side apis (http, events, assert, etc) based on NodeJS or CommonJS
+ Styling and skinning of components using css3 features
+ Runs standalone or as a middleware in your own Express, Connect or NodeJS project
+ Integrated documentation generation
+ Integrated code validation
+ Integrated asynchronous testing
+ Built with itself (mastering the framework lets you modify all the tools)

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
Please read https://github.com/hugowindisch/swallow/blob/master/MANUAL.md for instructions about programming with swallow.

#API Documentation
The documentation of the various packages can be generated from the JSDOC in the package source files. From the launcher, click the 'i' button, then click make. The documentation will be regenerated for all packages, including yours.
