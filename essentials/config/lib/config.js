/**
    config.js
    
    Copyright (c) Hugo Windisch 2012 All Rights Reserved
*/
/*globals define */

function loadConstructor(
    factory,
    type,
    cb
) {
    // 1. load the factory
    define.meat.loadPackage(factory, function (err) {
        var p, Constr;
        if (err) {
            return cb(err);
        }
        try {
            p = require(factory);
        } catch (e) {
            return cb(e);
        }
        Constr = p[type];
        if (Constr) {
            cb(null, Constr);
        } else {
            return cb(new Error('Constructor not found ' + type));
        }
    });
}

function leftRightConfig(
    labelTxt, 
    factory,
    type,
    config,
    lineHeight,
    lineWidth,
    labelWidth,
    cb
) {
    // intentionally here
    var domvisual = require('domvisual'),
        visual = require('visual'),
        baseui = require('baseui');
        
    loadConstructor(factory, type, function (err, Constr) {
        var cnt, label, editor;
        if (err) {
            return cb(err);
        }
        // create the graphic elements that we need
        cnt = new (domvisual.DOMElement)({});
        label = new (baseui.Label)({ text: labelTxt});
        editor = new Constr(config);
        cnt.setDimensions([lineWidth, lineHeight, 1]);
        cnt.addChild(label, 'label');
        cnt.addChild(editor, 'data');
        label.setDimensions([labelWidth - 10, lineHeight, 1]);
        label.setMatrix([1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  5, 0, 0, 1]);
        editor.setDimensions([lineWidth - (labelWidth + 20), lineHeight, 1]);
        editor.setMatrix([ 1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  labelWidth + 5, 0, 0, 1]);
        cb(null, cnt);
    });
}

function topBottomConfig(
    labelTxt, 
    factory,
    type,
    config,
    lineHeight,
    lineWidth,
    labelHeight,
    cb
) {
    // intentionally here
    var domvisual = require('domvisual'),
        visual = require('visual'),
        baseui = require('baseui');
        
    loadConstructor(factory, type, function (err, Constr) {
        var cnt, label, editor;
        if (err) {
            return cb(err);
        }
        // create the graphic elements that we need
        cnt = new (domvisual.DOMElement)({});
        label = new (baseui.Label)({ text: labelTxt});
        editor = new Constr(config);
        cnt.setDimensions([lineWidth, lineHeight, 1]);
        cnt.addChild(label, 'label');
        cnt.addChild(editor, 'data');
        label.setDimensions([lineWidth - 10, labelHeight, 1]);
        label.setMatrix([1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  5, 0, 0, 1]);
        editor.setDimensions([lineWidth - 10, lineHeight - labelHeight, 1]);
        editor.setMatrix([ 1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  5, labelHeight, 0, 1]);
        cb(null, cnt);
    });

}

function inputConfig(label) {
    return function (editorInfo, cb) {
        leftRightConfig(
            label, 
            'baseui',
            'Input',
            {},
            25,
            390,
            100,
            function (err, ctrl) {
                if (err) {
                    return cb(err);
                }
                // we should setup the editor that we got,
                // to add set data and get data and notification
                ctrl.setData = function (txt) {
                    ctrl.children.data.setText(txt);
                };
                ctrl.getData = function () {
                    return ctrl.children.data.getText();
                };
                cb(err, ctrl);                
            }
        );
    };
}

function imageUrlConfig(label) {
    return function (editorInfo, cb) {
        var http = require('http'),
            data = '';
    
        http.get({ path: '/image/' + editorInfo.factory}, function (res) {
            res.on('data', function (d) {
                data += d;
            });
            res.on('end', function () {
                var jsonData = JSON.parse(data);
                topBottomConfig(
                    label, 
                    'baseui',
                    'ImagePicker',
                    { urls: jsonData },
                    100,
                    390,
                    25,
                    function (err, ctrl) {
                        if (err) {
                            return cb(err);
                        }
                        // we should setup the editor that we got,
                        // to add set data and get data and notification
                        ctrl.setData = function (txt) {
                            ctrl.children.data.setSelectedUrl(txt);
                        };
                        ctrl.getData = function () {
                            return ctrl.children.data.getSelectedUrl();
                        };
                        ctrl.children.data.on('change', function (sel) {
                            ctrl.emit('change', sel);
                        });
                        cb(err, ctrl);                
                    }
                );


            });
            res.on('error', function (e) {
                cb(e);
            });
        });    
    };
}


exports.leftRightConfig = leftRightConfig;
exports.inputConfig = inputConfig;
exports.imageUrlConfig = imageUrlConfig;

