/**
 * Created by Saeid Sadeh on 11/26/2017.
 */
angular
    .module('CrosslightApp', ['ui.tree', 'crosslight.nodejs', 'filetree.directive',
        'drawingTool.directive', 'message.directive', 'rightclickmenu',
        'object.autotcad', 'object.messages', 'object.filetree',
        'object.editor', 'object.rightclickmenu', 'object.wizard', 'object.validator', 'object.networks',
        'object.product','header.directive','navigation.controller','quick.controller'])
    .run(function ($rootScope, product) {
        debugger;
        $rootScope.product = $.extend({}, product.createProductObject(), {
            productName: 'Apsys',
            title : 'Welcome to SimuCenter - SimuApsys',
            appPathName: 'ApsysPath',
            wizardPropertyList: []
        })
        $rootScope.product.init();

    })

