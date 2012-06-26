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
events, etc.) so that programming cient components is as close as possible
as programming server stuff in Node.js.

Swallow is developped with Swallow. It runs in a browser. When you know
how to use it, you know how to improve and extend it.


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

Getting Started
===============


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
on the server (e.g. require) is also a good idea.

+ Node.js is the defacto standard for developing on the server. When things
can be done client side and server side (e.g. http, urls, events) they should.

Here are the goals of the project
---------------------------------

+ Create an interactive application creation tool for the web, based on
Node.js and CommonJS, that can itself run inside a browser.


What's Missing, what's Wrong, etc.
===================================
tbd

Roadmap
=======

The project is currently in an early usable state. It is a few months away from
a first official release (a first minimalistic 1.0 release).

On the WEB
==========

http://www.swallowapps.com
