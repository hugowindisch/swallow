The goal is to make it the best tool for creating application that rely on absolute positioning (growable absolute positioning). A good example of this is a news (or blog) reader for the mobile.

Here I use the tool for creating a news/blog reader application for the mobile and I document the painful parts of the process.

#Creating the newsreader
##Things I want to do
+ Central styling
+ Topic list, that is a list of viewers stacked vertically
+ Topic which is either an HTML file or a markdown content that may embed applications


##Pains & Annoyances
+ It should be easy to rename visual components (even if there is no code refactoring, there should be at least some kind of renaming)
+ By actually separating the classname from the vis, it would remain relatively easy to do.
+ Drag and drop should be supported.
+ Mixing 'flow' and 'absolute' positioning remains a brain twister in some cirtcumstances.
+ Pinning to a generated position: if we don't use layout positions for moving things around (and that layout positions are resized) everything becomes more difficult. There should be a way to create a position by software that would be automatically scaled.
+ When we want to animate something, we place it to an initial position first, an then we move it with a transition. But we need to 'wait' a bit to do that, and for doing this we use setTimeout. This whole process pretty much sucks. (especially, calling visual.update)
+ While we develop there are syntactic bugs in the packages that we develop and this breaks the launcher (temporarily)
+ The 'global style' thing: we don't see the styles in the editor before the global styling thing has run I think... this makes it quite painful.
+ Resizing topics: we use html flowing for topics but still want to resize them. This apparently does not work right now (even if the sizing thing is set to true)... Maybe more options would be needed here.
+ There is not graphic way (in the editor) of specifying how children are clipped (overflow). This must currently be done in code and this is bad.
+ The back button (make this work OR hide it completely)
+ The acceleration thing
+ The rotation (how to make it NOT scale our thing in any way)
+ Multiple layouts


##Wishes:
+ Alternate layouts
+ It should be possible to "preview" lists to easily apply styling to them.
+ Central styling is cool, but (with the editor as it is now), makes it difficult to preview changes (because the styles are in another document). Skinning is fun BUT when you work in the same package, it is unlikely that you want to SKIN (you rather want to EDIT the styles from another document...). A workaround for this is to have a copy of all your styling elements in the master style document (this is quite convenient in fact!). But this remains difficult to do right now since we cannot copy/paste between pages.

##Other thoughts:
+ for firing events (to the document) the separate (EventEmitter) event emitter thing kinda sucks. This is fixable (to some point)... But I start questioning the
use of the EventEmitter interface...
+ (re thinking something) THe fact that components are referred by their package,type still seems ok to me (i.e. that the construction pattern is : construct the CLASS, that knows its graphic resources and NOT construct the graphic resources that know their classes... BUT it should be easy to create an alternate layout for something).
+ The whole 'one tab per visual' may not be the best idea after all...

##Other pains
+ not being able to take a node package as-is is painful. Very little is needed to make this work (setting different test scripts).
+ meta tags for phone
