Pillow scans directories for commonJS packages and makes them accessible
in the browser (the packages are converted to a directory that can
be served statically).

Pillow can operate from the command line or as a server. When running as
a server it will regenerate everything on the fly (remake the packages
depending on what has changed in the source directories).

Images (png, jpg) are also copied to the output folder keeping the original
folder hierarchy relative to the package.json to which they belong.

Installation
============
npm install -g pillow


Command line operation
======================
This assumes the package was installed globally. If not, pillowscan aliases
to bin/pillowscan.js.

**pillowscan [options] folder1 [folder2..foldern]**

Options:

**--help**: displays help information

**-jquery=filepath**: includes and integrates jquery using the provided sources

**-only=pathRelativeToDstFolder**: only remakes the specified file

**-cache=packageName,packageName2**: Use http caches for the specified package

**-cacheext=ext1,ext2,ext3**: Use http caches for the specified package

**-css**: Includes all dependent css files in the resulting html

**-html**: Generate a package.html

**-minify**: Minifies js file while packaging them

**-nomake=package1,package2,package3** : Prevents some packages from being
regenerated

**-port=portnumber**: Uses the specified port in server mode (instead of 1337)

**-work=path**: Working directory (defaults to the current directory).

example
-------

pillowscan mypackages

Will scan mypackages and its subdirectories and generate or update ./generated
that will contain properly packaged sources and assets.


Server operation
================
This assumes the package was installed globally. If not, pillowserve aliases
to bin/pillowserve.js.

**pillowserve [options] folder1 [folder2..foldern]**

(see pillowscan for options)

will make all packages loadable at:

http://localhost:1337/make/packageName/packageName.js

So you can do:

curl -X GET http://localhost:1337/make/packageName/packageName.js

Library operation
=================

The following functions are available from the pillow package:

serve

makeAll

makePackage

makeFile

processArgs

findPackages

These will be documented later.

Structure of the generated folder
=================================

The generated folder will have the following structure:

    generated/

        pillow.js

        package1/

            package1.js

            some/

                subdir/

                    for/

                        images/

                            img1.png

Assuming that img1.png was located at ./some/subdir/for/images/img1.png relative
to the package.json file.

More advanced features
======================

Pillow supports many different applicationDomains (each applicationDomain
being able to have his own versions of packages). It also supports loading
or reloading packages at run time.

License
=======

MIT License

Copyright (C) 2012 Hugo Windisch

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
