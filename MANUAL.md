# What is swallowapps
Swallowapps is an open source graphic environment for creating HTML5 applications visually.

## The Editor
The editor is a visual tool that is documented visually with youtube videos. These video are available in the Help menu of the editor.

## The Framework
The framework consists of:

- packages that implement standard apis (assert, http, events, http, glmatrix) that handle tasks that are already well defined in NodJS or CommonJS and are similar on the client and the server.

- custom packages (visual, domvisual, config, utils) that implement apis that are specific to swallowapps and that let you create or use visual components.

- optional packages (baseui, domquery, doxhtml, sse) that implement other useful apis and extensions. You can also add your own extensions by adding more packages or porting NodeJS packages.

# Getting Started
Here I will provide programming examples for the most useful programming features.

##How do I start?
From the Launcher, you can create a new package, then create a new module in that package. Package names should start with a lowercase letter. Visual module names should start with an uppercase letter.

The package you created has a package.json file. It is a commonJS package. It is located in work/packages/yourpackagename.

The module you created is a Javascript file and a CommonJS module (it can require() packages and modules, and be require()d by other packages and modules). It is located in work/packages/yourpackagename/lib.

##Where is the code?
Swallowapps generates a small javascript module for each new visual element that you create.

This module looks like this:

```javascript
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
```

It can be found in your working directory under the work/packages/yourpackage/lib directory.

Note: Instanciating this class will create an instance of your visual element. This will be discussed in greater detail a little bit later.

##I have created something with the editor, what's next: Event Handlers
The next step is to add event handlers. As soon as your base class has been called, you can add event handlers to your class. Your class inherits from an implementation of the EventEmitter class defined in NodeJS. This gives you access to the following methods: on, once, addListener, removeListener, emit etc.

```javascript
        // In your constructor, the constructor of the baseclass is called:
        domvisual.DOMElement.call(this, config, group);

        // after the baseclass has been called, we can add event handlers:
        this.getChild('myChild').on('mousedown', function (evt) {
            console.log('mouse event!');
        });
```

Here are the events that are currently supported:
keydown, keyup, resize, click, mousedown, mousedownt, mousedownc, mouseup, mouseupc, mouseupt, mouseover, mousemove, mousemovec, mouseout, change, load, error.

TODO: Add all what's missing
TODO: Document the 't' and 'c' version of some events
TODO: Document the lifetime management of handlers

