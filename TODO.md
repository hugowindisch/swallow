
##mvvm bindings versus params
It is not clear why those are actually different. Could they be fully integrated?
Params! some are mvvm some are not. The property sheet is the only sheet.

* unify params and mvvm params at least from the construction perspective
* make a usable ui for mvvm params especially when connecting to an action (or
controller) : the firing thing

#top level bindings
The top level application will not have params (since no code is written)
but potentially bindings. Like, very probably a data binding: Where to get
the data (some kind of with)! It this the only useful binding at the top
level? Like the model?

##Mvvm ui
Pretty much nothing at this point... Very hard to use and even harder to
understand...

##Styles
Styles should be shared in a component and exported between components. There
should be one style 'sheet' per component

+ a given style could have MANY different local skins. So you could have two
local styles for a button. So when you place a button, you can: take the default
styling, take one of the local overrides, ad a new local override.

+ deep restyling: not a major issue (conceptually complex and therefore...
probably bad). If you import a component, and want to restyle it, should you
be able to restyle it DEEPLY? My current answer: probably not.

##Layout and auto resizing
NOT using the default system from css is a disputable decision. I kinda feel
that it is a good decision and that a lot of things can be made easier because
of it.

BUT

Right now the auto resizing thing SUCKS and a real solution is needed for that.

##auto building
+ groups should be regenerated in the build process (i.e. not exist on disk, not
be checked in in git, etc.) We now have what's needed to easily do this in
the build process.


##Usability
most of what is there, I fundamentally like. But the result is not sooo pleasant
to use to say the least.

+ tabs (for opened documents)
+ rulers

LEFT BAR: full (as it is now) or tabbed?

+ VISUAL (graphic design) improvement

##Visual Apperance

#Releases
First MVVM release
