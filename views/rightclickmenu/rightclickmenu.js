angular
        .module('rightclickmenu.event', [])
        .directive('rightclickmenu', function () {
            return {
                replace: true,
                restrict: 'EA',
                templateUrl: 'views/rightclickmenu/rightclickmenu.html'
            };
        })

        .controller('rightClickController', ['$rootScope', '$scope', 'file', function ($rootScope, $scope, file) {
                var product = $rootScope.simucenter.currentProduct(),
                        editor = product.editors,
                        filetree = product.filetree,
                        simuApp = new $rootScope.simucenter.crosslightApp,
                        showProperty = function (fileName, filePath, x, y) {
                            var fileState = file.statSync(filePath);
                            $("#showPropertyFileName").text(fileName);
                            $("#showPropertyFileName2").text(fileName);
                            $("#showPropertyFilePath").text(filePath);
                            $("#showPropertySize").text(fileState.size);
                            $("#showPropertyCreateTime").text(fileState.ctime);//Fri Mar 18 2016 10:47:44 GMT+0800 (Chinese standard time)
                            $("#showPropertyModifyTime").text(fileState.mtime);
                            $("#showPropertyAccessTime").text(fileState.atime);
                            var pw = $("#showPropertyWindow");
                            pw.css("display", "");
                            var winHeight = pw.css("height");
                            if (y + parseInt(winHeight.substring(0, winHeight.length - 2)) > document.documentElement.clientHeight)
                                pw.css("top", (y - 310) + "px");
                            else
                                pw.css("top", (y - 210) + "px");
                            pw.css("left", (x - 30) + "px");
                            pw.show();
                        },
                        openLayer3d = function (product, fileName, filePath) {
                            var projectPath = product.projectPath,
                                    msgbox = product.message.runtime;
                            product.message.setMessageActive(product.message, product.message.runtime);
                            if (fileName === undefined) {//open with quick menu
                                if (projectPath) {
                                    var files = file.readfoldersync(projectPath);
                                    var layerfiles = [];
                                    angular.forEach(files, function (eachfile) {
                                        if (product.getExtensionName(eachfile) === 'layer') {
                                            layerfiles.push(eachfile);
                                        }
                                    });
                                    if (layerfiles.length === 0)
                                        product.callAppToRun(product, product.appPath + simuApp.LAYER3D, filePath, projectPath, msgbox);
                                    else if (layerfiles.length === 1)
                                        product.callAppToRun(product, product.appPath + simuApp.LAYER3D, projectPath + "\\" + layerfiles[0], projectPath, msgbox);
                                    else if (layerfiles.length > 1) {//here must popup a window to show all layer files to give user to choose
                                        angular.forEach(layerfiles, function (eachfile) {//?????
                                            product.callAppToRun(product, product.appPath + simuApp.LAYER3D, eachfile, projectPath, msgbox);
                                        });
                                    }
                                } else {
                                    product.filetree.openFileWithApp(product.appPath + simuApp.LAYER3D, '');
                                }
                            } else {// open with right click
                                if (filePath === "") {
                                    product.callAppToRun(product, product.appPath + simuApp.LAYER3D, '', projectPath, msgbox);
                                } else {
                                    product.callAppToRun(product, product.appPath + simuApp.LAYER3D, filePath, projectPath, msgbox);
                                }
                            }
                        },
                        geoGenerateAll = function () {
                            //find all geo files, then run geoGenerateMesh()
                        },
                        layerProcessAll = function () {
                            //find all layer files, then run layerProcessToGeo()
                        },
                        runBatFile = function (product, filePath, treeType) {
                            var projectPath = product.projectPath;
                            if (treeType === 'seriesfile') {
                                var fnum = filePath.lastIndexOf("\\");
                                projectPath = filePath.substr(0, fnum - 1);
                            }
                            product.message.runtime.content = [];
                            product.callAppToRun(product, '', filePath, projectPath, product.message.runtime);
                        },
                        plotPlt = function (product, treeType, fileName, filePath) {//??????need call back function?   (.gnu file has this right-click)
                            var projectPath = product.projectPath,
                                    aname = simuApp.APSYS;
                            if (product.productName === "Pics3d")
                                aname = simuApp.PICS3D;

                            if (treeType === 'seriesfile') {
                                var fnum = filePath.lastIndexOf("\\");
                                projectPath = filePath.substr(0, fnum - 1);
                            }
                            if (projectPath) {
                                //var files = file.readfoldersync(projectPath);
                                //for (var i = 0; i < files.length; i++) { 
                                //if (product.getExtensionName(files[i]) === 'plt') { 
                                product.createBatFileToRun(aname, fileName, projectPath + '\\' + fileName, "pltViewResult", "viewresult.bat", 0);
                                //break;
                                //}
                                //}
                            }
                        };

                changeMater = function () {
                    $scope.$apply(function () {
                        $scope.materialLabel = $("#materialName").val();
                    });
                };



                $scope.showPropertyOK = function () {
                    $("#showPropertyWindow").hide();
                };


                // *****************************
                $scope.rightClickEvent = function (menuid, fileName, filePath, treeType) {
                    debugger;
                    //console.log(obj);
menuid = 22;
fileName= "camel.layer";
                    product = $rootScope.simucenter.Apsys;
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