##Dealing with Mouse events (and positional events)
SwallowApps lets you compute the position of mouse events relative to your component (in HTML, mouse events are positioned relatively to the page). This can be useful if you want to use the mouse to position a visual element inside another visual element (just like swallowapps's visual editor does).

```javascript
        this.getChild('myChild').on('mousemove', function (evt) {
            var glmatrix = require('glmatrix'),
                mat = myVisualElement.getFullDisplayMatrix(true);
            glmatrix.mat4.multiplyVec3(mat, [evt.pageX, evt.pageY, 0]));
        });
```

getFullDisplayMatrix(true) returns the inverse of the display matrix that positions myVisualElement in the page. glmatrix.mat4.multiplyVec3 transforms the page coordinates of the event with this matrix.

TODO: Point to a complete code sample

##Animating Positions
In the editor, whenever you create a new visual element two things are actually created: a child and a position. The child has the same name as its initial position (ex: 'pos0'), but you can move it to any other position. You can also create empty positions and move your children to any of them. You can't have two children (or two positions) with the same name but you can move many children to the same position.

The following code will move a child name 'pos' to a position named 'offscreen'.
```javascript
    this.getChild('pos').setPosition('offscreen');
```

To animate this displacement we can write:
```javascript
    this.getChild('pos').setTransition(300).setPosition('offscreen');
```

To do something when the transition ends (here we clear all transitions), we can handle the 'transitionend' event. Since this event will be fired for all affected properties, we only want to handle it once:

```javascript
    this.getChild('pos'
    ).setTransition(300
    ).setPosition('offscreen'
    ).once('transitionend', function (evt) {
        this.clearTransition();
    });
```

Note: A complete example of this can be found in samples/lib/PositionAnimation.js (and you can run the PositionAnimation sample).

Note: When the size of a container changes, its positions are recomputed according to resizing rules defined in the editor. The layout is dynamic and position names define the various anchor points available inside a given layout.

TODO: Add a video showing how to add positions and children and how to rename them.

##Animating Styles
Some visual elements use styles. A good example of this is domvisual.DOMElement that has a setStyle method. You can use any style defined in your visual component and pass it to setStyle:

```javascript
    this.getChild('pos').setStyle('style0');
```

Here again, we can use a transition and handle the end of transition event:

```javascript
    this.getChild(
    ).setTransition(300, 'ease-in'
    ).setStyle('style0'
    ).once('transitionend', function (evt) {
        this.clearTransition();
    });
```

Note: A complete example of this can be found in samples/lib/StyleAnimation.js (and you can run the StyleAnimation sample).

##Playing with Depth
You can change the visual ordering of visual elements: which one is on top, which one is hidden by others.

```javascript
// this will return the topmost child
myContainer.getChildAtOrder(0);

// this will swap the order of two children
myContainer.swapOrder(0, 2);
myContainer.orderBefore('childToMove', 'refChild');
myContainer.orderAfter('childToMove', 'refChild');
```

##Setting other attributes
Other than the position and style of elements you can also set the following attributes:

TODO: explain the following methods:

DOMVisual.prototype.setElementAttributes
DOMVisual.prototype.setStyleAttributes
setClass, clearClass
setOverflow
setVisible
setCursor
setTransition (... tb fixed...)

TODO: (framework cleanup): make sure every time we have a specific function instead of a style there is a good reason for it.

Note: overflow, visible, cursor: should this be really different from styles?
My thought on this: ALL visual elements should support this.


##Adding a Configuration Sheet
All the visual elements that you create can be used as components of other visual elements. Whenever you place a visual element in the editor a small configuration sheet appears and lets you set some attributes to your component.

It is very easy to create a configuration sheet for your component. The only thing you have to do is to change the default implementation of getConfigurationSheet (that does nothing). So you can write:

```javascript
    MyClass.prototype.getConfigurationSheet = function () {
        var config = require('config');
        return {
            "title": config.inputConfig('Title: '),
            "blink": config.booleanCOnfig('Blink: ')
        };
    };
```

You will also need to add a getter and a setter for all the properties that you expose in your configuration sheet:

```javascript
    // 'set' + you config with an uppercased first character
    MyClass.prototype.setTitle = function (str) {
        this.str = str;
        // do something with this str here if you wish
    };

    MyClass.prototype.getTitle = function () {
        return this.str;
    };

    MyClass.prototype.setBlink = function (b) {
        this.blink = b;
    };

    MyClass.prototype.getBlink = function () {
        return b;
    };
```

The config methods currently supported in the config package are:
+ inputConfig(label): Lets the user input a string
+ inputConfigFullLine(label): Lets the user input a string (on a full line)
+ booleanConfig(label): Lets the user input a boolean (check box)
+ imageUrlConfig(label): Lets the user pick an image
+ styleConfig(label): Lets the user pick a style

TODO: add something to input a number with optional range validation

##Creating instances of visual components.
Visual components are exposed as a constructor that is exported by a package. Consequently, instanciating a visual component manually simply consists in doing something like:

```
    var myC = require('apackage').MyConstructor({ someOptional: 'config values'});
```

Then, when the graphic compoonent is created, it can simply be addded to a parent visual component by doing:

```
    parent.addChild(myC, 'childName');
```

There cannot be multiple children with the same name.

At this point, the child can be moved to a named position (a box in the parent's layout) by doing:

```
    myC.setPosition('theNameOfABox');
```

From that point the child will be pinned to that position and automatically resized if this position is itself resized by the parent.

##Flowing Elements
Swallowapps implements an absolute positioning model: graphic elements are explicitly positioned using a graphic editor. But sometimes it is very convenient to let HTML flow elements.

You can tell html to flow some of the elements of a given container by doing something like:

```javascript
    myContainer.getChild('myChild').setHtmlFlowing({position: 'relative'}, false);
```

TODO: setHtmlFlowing is still a bit of a mysterious function with weird arguments. The good thing is that we now have (in the editor and examples) a good documentation of many possible use cases (easily search-able with grep). At some point, the function should probably be renamed 'flow' and its argument made less cryptic.

##Development: Interfacing with Server Services
Most client side applications display data items that are retrieved from a server through http requests (ex: a list of users). Consequently most http applications are tightly coupled to one or more http services that must exist at development time.


To facilitate the whole development process (and avoid same origin conflicts), swallowapps can run as a middleware in your Express, Connect or bare bones NodeJS development server. All swallowapps urls share the same /swallow/ root (to avoid polluting your url namespace).

Here is how swallowapps can run in Express or Connect:
'''javascript
    var app = require('express').createServer(),
        swallowapps = require('swallowapps'),
        options = {
            work: '/path/to/your/work/folder'
        };
    app.use(swallowapps.getMiddleWare(options));

    // Do something with the app
    app.listen(1337);
'''

Here is how the same results could be achieved in a bare bones NodeJS solution:
'''javascript
    var http = require('http'),
        swallowapps = require('swallowapps'),
        options = {
            work: '/path/to/your/work/folder'
        },
        mw = swallowapps.getMiddleWare(options);

    srv = http.createServer(function (req, res) {
        // Note: optionally you could pass a next function to the middleware
        // as a 3rd argument. This next function is called when the middleware
        // does not consume the request.
        mw(req, res);
    }).listen(port, '0.0.0.0');
'''

In both cases, you will be able to run the Launcher from your own server on the following path: '/swallow/make/launcher.Launcher.html'.

##Deployment: Generating a Statically Servable of Your Apps
Swallowapps remakes application on the fly every time they are reloaded in the browser (only changed files are actually processed). This is reasonably fast but is not acceptable in a deployment environment. Happily, everything that is generated by swallowapps can be served statically. The 'publish' function does that. When you publish something, your work/publish folder will be updated and will contain a folder named 'yourpackage.YourComponent' that contains everything needed to run your application from the file system or from a static http server. The 'index.html' inside this folder will start the application.


#Advanced Features
This section discusses topics that will probably not be useful for playing with the tool but that will quickly become essential in some real life situations.

##Dealing with free flowing text and html: domquery
The visual components created with swallowapps are good at dealing with absolute positioning. They are perfect to create the layout of an application and to control all elements that must be explicitly positioned.

Swallowapps definitely allows that. You can create a DOMElement and simply assign html to it by doing:

```javascript
myElement.setInnerHTLM(someHtmlString);
```
Passed this point you can use external packages to deal with this HTML if you need to do so. Swallowapps also provides the 'domquery' package that lets you use css selectors to access and modify dom elements manually. The domquery package is still in an early stage of development but most css selectors are already supported. You can also use domquery to instanciate swallowapps components.

Here is a quick example of the use of domquery to find elements with the 'swallow' class and replace them by a button:

```javascript
        domquery('.swallow', el
        ).setVisual('baseui', 'Button', { text: 'hello'});
```

Here is a quick example of how swallowapps styles can be assigned to arbitrary elements:

```javascript
        domquery('.swallowstuff h1', el
        ).setStyle(visual.defaultSkin, 'samples', 'JSONAndLists', 'style'
        ).setMargins(40, 40, 40, 40
        ).setPadding(10, 10, 10, 10);
```

Note: more direct support for this will be added to the editor at some point (allowing you to easily preview what happens from the editor (and interactively style the html parts of your app)).

TODO: Also explain the builtin support for jQuery.

##Dealing with external data and lists: whiskers and markdown

If you need to convert JSON to html you can use the whiskers templating package:

```javascript
        console.log(whiskers.render('<test>{test}</test', { test: 'abcd' }));
```

If you need to convert markdown to html, you can use the markdown package. You can combine these two packages with domquery at your own convenience.


##Adding Tests to your Packages
You can add tests to your packages and run these tests from the TestViewer (http://localhost:1337/make/testviewer.TestViewer.html). You will find examples of this in many standard packages (http is a good example, because it demonstrates how asynchronous testing works).

+ Tests should be added in a sub-folder

##Adding JSDoc to your packages
The JSDoc that you add to your packages will be used by the helpviewer application to generate and display help files for your packages.

##Adding non visual packages
You are free to add any package that you want in work/packages. Swallowapps packages must declare the 'pillow' engine as shown here:

```javascript
{
    "name": "myPackage",
    "version": "0.0.1",
    "engines": {
        "pillow": "*"
    }
}
```


#More Advanced Features

##Multiple Layouts
TODO: explain this

##Custom positioning
TODO: explain the use of visual.setPosition(function (parentDimension, layout) {}) and explain how a visual component's applyLayout method could be overridden to support a different positioning system.

##Application Domains
If you need to load packages at execution time, you can use application domains to make sure that, when you stop referencing the packages you loaded, all their dependencies will also be unloaded (missing dependencies will be loaded in the same application domain as the main package that you load).

Here is how you can load a package dynamically at runtime:
```javascript
    visual.loadPackage('mypackage', applicationDomain, reload, forTesting, callback)
```

FIXME: define.pillow.createApplicationDomain()... we should have something in visual to do that
