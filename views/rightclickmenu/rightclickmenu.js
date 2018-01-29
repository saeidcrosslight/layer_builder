angular
        .module('rightclickmenu', [])
        .directive('rightclickmenu', function () {
            return {
                replace: true,
                restrict: 'EA',
                templateUrl: 'views/rightclickmenu/rightclickmenu.html'
            };
        })
        .controller('rightClickController', ['product','$rootScope', '$scope', 'file', function ( product,$rootScope, $scope, file) {
            debugger;


            console.log(product);

            $scope.rightClickEvent = function (menuid, fileName, filePath, treeType) {
                debugger;
                //console.log(obj);
                var product = $rootScope.product,


                    subpath = "\\apsys";

                //var eid = product.editors.getCurrentEditorObject(product).editorID;
                var gui = require('nw.gui'),
                    clipboard = gui.Clipboard.get();
                switch (menuid) {

                    case 15: //Generate mesh(.geo)
                        product.createBatFileToRun(subpath + product.GEOMETRY, fileName, filePath, "geoGenerateMesh", "temp.bat", 0);
                        break;

                    case 22: //Process this .layer file to generate .geo(.layer)
                        product.createBatFileToRun(subpath + product.LAYER, fileName, filePath, "layerProcessToGeo", "temp.bat", 0);
                        break;

                }
            };



/*                            // *****************************
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
                                //var product =  product.createProductObject();
                                //var product = product.createBatFileToRun();
                                var product = $rootScope.product;
                                //var eid = product.editors.getCurrentEditorObject(product).editorID;
                                var gui = require('nw.gui'),
                                    clipboard = gui.Clipboard.get();
                                //Process this .layer file to generate .geo(.layer)
                                product.createBatFileToRun(subpath + layer, fileName, filePath, "layerProcessToGeo", "temp.bat", 0);

                            }*/

            }]);