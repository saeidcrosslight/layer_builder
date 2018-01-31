'use strict';

angular
        .module('shortcut.event', [])
        .controller('contentController', ['$rootScope', '$scope', 'file', function ($rootScope, $scope, file) {

/*                //$rootScope.simucenter.CSuprem.editors.setEditorData("csuprem");
                var simucenter = $rootScope.simucenter,
                        autoTCAD = $rootScope.simucenter.autoTCAD;
                document.onkeydown = function (event) {
                    
                    var e = event ? event : (window.event ? window.event : null),
                            currKey = 0,
                            product = simucenter.currentProduct();
                    var currentEditor = product.editors.getCurrentEditorObject(product);
                    if (currentEditor.editorID !== "")
                        var editor = ace.edit(currentEditor.editorID);
                    currKey = e.keyCode || e.which || e.charCode;
                    if (currKey === 83 && e.ctrlKey) {         //Ctrl+S
                        product.editors.saveCurrentFile(product);
                    } else if (currKey === 87 && e.ctrlKey && e.shiftKey) { // Ctrl+Shift+W  -- Close all files
                        var eObject = product.editors.getEditorObject(product.productName, '', '');//filepath(last parameter)
                        product.editors.closeAllFile(eObject.editorContainerID, product.openFiles);
                        product.showStartPage = true;
                    } else if (currKey === 87 && e.ctrlKey) {  //Ctrl+W  -- Close the current file
                        var editorArrayObject = product.editors.getEditorArray(product.productName),
                                editorObject = product.editors.getCurrentEditorObject(product);
                        if (editorObject !== null)
                            product.editors.closeFile(product, editorObject.fileName, editorObject.filePath, editorArrayObject);
                    } else if (currKey === 80 && e.ctrlKey) {  //Ctrl+P
                        console.log('Ctrl+P');
                    } else if (currKey === 78 && e.ctrlKey) {  //Ctrl+N
                        console.log('Ctrl+N');
                    } else if (currKey === 79 && e.ctrlKey) {  //Ctrl+O Open
                        console.log('Ctrl+O');
                    } else if (currKey === 67 && e.ctrlKey) {  //Ctrl+C
                        console.log('Ctrl+C');
                    } else if (currKey === 86 && e.ctrlKey) {  //Ctrl+V
                        
                    } else if (currKey === 88 && e.ctrlKey) {  //Ctrl+X
                       
                    } else if (currKey === 90 && e.ctrlKey) {  //Ctrl+Z                        
                        product.editors.undoRedo(product);
                        
                    } else if (currKey === 89 && e.ctrlKey) {  //Ctrl+Y                        
                        product.editors.undoRedo(product);
                       
                    } else if (currKey === 65 && e.ctrlKey) {  //Ctrl+A
                        console.log('Ctrl+A');
                    } else if (currKey === 72 && e.ctrlKey) {  //Ctrl+H(Replace)
                        console.log('Ctrl+H(Replace)');
                    } else if (currKey === 70 && e.ctrlKey) {  //Ctrl+F
                        console.log('Ctrl+F');
                    } else if (currKey === 75 && e.ctrlKey) {  //Ctrl+K(Comment Text)
                        product.editors.commentOut(product);
                        product.editors.saveCurrentContent(product);
                    } else if (currKey === 82 && e.ctrlKey) {  //Ctrl+R(Remove Comments)
                        product.editors.removeCommentOut(product);
                        product.editors.saveCurrentContent(product);
                    } else if (currKey === 66 && e.ctrlKey) {  //Ctrl+B(Preference)
                        console.log('Ctrl+B(Preference)');
                    } else if (currKey === 8 && e.altKey) {    //Alt+Backspace
                        console.log('Alt+Backspace');
                    } else if (currKey === 46 && e.shiftKey) { //Shift+Delete(cut)
                        
                    } else if (currKey === 46) {               //Delete
                        
                    } else if (currKey === 65 && e.ctrlKey) {  //Ctrl+A
                        console.log('Ctrl+A');
                    } else if (currKey === 114) {              //F3
                        console.log('F3');
                    } else if (currKey === 114 && e.shiftKey) {//Shift+F3
                        console.log('Shift+F3');
                    }
                    product.refreshUndoRedo(product);
                    $("#fixNoRefresh").click();
                };
                
                document.onkeyup = function () {//when edit in editor, save current content
                    var product = simucenter.currentProduct();
                    product.editors.saveCurrentContent(product);
                }*/

                
                //hide right-click pannel
                $("body").bind("mousedown", function (event) {
                    var e = event ? event : (window.event ? window.event : null);
                    if (e.button === 0) {
                        setTimeout(function () {
                            $rootScope.product.rightClickMenu.hide();
                        }, 150);
                    }
                });
                
                
                
/*                $scope.deleteSeriesData = function (seriesIndex, seriesName) {
                    var product = simucenter.currentProduct();
                    autoTCAD.seriesList.splice(seriesIndex, 1);
                    product.clearProjectFolder(product.projectPath + '\\Projects\\' + seriesName);
                    file.writeallsync(product.projectPath + '\\Projects\\series.json', angular.toJson(autoTCAD.seriesList));
                };

                $scope.deleteAllSeries = function () {
                    if (confirm('Are you sure delete all series projects?')) {
                        var product = simucenter.currentProduct(),
                                projectPath = product.projectPath + '\\Projects',
                                seriesFilePath = projectPath + '\\series.json';
                        autoTCAD.seriesList = [];
                        file.writeallsync(seriesFilePath, angular.toJson([]));
                        product.clearProjectFolder(projectPath);
                    }
                };

                $scope.loadSeries = function (seriesIndex) {
                    autoTCAD.seriesObject = autoTCAD.seriesList[seriesIndex];
                    $("#DeleteOrLoadSeriesWindow").modal('toggle');
                };*/
            }]);