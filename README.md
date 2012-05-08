webglot
=======

This is a code base that I developed mostly in the 3-4 months after 
attending SIGGRAPH Asia 2009, and learning about WebGL. At the time
I was very interested in visualization, and mathematical rendering
in particular. My vision was that `webglot` could be a library for
performing some normally computationally-intensive visualization in
the browser.

__NOTE__: I have not run much of this since it was under active development.
It has not necessarily aged well, in the sense that I've not been able
to easily run it under modern versions of Chrome or WebKit. My 
suspicion is just that it requires a few tweaks to calls to the 
underlying WebGL APIs, as has been necessary in the past. Also, please
excuse any anti-idioms -- I was relatively new to JavaScript at the 
time, and I look back at much of it now with a shake of the head :-/

__NOTE__: I had originally included some external JavaScript libraries,
including mootools, scriptaculous, prototype, but I don't believe that
they're very pervasively used. That said, you may need to replace their
use or download them for a couple of the demos.

Shaders
-------
Virtually all of the primitives use fragment shaders at this point
to accomplish their various tasks.  Any primitives that don't will
likely be deprecated, but some will be kept - this will be decided
on a case by case basis.

This means several things. First, in order to use this package you
will need a graphics card that supports GLSL and fragment, vertex
and geometry shaders.  Most modern hardware seems to support the
first two, but the third is not as ubiquitous, though by and large
it seems to be supported.  If this turns out to not be the case, I
will look at maintaining two versions of certain key primitives.

Second, functions no longer need to be specified by function point-
ers. This package makes use of GLSL's JIT compiling of shaders to
get a free parsing at the same time. The function class will likely
remain in the next few versions, but it should be considered unsafe
to use at this point.

Primitives
----------

# Contour

Contours, or iso-curves can be represented with the contour class.
It accepts a function in x, y and t (see section 4) and renders
the iso-curve for that function at z = 0.  Future versions will
have support for user-specified iso-values.
		
# Flow

Flow fields can be rendered with the flow class. They use highly-
accurate Runge-Kutta integration for dye advection in the form of
a streamline.  I would like to support pathlines and streaklines
in future releases, but for the time being it's "limited" to str-
eamlines.

Currently there are only uniformly-spaced streamlines, but I'm
looking at a paper to implement a good spacing algorithm.
	
# Parametric Curves

Parametric curves are represented by x and y coordinates returned
as a function of some parameter s. NOTE: In their current incar-
nation parametric curves to not support time-dependence. These
also are not calculated by a shader at this point, but this will
take place in the next release.
	
# Scalar Field

A scalar-valued function of x, y, and t (see section 4) can be 
rendered with this scalar field class. It's rendered in the frag-
ment shader and expects the value of the function to be normalized
to [-1,1].

# Curve

The curve class now has its values calculated and its geometry 
determined on the graphics card.
		
Time Dependence
---------------

Most (and unless I've forgotten something) primitives support time
dependence.  That means that in addition to the x (and in some cases
y variables) one can use the value t as time.  This is measured from
the time that grapher::initialize is called, and I'm deciding how
best to provide the programmer access to changing this.  Input is
welcome on this item, and things I'm considering are: a reset function
to reset the timer, and user-specified offsets for each primitive. 
(Like, the user could specify that one primitive might use the time
plus 3.5 seconds and another might use time minus 3.14 second, etc.)
	
Grapher Restructuring and Extensibility
---------------------------------------

The grapher container class no longer needs to be heavily modified in
order to add support for a new primitive. A primitive may inherit from 
the primitive class and must simply provide GL-style way to represent
its geometry. A shader may be specified by storing the shader program
handle in the class's value p, inherited from primitive.
	
Deprecations
------------

# Vector Field
	
Vector fields will likely be removed, replaced by the more represent-
ative and flexible flow field.
		
# Line

A separate line class is likely no longer needed, if adaptive sampling
can be achieved.  Either way, since curves are calculated mostly on 
the graphics hardware anyway, there isn't any justification in keeping
a separate primitive around anyway.
