# What is swallow
The ever increasing number of graphic features (transformation matrices, shadows, gradients, backgrounds, animation effects, filters, masks, canvas, etc.) supported by modern browsers is difficult to fully leverage without graphic design tools. For most people design is a task that must be performed graphically and interactively: we want to see what we do and get instant feedback whenever we add, remove or change something. Moreover we don't necessarily want to learn programming languages and file formats in order to be able to create user interfaces.

Swallow is an open source graphic environment for creating HTML5 applications. Its main goal is to separate graphic design from programming so that designers can work visually on visual elements and programmers can work with programming tools on code.

## The Editor
The editor is a visual tool that is documented visual with youtube
videos. These video are available in the Help menu of the editor.

## The Framework
The framework consists of:

- packages that implement standard apis (assert, http, events, http, glmatrix) that handle tasks that are already well defined in NodJS or CommonJS and are similar on the client and the server.

- custom packages (visual, domvisual, config, utils) that implement apis that are specific to swallow

- optional packages (baseui, domquery, doxhtml, sse) that implement other useful apis and extensions. You can also add your own extensions by adding more packages or porting NodeJS packages.

# Getting Started
Here I will provide programming example for the most useful programming features.

##How do I start?
From the Launcher, create a new package, then create a new module in that package. Package names should start with a lowercase letter. Visual module names should start with an uppercase letter.

The package you created has a package.json file. It is a commonJS package. It is located in work/packages/yourpackagename.

The module you created is a Javascript file and a CommonJS module (it can require() packages and modules, and be require()d by other packages and modules). It is located in work/packages/yourpackagename/lib.

##Where is the code?
Swallow generates a small javascript module for each new visual element that you create.

This module looks like this:

'''javascript
    /**
        MyClass.js
    */
    var visual = require('visual'),
        domvisual = require('domvisual'),
        packageName = 'mypackage',
        className = 'MyClass',
        group = require('./groups').groups.MyClass;

    function MyClass(config) {
        domvisual.DOMElement.call(this, config, group);
    }
    MyClass.prototype = visual.inheritVisual(domvisual.DOMElement, group, packageName, className);
    MyClass.prototype.getConfigurationSheet = function () {
        return {  };
    };

    exports.MyClass} = MyClass;
'''

It can be found in your woriking directory under the work/packages/youpackage/lib
directory.

Note: Instanciating this class will create an instance of your visual element.

##I have created something with the editor, what's next: Event Handlers
The next step is to add event handlers. As soon as your baseclass has been called, you can add event handlers to your class. Your class inherits from an implementation of the EventEmitter class defined in NodeJS. This gives you access to the following methods:

'''javascript
        // In your constructor, the constructor of the baseclass is called:
        domvisual.DOMElement.call(this, config, group);

        // after the baseclass has been called, we can add event handlers:
        this.getChild('myChild').on('mousedown', function (evt) {
            console.log('mouse event!');
        });

'''

Here are the events that are currently supported:

##Animating Positions
In the editor, whenever you create a new visual element two things are actually created: a child and a position. The child has the same name as its initial position (ex: 'pos0'), but you can move it to any other position. You can also create empty positions and move your children to any of them. You can't have two children (or two positions) with the same name but you can move many children to the same position.

The following code will move a child name 'pos' to a position named 'offscreen'.
'''
    this.getChild('pos').setPosition('offscreen');
'''

TODO: Add a video showing how to add postions and children and how to rename them.
TODO: Show how animation is supported.
TODO: Point to a complete sample.

##Animating Styles

##Gettign the mouse position

##Dealing with html

##Dealing with external data and lists




#More advanced features

##Adding Tests to your Packages

##Adding JSDoc to your packages

##Adding non visual packages

##Porting NodeJS packages
