SwallowApps is a graphic tool for creating applications and components
that run in a browser.

#Features
+ Graphic Editor for creating visual components
+ Small javascript framework based on CommonJS
+ Cient side apis (http, events, assert, etc) based on NodeJS or CommonJS
+ Styling and skinning of components using css3 features
+ Ultra efficient workflow: f5 'remakes' everything almost instantaneously
* Integrated documentation generation
* Integrated code validation
* Integrated asynchronous testing
* Built with itself (mastering the framework lets you modify all the tools)

#Before you start
+ Make sure you have a recent version of NodeJS (ubuntu: installation with
chris lea's ppa or from the sources, windows: recent install).

+ Make sure you have a recent version of Google Chrome, or a recent version
of Firefox (Chrome is preferable). Other browsers (like all those based
on webkit) may work but have not been tested).

#Installation
npm install swallowapps -g

Note that the -g is optional

#Execution
From the console:

swallowapps
(or if you did not install with -g, swallowapps/editor/server/lib/editsrver.js)

Then, open Chrome or Firefox at localhost:1337. This will start the launcher. From the launcher, you can select existing modules to edit, or create new ones.

#Getting Started with Programming
Please read MANUAL.md for instructions about programming with swallow.

#API Documentation
From the launcher, click the 'i' button, then click make. The documentation will be regenerated for all packages, including yours.

The following server side apis are supported in the client: assert, events, http, test and url.
