angular
        .module('rightclickmenu.event', [])
        .directive('rightclickmenu', function () {
            return {
                replace: true,
                restrict: 'EA',
                templateUrl: 'views/rightclickmenu/rightclickmenu.html'
            };
        })

        .controller('rightClickController', ['$rootScope', '$scope', 'file','product', function ($rootScope, $scope, file, product) {
                // *****************************
                $scope.rightClickEvent = function (menuid, fileName, filePath, treeType) {
                    debugger;
                    //console.log(obj);
                    menuid = 22;
                    fileName= "camel.layer";
                    product = product.createProductObject();
                    appName = app.APSYS;
                    fileListObject = "ApsysProjectFilelist";
                    subpath = "\\apsys";

                    var eid = product.editors.getCurrentEditorObject(product).editorID;
                    var gui = require('nw.gui'),
                        clipboard = gui.Clipboard.get();


                    //Process this .layer file to generate .geo(.layer)
                    product.createBatFileToRun(subpath + simuApp.LAYER, fileName, filePath, "layerProcessToGeo", "temp.bat", 0);

                }

            }]);