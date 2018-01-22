var oldProjectPath = "c:\\", oldFilePath = "";


angular.module('quick.controller', [])
        .controller('quickBarController', ['$rootScope', '$scope', 'file', function ($rootScope, $scope, file) {
                $scope.addFileTypes = ['layer', 'sol', 'geo', 'gain', 'mater', 'plt', 'doping', 'rtgain', 'mplt'];
                var product = $rootScope.product,

                        networkObject = $rootScope.networkObject,
                        /* *
                         * fileDialogID -- a file dialog to open and choose a project file, each product has its own
                         * editorIDPre  -- create a editor for every file when click to open a file
                         * editorArrayObject -- give a class name for each editor of a product, to distinguish editor is belong which product
                         * */
                        getFilePath = function (filepath) {
                            var num = filepath.lastIndexOf("\\");
                            return filepath.substring(0, num);
                        },
                        getFileName = function (filepath) {
                            var num = filepath.lastIndexOf("\\");
                            return filepath.substring(num + 1);
                        },
                        openProjectFunction = function ( product,fileDialogID) {
                            var filePath = document.querySelector(fileDialogID).value;
                            if (filePath === "")
                                return false;
                            var projectPath = getFilePath(filePath),
                                    fileName = getFileName(filePath),
                                    newFilePath = filePath.replace(/\\/g, '\\\\'),
                                    treeFolderNum = 1; //csuprem's inputfiletree root folder number
                            var editorObject = product.editors.getEditorObject(product.productName, fileName, projectPath.replace(/\\/g, '\\\\'));
                               treeFolderNum = 2; //apsys's inputfiletree root folder number
                           /* if (product.filetree.inputfiles[0].nodes.length > treeFolderNum) { //It has a project already
                                product.filetree.resetAllFileTree(product.filetree);
                               // product.editors.closeAllFile(editorObject.editorContainerID, product.openFiles); //delete all editors & filetitles
                            }*/
                            product.filetree.createAllFileTree(product.filetree, projectPath);
                           // product.editors.createEdtior(product, fileName, newFilePath, editorObject.editorID, editorObject.editorContainerID, editorObject.editorArrayObject); //editorIDPre + fileName = editorID
                            product.projectPath = projectPath;
                           // product.writeRecentFile(product.productName, fileName, newFilePath);
                           // product.recentFiles = product.getRecentFile(product.productName);
                            //product.editors.undoRedo(product);
                            //product.title = "Welcome to SimuCenter - Simu" + product.productName + " - " + projectPath.replace(/\\/g, '/');
                          //  simucenter.setFont();
                            //$("#editorID").val(editorObject.editorID);
                            document.querySelector(fileDialogID).value = '';
                            //$("#fixNoRefresh").click();
                        },
                        runFunction = function (product, appName, folderNum, fileFormat, fileListObject) {
                            if (!product.isProjectRun) {
                                if (product.projectPath !== "") {
                                    if (product.appPath === "") {
                                        product.appPathValidate(product);
                                        return;
                                    }
                                    product.runProject(product, product.appPath + appName,
                                            product.filetree.inputfiles[0].nodes,
                                            folderNum, fileFormat, product.runFileList, fileListObject, //radio element from selectproject.html
                                            0,1); //0 means click Run button
                                } else {
                                    alert("There is no project in " + product.productName);
                                }
                            }
                        },
                        stopFunction = function (product, taskname) {
                            var filePath = product.getCurrentPath() + "\\stop.bat";
                            file.writeallsync(filePath, "taskkill \/f \/im " + taskname + " \/t");
                            product.executeFile(filePath, function () {
                                product.closeStop(product);
                            });
                        },
                        userSettingFunction = function (product, chooseID, appPathID, helpPath) {
                            $("#userSettingWindow").modal('toggle');
                            var pj = document.querySelector(chooseID);
                            pj.addEventListener("change", function (evt) {
                                document.querySelector(appPathID).value = this.value;
                                product.appPath = this.value;
                                product.helpPath = product.appPath + helpPath;
                                product.setUserSetting(product.appPathName, this.value);
                            }, false);
                        },
                        resetNewProject = function () {
                            $("#newProjectName").val("");
                            $("#newProjectPath").val("c:\\");
                            oldProjectPath = "c:\\";
                            $("#chooseProjectPath").val("");
                            //document.querySelector('#chooseProjectPath').value = "";
                        },
                        openCMD = function () {
                            var gui = require('nw.gui');
                            gui.Shell.openItem('cmd');
                        },
                        openAPP = function (product, appName, fileType) {
                            var hasFiles = product.editors.hasTheFileInProject(product, fileType);
                            if (product.projectPath === "" || hasFiles.length === 0) {
                                product.filetree.openFileWithApp(product.appPath + appName, '');
                            } else {//here must popup a window to show all layer files to give user to choose ???
                                product.filetree.openFileWithApp(product.appPath + appName, product.projectPath + "\\" + hasFiles[0]);
                            }
                        },
                        openNetworkWindow = function () {
                            var product = simucenter.currentProduct(),
                                    projectPath = product.projectPath,
                                    seriesPath = projectPath + "\\Projects";
                            if (projectPath !== "") {
                                var pn = product.projectPath.split('\\');
                                networkObject.projectName = pn[pn.length - 1];
                                networkObject.seriesList = []; //clear list first
                                if (file.existsfile(seriesPath)) {
                                    var series = file.readfoldersync(seriesPath);
                                    angular.forEach(series, function (sobj) {
                                        if (!file.isFile(seriesPath + "\\" + sobj)) { //only folder
                                            var subFolders = file.readfoldersync(seriesPath + "\\" + sobj),
                                                    subNumber = 0;
                                            angular.forEach(subFolders, function (subobj) {
                                                if (subobj.indexOf(".") === -1)
                                                    subNumber++;
                                            });
                                            networkObject.seriesList.push({"seriesFolderName": sobj, subProjectNumber: subNumber});
                                        }
                                    });
                                    var files = file.readfoldersync(projectPath);
                                    angular.forEach(files, function (f) {
                                        var a = f.split("."),
                                            isFile = file.isFile(projectPath + '\\' + f),
                                            fileType = a[a.length - 1];              
                                        if (isFile && fileType === 'in')
                                            networkObject.processList[0].inList.push(f);
                                        if (isFile && fileType === 'layer')
                                            networkObject.processList[1].layerList.push(f);
                                        if (isFile && fileType === 'geo') //执行过layer文件后可能还会产生新的geo文件，需要更新
                                            networkObject.processList[2].geoList.push(f);
                                        if (isFile && fileType === 'sol')
                                            networkObject.processList[3].solList.push(f);
                                        if (isFile && fileType === 'plt')
                                            networkObject.processList[5].pltList.push(f);
                                    });
                                    if(networkObject.processList[0].inList[0])
                                        networkObject.processList[0].inFile = networkObject.processList[0].inList[0];
                                    if(networkObject.processList[1].layerList[0])
                                        networkObject.processList[1].layerFile = networkObject.processList[1].layerList[0];
                                    if(networkObject.processList[2].geoList[0])
                                        networkObject.processList[2].geoFile = networkObject.processList[2].geoList[0];
                                    if(networkObject.processList[3].solList[0])
                                        networkObject.processList[3].solFile = networkObject.processList[3].solList[0];
                                    if(networkObject.processList[5].pltList[0])
                                        networkObject.processList[5].pltFile = networkObject.processList[5].pltList[0];
                                    
                                    $("#uploadProjectWindow").modal('toggle');
                                } else {
                                    alert("This project have no series project jet.");
                                    return;
                                }
                            } else {
                                alert("No project, please open or new one.");
                                return;
                            }
                            ;
                        };

                openProject = function () {
                    debugger;
                    if (!openProjectFunction(product, '#fileDialog'))
                        return;
                };



                closeProjectFunction = function (product) {
                    product.projectPath = "";
                    product.editors.saveAllOpenFiles(product, 1);
                    product.filetree.resetAllFileTree(product.filetree);
                    product.editors.closeAllFile($("#editorContainer_" + product.productName), product.openFiles);
                    product.showStartPage = true;
                    product.isSeriesShow = false; //hide series pannel
                    product.isSeriesRun = false;  //close series initial parameter
                    document.querySelector('#fileDialog_' + product.productName).value = "";
                    cleanAutoTCAD();
                    //clean messages?

                };
                newProjectFunction = function () {
                    resetNewProject();
                    $("#newProjectWindow").modal('toggle');
                    var pj = document.querySelector('#chooseProjectPath');
                    pj.addEventListener("change", function () {
                        if ($("#newProjectName").val() !== "")
                            $('#newProjectPath').val(this.value + "\\" + $("#newProjectName").val());
                        else
                            $('#newProjectPath').val(this.value);
                        oldProjectPath = this.value;
                    }, false);
                };
                newFileFunction = function () {
                    angular.forEach($("input[name='newFileType']"), function (obj) {
                        $(obj).attr("checked", "");
                    });
                    $("#newFileName").val("");
                    $("#newFilePath").val("");
                    $("#chooseFilePath").val("");
                    oldFilePath = "";
                    $("#newFileWindow").modal('toggle');
                    var cfp = document.querySelector('#chooseFilePath');
                    cfp.addEventListener("change", function () {
                        if ($("#newFileName").val() !== "")
                            $('#newFilePath').val(this.value + "\\" + $("#newFileName").val());
                        else
                            $('#newFilePath').val(this.value);
                        oldFilePath = this.value;
                    }, false);
                };
                $rootScope.setRemotePC = function () {
                    if (networkObject.selectedSeriesName) {
                        networkObject.remotePClist = [];
                        for (var i = 0; i < networkObject.distributeNum; i++) {
                            networkObject.remotePClist.push({ip: '', subFolders: [], distributeNum: 0, connectInfo: ''}); //init remote object info for each PC
                        }
                        $("#fixNoRefresh").click();
                    } else {
                        alert("Please select one series first.");
                        return;
                    }
                };
               /* $rootScope.resetUploadWin = function () {
                    networkObject.selectedSeriesName = ""; //selected series from networkObject.seriesList
                    networkObject.selectedSubNumber = 0;   //number of sub projects of selected series
                    networkObject.distributeNum = 0;
                    networkObject.remotePClist = [];
                    networkObject.processList[0].isCsuprem = false;
                    networkObject.processList[1].isLayer = false;
                    networkObject.processList[2].isGeo = false;
                    networkObject.processList[3].isApsys = false;
                    networkObject.processList[4].isPics3d = false;
                    networkObject.processList[5].isPlt = false;
                    networkObject.processList[6].isJunkg = false;          
                };
                $rootScope.uploadProject = function () {
                    if (networkObject.selectedSeriesName === "" || networkObject.distributeNum === 0) {
                        alert("Select one series or input correct number first.");
                        return;
                    }
                    if (networkObject.remotePClist.length === 0) {
                        alert("There is no remote PC to conect.");
                        return;
                    }
                    angular.forEach(networkObject.remotePClist, function (rpc) {
                        if (rpc.ip === "" || rpc.distributeNum === 0) {
                            alert("The ip address of Remote PC cannot be empty.");
                            return;
                        }
                    });
                    try {
                        var product = simucenter.currentProduct();
                        //savePath = product.getCurrentPath() + "\\crosslight";
                        //if (!file.existsfile(savePath))
                        //file.mkdirsync(savePath);

                        $("#loading").show();
                        networkObject.uploadSubProjects(product.projectPath, networkObject.selectedSeriesName, networkObject);
                    } catch (e) {
                        alert(e);
                        return;
                    }
                };
                $rootScope.getSeriesProjectNum = function () {
                    networkObject.selectedSubNumber = 0;
                    angular.forEach(networkObject.seriesList, function (seriesObj) {
                        if (seriesObj.seriesFolderName === networkObject.selectedSeriesName.seriesFolderName)
                            networkObject.selectedSubNumber = seriesObj.subProjectNumber;
                    });
                };
                $rootScope.remoteCompute = function (seriesObj) {
                    //console.log(seriesObj);
                    if (networkObject.remotePClist.length === 0) {
                        alert("There is no remote PC to conect.");
                        return;
                    }
                    angular.forEach(networkObject.remotePClist, function (rpc) {
                        if (rpc.ip === "" || rpc.distributeNum === 0) {
                            alert("The ip address of Remote PC cannot be empty.");
                            return;
                        }
                    });
                    try {
                        networkObject.operate(seriesObj);
                    } catch (e) {
                        alert(e);
                        return;
                    }
                };

                $rootScope.pingRemotePC = function () {
                    try {
                        networkObject.ping();
                    } catch (e) {
                        //$("#sysinfo_" + index).text("Can not connect to severice.");
                        return;
                    }
                };

                $scope.selectProject = function (product, sobj) {
                    var rtype = 1;
                    if (sobj.type === "sub" || sobj.type === "series")
                        rtype = 4;
                    else if(sobj.type === 'plt') //Plot.Plt
                        rtype = 0;
                    
                    if(rtype === 0){ //Plot.Plt
                        if (apsys.isCurrentApp){
                            var fname = $('input[name="ApsysProjectFilelist"]:checked').val();                            
                            apsys.createBatFileToRun(app.APSYS, fname, apsys.projectPath + "\\" + fname, "pltViewResult", "viewresult.bat", 0);
                        }else if (pics3d.isCurrentApp){
                            var fname = $('input[name="Pics3dProjectFilelist"]:checked').val();
                            pics3d.createBatFileToRun(app.PICS3D, fname, pics3d.projectPath + "\\" + fname, "pltViewResult", "viewresult.bat", 0);
                        }
                        $("#selectProjectWindow").modal('toggle');
                    }else if (rtype === 1) { //from RUN button to choose project file
                        if (csuprem.isCurrentApp)
                            csuprem.runProject(csuprem, csuprem.appPath + app.CSUPREM, csuprem.filetree.inputfiles[0].nodes, 5, 'in', csuprem.runFileList, "CSupremProjectFilelist", 1);
                        else if (apsys.isCurrentApp)
                            apsys.runProject(apsys, apsys.appPath + app.APSYS, apsys.filetree.inputfiles[0].nodes, 3, 'sol', apsys.runFileList, "ApsysProjectFilelist", 1);
                        else
                            pics3d.runProject(pics3d, pics3d.appPath + app.PICS3D, pics3d.filetree.inputfiles[0].nodes, 3, 'sol', pics3d.runFileList, "Pics3dProjectFilelist", 1);
                    } else { //from series filetree right-click to choose project file
                        if (csuprem.isCurrentApp) {
                            if (sobj.type === "series")
                                csuprem.runProject(csuprem, "", sobj.seriesPath, "", '', "", "CSupremProjectFilelist", 4);
                            else
                                csuprem.runProject(csuprem, csuprem.appPath + app.CSUPREM, sobj.seriesPath, 5, 'in', "", "CSupremProjectFilelist", 4);
                        } else if (apsys.isCurrentApp) {
                            if (sobj.type === "series")
                                apsys.runProject(apsys, "", sobj.seriesPath, "", 'sol', apsys.runFileList, "ApsysProjectFilelist", 4);
                            else
                                apsys.runProject(apsys, apsys.appPath + app.APSYS, sobj.seriesPath, 3, 'sol', apsys.runFileList, "ApsysProjectFilelist", 4);
                        } else {
                            if (sobj.type === "series")
                                pics3d.runProject(pics3d, "", sobj.seriesPath, 3, 'sol', pics3d.runFileList, "Pics3dProjectFilelist", 4);
                            else
                                pics3d.runProject(pics3d, pics3d.appPath + app.PICS3D, sobj.seriesPath, 3, 'sol', pics3d.runFileList, "Pics3dProjectFilelist", 4);
                        }
                    }
                };
                /!**
                 * Updating when change project name in New Project Window
                 *!/
                updateProjectPath = function () {
                    $("#newProjectPath").val(oldProjectPath + "\\" + $("#newProjectName").val());
                };
                updateFilePath = function () {
                    $("#newFilePath").val(oldFilePath + "\\");
                };
                $scope.newProject = function () {
                    var newName = $("#newProjectName").val(),
                            newPath = $("#newProjectPath").val().replace(/\\/g, '\\\\'),
                            product = simucenter.currentProduct();
                    if (newName === "" || newPath === "") {
                        alert("Project name and path cannot be empty!");
                    } else {
                        var addFileTypes = [];
                        addFileTypes.length = 0;
                        angular.forEach($("input[name='newPrjectFileType_" + product.productName + "']:checked"), function (obj) {
                            addFileTypes.push($(obj).val());
                        });
                        if (addFileTypes.length === 0) {
                            alert("Please choose file type!");
                            return;
                        }
                        product.createProject(newName, newPath, addFileTypes);
                        product.filetree.resetAllFileTree(product.filetree);
                        product.filetree.createAllFileTree(product.filetree, newPath);
                        var fileName = newName + "." + addFileTypes[0];
                        var editorObject = product.editors.getEditorObject(product.productName, newName, newPath);//filepath(last parameter)
                        product.editors.closeAllFile(editorObject.editorContainerID, product.openFiles);
                        product.editors.createEdtior(product, fileName, newPath + "\\\\" + fileName, editorObject.editorID, editorObject.editorContainerID, editorObject.editorArrayObject);
                        //var projectPath = getFilePath(filePath);
                        product.title = "Welcome to SimuCenter - Simu" + product.productName + " - " + newPath.replace(/\\/g, '/');
                        $("#newProjectWindow").modal('toggle');
                    }
                };
                $scope.newFile = function () {
                    var newName = $("#newFileName").val(),
                            newPath = $("#newFilePath").val().replace(/\\/g, '\\\\'),
                            product = simucenter.currentProduct(),
                            fileType = $("input[name='newFileType']:checked").val();
                    if (newName === "" || newPath === "") {
                        alert("The file name or file path can not be empty.");
                        return;
                    }
                    if (fileType === "") {
                        alert("Please choose a file type.")
                        return;
                    }
                    var newFileName = newName + "." + fileType;
                    if (!product.createNewFile(newName, newPath, fileType))
                        return;
                    var editorObject = product.editors.getEditorObject(product.productName, newName, newPath);
                    product.editors.closeAllFile(editorObject.editorContainerID, product.openFiles);
                    product.editors.createEdtior(product, newFileName, newPath + "\\\\" + newFileName, editorObject.editorID, editorObject.editorContainerID, editorObject.editorArrayObject);
                    $("#newFileWindow").modal('toggle');
                };*/

                $scope.quickEvent = function (index, isDisabled) {
                    debugger;
                    if (isDisabled === 'disabled')
                        return;
                    /*var currentEditor = apsys.editors.getCurrentEditorObject(apsys);
                    if (currentEditor.editorID !== "")
                        var editor = ace.edit(currentEditor.editorID);*/
                    switch (index) {
                        case 0: //New
                            newProjectFunction();
                            break;
                        case 1: //Open
                            $("#fileDialog").click();
                            break;
                        case 2: //Close
                            closeProjectFunction(apsys);
                            break;
                       /* case 3: //Save
                            //apsys.editors.saveCurrentFile(apsys);
                            apsys.editors.saveCurrentContent(apsys);
                            break;
                        case 4: //Undo
                            editor.undo();
                            apsys.refreshUndoRedo(apsys);
                            apsys.editors.saveCurrentContent(apsys);
                            break;
                        case 5: //Redo
                            editor.redo();
                            apsys.refreshUndoRedo(apsys);
                            apsys.editors.saveCurrentContent(apsys);
                            break;
                        case 6: //Run
                            runFunction(apsys, app.APSYS, 2, 'sol', "ApsysProjectFilelist"); //before number is 3
                            break;
                        case 7: //Stop
                            stopFunction(apsys, "apsys.exe");
                            break;
                        case 8: //CMD
                            openCMD();
                            break;
                        case 9: //Contact
                            console.log("Contact");
                            break;
                        case 10: //LayerBuilder
                            openAPP(apsys, app.LAYERBUILDER, "layer");
                            break;
                        case 11: //Layer3d
                            openAPP(apsys, app.LAYER3D, "sol");
                            break;
                        case 12: //Gen.Mesh
                            var fileName;
                            var projectPath = apsys.projectPath;
                            if (projectPath) {
                                var files = file.readfoldersync(projectPath);
                                angular.forEach(files, function (eachfile) {//If has more layer files need to dealing with
                                    if (apsys.getExtensionName(eachfile) === 'layer') {
                                        apsys.message.setMessageActive(apsys.message, apsys.message.runtime);
                                        apsys.message.runtime.cleanMessage();
                                        fileName = eachfile;
                                        apsys.createBatFileToRun("\\apsys" + app.LAYER, fileName, projectPath + "\\" + fileName, "layerProcessToGeo", "temp.bat", 1);
                                        apsys.callAppToRun2(apsys, projectPath + "\\temp.bat", apsys.message.runtime, function () {
                                            file.delfile(projectPath + "\\temp.bat");
                                            apsys.message.runtime.content.push("finished.");
                                            angular.forEach(files, function (eachfile2) {//If has more geo files need to dealing with
                                                if (apsys.getExtensionName(eachfile2) === 'geo') {
                                                    fileName = eachfile2;
                                                    apsys.createBatFileToRun("\\apsys" + app.GEOMETRY, fileName, projectPath + "\\" + fileName, "geoGenerateMesh", "temp.bat", 1);
                                                    apsys.callAppToRun2(apsys, projectPath + "\\temp.bat", apsys.message.runtime, function () {
                                                        file.delfile(projectPath + "\\temp.bat");
                                                        apsys.message.runtime.content.push("finished.");
                                                        $("#fixNoRefresh").click();
                                                    });
                                                }
                                            });
                                        });
                                    }
                                });
                            }
                            break;
                        case 13: //Plot.Plt
                            apsys.runFileList = [];
                            var projectPath = apsys.projectPath;
                            if (projectPath) {
                                var files = file.readfoldersync(projectPath);
                                angular.forEach(files, function (eachfile) {//need to select one if has more files
                                    if (apsys.getExtensionName(eachfile) === 'plt')
                                        apsys.runFileList.push({"fileName": eachfile, "filePath": projectPath+'\\'+eachfile, type: "plt"});                                 
                                });
                                if(apsys.runFileList.length === 1)
                                    apsys.createBatFileToRun(app.PICS3D, apsys.runFileList[0], projectPath + "\\" + apsys.runFileList[0], "pltViewResult", "viewresult.bat", 0);
                                if(apsys.runFileList.length>1)
                                    $("#selectProjectWindow").modal('toggle');
                            }
                            break;
                        case 14: //Template
                            console.log("Template");
                            break;
                        case 15: //User Setting
                            userSettingFunction(apsys, '#appPathFolder_Apsys', "input[ng-model='simucenter.Apsys.appPath']", "/GUI/HTML/general/manualse280.html");
                            break;
                        case 16: //Network compute
                            openNetworkWindow();
                            break;*/
                    }

                };

            }]);