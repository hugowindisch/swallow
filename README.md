Swallow is a graphic tool for creating applications and components
that run in a browser.

The tool lets you create components by placing other components graphically
in an interactive editor.

The tool supports styling and skinning. Styling lets you tune the appearance
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
how to use it, you

Installation
============
npm install swallowapps -g

Note that the -g is optional

Execution
=========
From the console:

swallowapps
(or if you did not install with -g, swallowapps/editor/

Then, open Chrome or Firefox at localhost:1337. This will start the
launcher. From the launcher, you can select existing modules to edit,
or create new ones.

Getting Started
===============


API Documentation
=================


Goals Of The Project
====================

Here are the key ideas behind this project:
-------------------------------------------

+ No matter how great HTML and CSS are, it should be possible to create
most web content interactively and graphically (that's how newspapers,
movies, reports, computer games etc. are designed, this should also
apply to web pages).

+ Using interactive design tools

+ Development tools need to be free

+ Using the same programming language on the client and on the server is a
good idea.

+ Using the same packaging and module loading mechanism on the client and
on the server is also a good idea. Javascript without modules and
require() is not all that fantastic.

+ Node.js is the defacto standard for developing on the server. When things
can be done client side and server side (e.g. http, urls, events) they should.

+ An app creation tool is an app, and should be created using itself. Doing so,
developers who learn how to use the tool will be

Here are the goals of the project
---------------------------------

What's Missing, what's Wrong, etc.
===================================


Roadmap
=======

The project is currently in an early usable state. It is a few months away from
a first official release (a first minimalistic 1.0 release).

On the WEB
==========

http://www.swallowapps.com
