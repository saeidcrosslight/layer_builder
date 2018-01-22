
angular.module('navigation.controller', [])
        .controller('navigationController', ['$rootScope', '$scope', 'childprocess','file', function ($rootScope, $scope, childprocess, file) {
                $scope.fontSizeList = ["12px", "14px", "16px", "18px", "20px", "24px", "28px", "30px", "36px", "42px", "48px"];
                $scope.fontZoom = ["90%", "100%", "110%", "120%", "130%", "140%", "150%", "160%", "170%", "180%", "190%", "200%"];
debugger;

         /*       var simucenter = $rootScope.simucenter,
                        csuprem = simucenter.CSuprem,
                        apsys = simucenter.Apsys,
                        pics3d = simucenter.Pics3d,*/
                     var product = $rootScope.product,
                        gui = require('nw.gui'),
                        clipboard = gui.Clipboard.get(),
                        openHelpFile = function (filepath) {
                            childprocess.callbackground(filepath, "", "", function (data) {
                            }, function (data) {
                            }, function (data) {
                            });
                        },
                        closeSimucenter = function () {
                            var product = simucenter.currentProduct();
                            product.editors.saveAllOpenFiles(product, 1); //auto save project

                            var filePath = product.getCurrentPath() + "\\stop.bat";
                            file.writeallsync(filePath, "taskkill \/f \/im SimuCSuprem.exe \/t \r\ntaskkill \/f \/im SimuApsys.exe \/t \r\ntaskkill \/f \/im SimuPics3d.exe \/t");
                            product.executeFile(filePath, function () {});
                        };

                        $scope.apsysNavigationEvent = function (pindex, index, helpPath) {
                            switch (pindex) {
                                case 0: //File
                                    switch (index) {
                                        case 0: //New
                                            newFileFunction();
                                            break;
                                        case 1: //Open
                                            $("#fileDialog_Apsys").click();
                                            break;
                                        case 2: //Import
                                            console.log("Import");
                                            break;
                                        case 3: //Import macro
                                            console.log("Import macro");
                                            break;
                                        case 4: //New project
                                            newProjectFunction();
                                            break;
                                        case 5: //Open project
                                            $("#fileDialog_Apsys").click();
                                            break;
                                        case 6: //Close project
                                            closeProjectFunction(apsys);
                                            break;
                                        case 7: //Save project
                                            apsys.editors.saveAllOpenFiles(apsys);
                                            break;
                                        case 8: //Close
                                            var editorArrayObject = apsys.editors.getEditorArray(apsys.productName),
                                                    editorObject = apsys.editors.getCurrentEditorObject(apsys);
                                            if (editorObject !== null)
                                                apsys.editors.closeFile(apsys, editorObject.fileName, editorObject.filePath, editorArrayObject);
                                            break;
                                        case 9: //Save
                                            apsys.editors.saveCurrentFile(apsys);
                                            break;
                                        case 10: //Save as...
                                            console.log("Save as...");
                                            break;
                                        case 12: //Print...
                                            console.log("Print...");
                                            break;
                                        case 13: //Print preview
                                            console.log("Print preview");
                                            break;
                                        case 14: //Print Setup
                                            console.log("Print Setup");
                                            break;
                                        case 16: //Recent Files
                                            if (apsys.editors.isFileOpen('Start Page', 'startpage', apsys.openFiles)) {
                                                apsys.editors.showStartPage(apsys, 'Start Page', 'startpage');
                                            } else {
                                                apsys.editors.createStartPage(apsys);
                                            }
                                            apsys.showRecentFile = true;
                                            break;
                                        case 17: //Recent project
                                            console.log("Recent project");
                                            break;
                                        case 19: //Exit
                                            if (confirm("Do you want to quit the SimuCenter?"))
                                                closeSimucenter();
                                            break;
                                    }
                                    break;
                                case 1: //Edit
                                    var currentEditor = apsys.editors.getCurrentEditorObject(apsys);
                                    if (currentEditor.editorID !== "")
                                        var editor = ace.edit(currentEditor.editorID);
                                    switch (index) {
                                        case 0: //Undo
                                            editor.undo();
                                            apsys.editors.saveCurrentContent(apsys);
                                            break;
                                        case 1: //Redo
                                            editor.redo();
                                            apsys.editors.saveCurrentContent(apsys);
                                            break;
                                        case 3: //Cut
                                            clipboard.set(editor.session.getTextRange(editor.getSelectionRange()), 'text');
                                            editor.onCut();
                                            apsys.editors.saveCurrentContent(apsys);
                                            break;
                                        case 4: //Copy
                                            clipboard.set(editor.session.getTextRange(editor.getSelectionRange()), 'text');
                                            break;
                                        case 5: //Paste
                                            editor.insert(clipboard.get("text"));
                                            apsys.editors.saveCurrentContent(apsys);
                                            break;
                                        case 6: //Delete
                                            if (editor)
                                                editor.remove();
                                            apsys.editors.saveCurrentContent(apsys);
                                            break;
                                        case 7: //Select all
                                            if (editor)
                                                editor.selectAll();
                                            break;
                                        case 9: //Find...
                                            if (editor) {
                                                $(".ace_search").show();
                                                editor.find();
                                            }
                                            break;
                                        case 10: //Finc next
                                            if (editor)
                                                editor.findNext();
                                            break;
                                        case 11: //Find previous
                                            if (editor)
                                                editor.findPrevious();
                                            break;
                                        case 12: //Replace...
                                            if (editor) {
                                                $(".ace_search").show();
                                                editor.replace(""); //replace with what?
                                            }
                                            break;
                                        case 14: //Comment text
                                            apsys.editors.commentOut(apsys);
                                            apsys.editors.saveCurrentContent(apsys);
                                            break;
                                        case 15: //Remove Comments
                                            apsys.editors.removeCommentOut(apsys);
                                            apsys.editors.saveCurrentContent(apsys);
                                            break;
                                        case 17: //Preference
                                            $("#preferenceWindow").window("open");
                                            simucenter.setEditorFont();
                                            simucenter.setWizardFont("helpPreview", simucenter.wizardFontSize);
                                            break;
                                    }
                                    apsys.refreshUndoRedo(apsys);
                                    break;
                                case 2: //View
                                    //Start page
                                    if (apsys.editors.isFileOpen('Start Page', 'startpage', apsys.openFiles)) {
                                        apsys.editors.showStartPage(apsys, 'Start Page', 'startpage');
                                    } else {
                                        apsys.editors.createStartPage(apsys);
                                    }
                                    break;
                                case 3: //Option
                                    //Auto save log file
                                    console.log("Auto save log file");
                                    break;
                                case 4: //Example
                                    //Open example
                                    $("#fileDialog_Apsys").attr('nwworkingdir', apsys.appPath + '\\apsys_examples');
                                    $("#fileDialog_Apsys").click();
                                    break;
                                case 5: //Help
                                    if (apsys.appPathValidate(apsys)) {
                                        //var apsysWizardPath = apsys.appPath + "\\GUI\\";
                                        switch (index) {
                                            case 0: //About Workbench...
                                                alert("SimuApsys of SimuCenter 2016 beta v0.1\r\n2016.05.01");
                                                break;
                                            default:
                                                if (helpPath && helpPath !== "")
                                                    openHelpFile(apsys.appPath + helpPath);
                                                break;
                                        }
                                    }
                                    break;
                            }
                        };

/*
                changeEditorFont = function () {
                    simucenter.editorFontSize = $("#editorFontSize").val();
                    simucenter.setEditorFont();
                };

                changeWizardFont = function () {
                    simucenter.wizardFontSize = $("#wizardFontSize").val();
                    simucenter.setWizardFont("helpPreview", simucenter.wizardFontSize);
                };

                $scope.resetFontSize = function () {
                    simucenter.editorFontSize = "14px";
                    simucenter.setEditorFont();
                    simucenter.wizardFontSize = "100%";
                    //simucenter.setWizardFont("helpPreview", simucenter.wizardFontSize);
                };


                $scope.closePreference = function () {
                    //$scope.resetFontsize();
                    $("#preferenceWindow").window("close");
                };

                $scope.setFontSize = function () {
                    //$scope.$apply(function () {
                    simucenter.editorFontSize = $("#editorFontSize").val();
                    simucenter.wizardFontSize = $("#wizardFontSize").val();
                    $("#preferenceWindow").window("close");
                    simucenter.setFont();
                    var product = simucenter.currentProduct();
                    product.setUserSetting("editorFontSize", simucenter.editorFontSize);
                    product.setUserSetting("wizardFontSize", simucenter.wizardFontSize);
                    //});
                };*/
            }]);