/**
    tutorial.js

    The SwallowApps Editor, an interactive application builder for creating
    html applications.

    Copyright (C) 2012  Hugo Windisch

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
*/

var visual = require('visual'),
    domvisual = require('domvisual'),
    utils = require('utils'),
    config = require('config'),
    group = {
        // authoring dimension
        dimensions: [ 600, 500, 0],
        positions: {
            background: {
                order: 0,
                matrix: [ 600, 0, 0, 0, 0, 500, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ],
                snapping: {
                    left: 'px',
                    right: 'px',
                    width: 'auto',
                    top: 'px',
                    bottom: 'px',
                    height: 'auto'
                }
            },
            video: {
                order: 1,
                matrix: [ 600, 0, 0, 0, 0, 450, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ],
                snapping: {
                    left: 'cpx',
                    right: 'cpx',
                    width: 'auto',
                    top: 'cpx',
                    bottom: 'cpx',
                    height: 'auto'
                }
            },
            done: {
                order: 2,
                matrix: [ 60, 0, 0, 0, 0, 30, 0, 0, 0, 0, 1, 0, 540, 470, 0, 1 ],
                snapping: {
                    left: 'cpx',
                    right: 'cpx',
                    width: 'auto',
                    top: 'cpx',
                    bottom: 'cpx',
                    height: 'auto'
                }
            }
        },
        children: {
            background: {
                factory: "domvisual",
                type: "DOMElement",
                config: {
                    style: "background",
                    position: "background"
                }
            },
            video: {
                factory: "domvisual",
                type: "DOMElement",
                config: {
                    position: "video"
                }
            },
            done: {
                factory: "baseui",
                type: "Button",
                config: {
                    text: "Done",
                    position: "done"
                }
            }
        }
    };


function Tutorial(config) {
    var that = this,
        inner = '<object width="600" height="450"><param name="movie" value="http://www.youtube.com/v/SXQEPokWYog?version=3&amp;hl=en_US"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube.com/v/SXQEPokWYog?version=3&amp;hl=en_US" type="application/x-shockwave-flash" width="600" height="450" allowscriptaccess="always" allowfullscreen="true"></embed></object>';
    domvisual.DOMElement.call(this, config, group);
    this.getChild('video').addHtmlChild(
        'div',
        inner
    );
    this.getChild('done').on('click', function () {
        that.remove();
    });
}

Tutorial.prototype = new (domvisual.DOMElement)();

Tutorial.prototype.getDescription = function () {
    return "A Tutorial";
};

Tutorial.prototype.getActiveTheme = visual.getGetActiveTheme('baseui', 'Tutorial');

Tutorial.prototype.theme = new (visual.Theme)({
    background: {
        jsData: {
            backgroundColor: {r: 0, g: 0, b: 0, a: 0.5}
        }
    }
});

Tutorial.createPreview = function () {
    return new Tutorial({text: 'Tutorial'});
};

Tutorial.prototype.getConfigurationSheet = function () {
    return {};
};

Tutorial.prototype.setUrl = function (url) {
    this.url = url;
    return this;
};

exports.Tutorial = Tutorial;
