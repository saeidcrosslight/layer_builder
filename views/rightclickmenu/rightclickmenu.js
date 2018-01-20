angular
        .module('rightclickmenu.event', [])
        .directive('rightclickmenu', function () {
            return {
                replace: true,
                restrict: 'EA',
                templateUrl: 'views/rightclickmenu/rightclickmenu.html'
            };
        })

        .controller('rightClickController', ['product','$rootScope', '$scope', 'file', function ( product,$rootScope, $scope, file) {
                // *****************************
                $scope.rightClickEvent = function ( ) {
                    debugger;
                    //console.log(obj);
                    menuid = 22;
                    fileName= "camel.layer";
                    filePath = "C:\\NovaTCAD\\Apsys\\apsys_examples\\A_tutorial\\camel.layer";
                    //appName = app.APSYS;
                    fileListObject = "ApsysProjectFilelist";
                    subpath = "\\apsys";

                    layer = "\\layer.exe"

                    var product = $rootScope.product;
                    //var eid = product.editors.getCurrentEditorObject(product).editorID;
                    var gui = require('nw.gui'),
                        clipboard = gui.Clipboard.get();
                    //Process this .layer file to generate .geo(.layer)
                    product.createBatFileToRun(subpath + layer, fileName, filePath, "layerProcessToGeo", "temp.bat", 0);

                }

            }]);