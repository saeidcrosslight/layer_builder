'use strict';

angular
        .module('object.filetree', [])
        .factory('filetree', ['$rootScope', 'file', 'childprocess', function ($rootScope, file, childprocess) {
                var factory = {},
                        filetreeObject = function () {
                            this.inputfiles = [];
                            this.outputfiles = [];
                            this.seriesfiles = [];
                            this.csupremInputFileTreeInit = csupremInputFileTreeInit;
                            this.apsysInputFileTreeInit = apsysInputFileTreeInit;
                            this.outputFileTreeInit = outputFileTreeInit;
                            this.seriesFileTreeInit = seriesFileTreeInit;
                            this.getCsupremMacroFile = getCsupremMacroFile;
                            this.getApsysMacroFile = getApsysMacroFile;
                            this.createAllFileTree = createAllFileTree;
                            this.createInputOutputFileTree = createInputOutputFileTree;
                            this.createOutputFileTree = createOutputFileTree;
                            this.creatSeriesFileTree = creatSeriesFileTree;
                            this.readOutputFile = readOutputFile;
                            this.readSeriesFile = readSeriesFile;
                            this.resetInputFileTree = resetInputFileTree;
                            this.resetOutputFileTree = resetOutputFileTree;
                            this.resetSeriesFileTree = resetSeriesFileTree;
                            this.resetInputOutputFileTree = resetInputOutputFileTree;
                            this.resetAllFileTree = resetAllFileTree;
                            this.openFile = openFile;
                            this.openFileWithEditor = openFileWithEditor;
                            this.openFileWithApp = openFileWithApp;
                        },
                        csupremInputFileTreeInit = function () {
                            return [{"id": "dir-1", "title": "Input Files", "type": "folder",
                                    "nodes": [{"id": "dir-1-1", "title": "Geo(Mesh) Files", "type": "folder", "nodes": [], treeType: "inputfile"},
                                        {"id": "dir-1-2", "title": "For Apsys Files", "type": "folder", "nodes": [], treeType: "inputfile"},
                                        {"id": "dir-1-3", "title": "Macro Files", "type": "folder", "nodes": [], treeType: "inputfile"}
                                        //,{"id": "dir-1-4", "title": "Public Files", "type": "folder", "nodes": []}
                                    ]
                                }];
                        },
                        apsysInputFileTreeInit = function () {
                            return [{"id": "dir-1", "title": "Input Files", "type": "folder",
                                    "nodes": [{"id": "dir-1-1", "title": "Macro Files", "type": "folder", "nodes": [], treeType: "inputfile"}
                                        // ,{"id": "dir-1-2", "title": "Public Files", "type": "folder", "nodes": []}
                                    ]}];
                        },
                        outputFileTreeInit = function () {
                            return [{"id": "dir", "title": "Output Files", "type": "folder", "nodes": [], treeType: "outputfile"}];
                        },
                        seriesFileTreeInit = function () {
                            return [{"id": "dir", "title": "Series Files", "type": "folder", "nodes": [], treeType: "seriesfile"}];
                        },
                        getCsupremMacroFile = function () {
                            return [
                                {"title": "back.key"},
                                {"title": "suprem.key"},
                                {"title": "Crystal_Trim_table.imp"},
                                {"title": "sup4gs_sims1.imp"},
                                {"title": "sup4gs_stanford.imp"},
                                {"title": "sup4gs_utmarlowe.imp"},
                                {"title": "Trim_table.imp"},
                                {"title": "Modelrc"}
                            ];
                        },
                        getApsysMacroFile = function () {
                            return [
                                {"title": "crosslight.mac"},
                                {"title": "crosslight.tab"},
                                {"title": "geometry.tab"},
                                {"title": "layer.tab"},
                                {"title": "macrolist_studio.tab"},
                                {"title": "more.mac"},
                                {"title": "pics1d.tab"},
                                {"title": "plotdata.tab"}
                            ];
                        },
                        createCsupremInputFileTree = function (files, treeFolder, path) {
                            var geonum = 0, innum = 0, pubnum = 0;
                            for (var i = 0; i < files.length; i++) {
                                var exName = getExtensionName(files[i]); //1.Geo_Files:.zst | .cut | geo                     
                                if (exName === "msk" || exName === "zst" || exName === "cut" || (exName === "in" && getSubFileName(files[i], 0, 3) === "geo")) {
                                    treeFolder.nodes[0].nodes[geonum] = addTreeNode(i + 1, files[i], path, "file", "inputfile");
                                    geonum++;
                                } else if (exName === "sol" || exName === "plt") {//2.For Apsys:.sol | .plt
                                    treeFolder.nodes[1].nodes.push(addTreeNode(i + 1, files[i], path, "file", "inputfile"));
                                } else if (exName === "in") {//if (exName === "in" && getSubFileName(files[i], 0, 4) !== "temp") {//5.in_Files
                                    treeFolder.nodes[innum + 3] = addTreeNode(innum + 1, files[i], path, "file", "inputfile");
                                    innum++;

                                    /*treeFolder.nodes[innum + 4] = {"id": "dir-1-" + (innum + 3), "title": "project_" + (innum + 1), "type": "folder", "nodes": []};
                                     treeFolder.nodes[innum + 4].nodes[0] = addTreeNode(i + 1, files[i], path);//in file                            
                                     var fullPath = (path + "\\" + files[i]).replace(/\\/g, '\\\\');
                                     var allIncludeFile = getIncludeFile(fullPath, "include");
                                     if (allIncludeFile.length) {//put include files under project folder
                                     angular.forEach(allIncludeFile, function (includefile, index) {
                                     treeFolder.nodes[innum + 4].nodes.push(addTreeNode(index + 1, includefile, path));
                                     });
                                     }
                                     innum++;*/
                                }
                            }
                            //3.set macro files
                            angular.forEach(MACRO_FILE_CSUPREM, function (data, index) {
                                treeFolder.nodes[2].nodes[index] = addTreeNode(index + 1, data.title, $rootScope.simucenter.CSuprem.appPath, "sysfile", "inputfile");
                            });
                            //4.set public files   
                            /*for (var i = 4; i < treeFolder.nodes.length - 1; i++) {//get in folder node
                             for (var j = 1; j < treeFolder.nodes[i].nodes.length; j++) {//get include from in folder
                             if (treeFolder.nodes[i + 1].nodes.length > 1) {
                             for (var m = 1; m < treeFolder.nodes[i + 1].nodes.length; m++) {//get include from next folder
                             if (treeFolder.nodes[i].nodes[j].title === treeFolder.nodes[i + 1].nodes[m].title) {
                             treeFolder.nodes[3].nodes[pubnum] = addTreeNode("pub_" + (pubnum + 1), treeFolder.nodes[i].nodes[j].title, path);
                             pubnum++;
                             break;
                             }
                             }
                             }
                             }
                             }
                             //delete same file in folder
                             for (var i = 4; i < treeFolder.nodes.length; i++) {
                             var inFileObj = [];
                             var inFileNum = 0;
                             for (var j = 0; j < treeFolder.nodes[i].nodes.length; j++) {
                             var hasfile = false;
                             for (var m = 0; m < treeFolder.nodes[3].nodes.length; m++) {
                             if (treeFolder.nodes[i].nodes[j].title === treeFolder.nodes[3].nodes[m].title)
                             hasfile = true;
                             }
                             if (!hasfile) {
                             inFileObj[inFileNum] = treeFolder.nodes[i].nodes[j];
                             inFileNum++;
                             }
                             }
                             treeFolder.nodes[i].nodes = inFileObj;
                             }
                             //set msk file that not in .in file and public
                             for (var i = 0; i < files.length; i++) {//
                             var exName = getExtensionName(files[i]); //Geo_Files:.in 
                             if (exName === "msk") {//and this file is not in public or in_ file folder
                             var hasmsk = false;
                             for (var j = 3; j < treeFolder.nodes.length; j++) {
                             for (var m = 0; m < treeFolder.nodes[j].nodes.length; m++) {
                             if (files[i] === treeFolder.nodes[j].nodes[m].title)
                             hasmsk = true;
                             }
                             }
                             if (!hasmsk) {
                             treeFolder.nodes[0].nodes[geonum] = addTreeNode(i + 1, files[i], path);
                             geonum++;
                             }
                             }
                             }*/
                        },
                        createApsysInputFileTree = function (files, treeFolder, path) {
                            var solnum = 0;
                            var appPath = $rootScope.simucenter.Apsys.appPath;
                            if ($rootScope.simucenter.Pics3d.isCurrentApp)
                                appPath = $rootScope.simucenter.Pics3d.appPath;
                            angular.forEach(MACRO_FILE_APSYS, function (data, index) {
                                treeFolder.nodes[0].nodes.push(addTreeNode(index + 1, data.title, appPath, "sysfile", "inputfile"));
                            });
                            /*angular.forEach(files, function (data, index) {
                             var exName = getExtensionName(data);
                             if (exName === "sol" && data.split(".").length === 2) {
                             treeFolder.nodes.push({"id": "dir-1-" + (index + 1), "title": "project_" + (solnum + 1), "type": "folder", "nodes": [addTreeNode(index + 1, data, path)]});
                             var fullPath = (path + "\\" + data).replace(/\\/g, '\\\\');
                             var allIncludeFile = getIncludeFile(fullPath, "include");
                             if (allIncludeFile.length) {
                             for (var j = 0; j < allIncludeFile.length; j++) {
                             treeFolder.nodes[solnum + 2].nodes.push(addTreeNode(j + 1, allIncludeFile[j], path));//include file
                             }
                             }
                             solnum++;
                             }
                             });
                             //set public files   
                             for (var i = 2; i < treeFolder.nodes.length - 1; i++) {//get sol folder node
                             for (var j = 1; j < treeFolder.nodes[i].nodes.length; j++) {//get include from in folder
                             if (treeFolder.nodes[i + 1].nodes.length > 1) {
                             for (var m = 1; m < treeFolder.nodes[i + 1].nodes.length; m++) {//get include from next folder
                             if (treeFolder.nodes[i].nodes[j].title === treeFolder.nodes[i + 1].nodes[m].title) {
                             treeFolder.nodes[1].nodes.push(addTreeNode("pub_" + (j + 1), treeFolder.nodes[i].nodes[j].title, path));
                             break;
                             }
                             }
                             }
                             }
                             }
                             angular.forEach(files, function (data, index) {
                             var exName = getExtensionName(data);
                             if (data[0] !== "~" && (exName === "bat" || exName === "doping" || exName === "gain" || exName === "geo" || exName === "layer" || exName === "mater" || exName === "mplt" || exName === "msh" || exName === "plt" || exName === "gnu")) {
                             treeFolder.nodes.push(addTreeNode(index + 1, data, path));
                             //solnum++;
                             }
                             });*/
                            angular.forEach(files, function (data, index) {
                                var exName = getExtensionName(data);
                                if (data[0] !== "~" && ((exName === "sol" && data.split(".").length === 2) || exName === "BAT" || exName === "bat" || exName === "doping" || exName === "gain" || exName === "geo" || exName === "layer" || exName === "mater" || exName === "mplt" || exName === "msh" || exName === "plt" || exName === "gnu")) {
                                    treeFolder.nodes.push(addTreeNode(index + 1, data, path, "file", "inputfile"));
                                    //solnum++;
                                }
                            });
                            //delete same file in folder
                            /*angular.forEach(treeFolder.nodes[1].nodes, function (pubfile) {
                             for (i = 2; i < treeFolder.nodes.length; i++) {
                             angular.forEach(treeFolder.nodes[i].nodes, function (solfile, index) {
                             if (solfile.title === pubfile.title && treeFolder.nodes[i].nodes.length > 1) {//if project file number equals 1, do not delete
                             treeFolder.nodes[i].nodes.splice(index, 1);
                             }
                             });
                             }
                             angular.forEach(treeFolder.nodes, function (data, index) {
                             if (pubfile.title === data.title)
                             treeFolder.nodes.splice(index, 1);
                             });
                             });*/
                        },
                        createOutputFileTree = function (files, treeFolder, projectPath) {
                            angular.forEach(files, function (pfile, index) {
                                var exName = getExtensionName(pfile);
                                if ($rootScope.simucenter.CSuprem.isCurrentApp) {
                                    if (exName === "str" || exName === "log")
                                        treeFolder.nodes.push(addTreeNode(index + 1, pfile, projectPath, "file", "outputfile"));
                                } else {
                                    if (exName === "ps" || exName === "log" || exName.substr(0, 3) === "std")
                                        treeFolder.nodes.push(addTreeNode(index + 1, pfile, projectPath, "file", "outputfile"));
                                }
                            });
                        },
                        creatSeriesFileTree = function (files, treeFolder, projectPath) {
                            var seriesIndex = 0;
                            angular.forEach(files, function (folder) {//1.Read Projects folder
                                var newPath = projectPath + "\\" + folder;
                                if (!file.isFile(newPath)) {
                                    treeFolder.nodes[seriesIndex] = {"id": "series_" + seriesIndex, "title": folder, "type": "folder", "nodes": [], url: newPath, treeType: 'seriesfile'}; //Add series node
                                    angular.forEach(file.readfoldersync(newPath), function (seriesfolder, seriesindex) {//2.Read all folders in series
                                        if (seriesfolder.indexOf(".") === -1) {
                                            var newPath2 = newPath + "\\" + seriesfolder;
                                            treeFolder.nodes[seriesIndex].nodes[seriesindex] = {"id": "series_subfolder_" + seriesindex, "title": seriesfolder, "type": "folder", "nodes": [], url: newPath2, treeType: 'seriesfile'};
                                            angular.forEach(file.readfoldersync(newPath2), function (filename, fileindex) {
                                                if (filename === "CSupremLayerMater") {
                                                    var nodes = [];
                                                    angular.forEach(file.readfoldersync(newPath2 + "\\CSupremLayerMater"), function (cfile, index) {
                                                        nodes.push(addTreeNode(index + 1, cfile, newPath2 + "\\CSupremLayerMater", "file", 'seriesfile'));
                                                    });
                                                    treeFolder.nodes[seriesIndex].nodes[seriesindex].nodes[fileindex] = {"id": "series_subfolder_sub" + seriesindex, "title": filename, "type": "folder", "nodes": nodes, treeType: 'seriesfile'};
                                                } else {
                                                    treeFolder.nodes[seriesIndex].nodes[seriesindex].nodes[fileindex] = addTreeNode(fileindex + 1, filename, newPath2, "file", 'seriesfile');
                                                }
                                            });
                                        } else {
                                            treeFolder.nodes[seriesIndex].nodes[seriesindex] = addTreeNode(seriesIndex + 1, seriesfolder, newPath, "file", 'seriesfile');
                                        }
                                    });
                                    seriesIndex++;
                                }
                            });
                        },
                        readOutputFile = function (product) {
                            if (product.projectPath !== "") {
                                var files = file.readfoldersync(product.projectPath);
                                if (product.isCurrentApp) {
                                    product.filetree.outputfiles = new outputFileTreeInit;
                                    createOutputFileTree(files, product.filetree.outputfiles[0], product.projectPath);
                                }
                            }
                        },
                        readSeriesFile = function (product) {
                            if (product.projectPath !== "") {
                                var files = file.readfoldersync(product.projectPath + "\\Projects");
                                if (product.isCurrentApp) {
                                    product.filetree.seriesfiles = new seriesFileTreeInit;
                                    creatSeriesFileTree(files, product.filetree.seriesfiles[0], product.projectPath + "\\Projects");
                                }
                            }
                        },
                        /**
                         * 
                         * @param {string} title = node name(file name or folder name)
                         * @param {string} path = file path or folder path
                         * @param {string} type = 'file' or 'folder' or 'sysfile'
                         * @param {string} treeType = 'inputfile' or 'outputfile' or 'seriesfile'
                         */
                        addTreeNode = function (index, title, path, type, treeType) {
                            return {"id": "file_" + (index), "title": title, "type": type, "nodes": [], "url": (path + "\\" + title).replace(/\\/g, '\\\\'), "treeType": treeType};
                        },
                        getExtensionName = function (fileName) {
                            var fn = fileName.split(".");
                            return fn[fn.length - 1];
                        },
                        getSubFileName = function (fileName, startNum, endNum) {
                            return fileName.split(".")[0].substring(startNum, endNum);
                        },
                        getIncludeFile = function (filePath, keyWord) {
                            var includeFile = [];
                            var data = (file.readallsync(filePath)).split("\n");
                            angular.forEach(data, function (fileContent) {
                                if (fileContent.split(" ")[0] === keyWord)
                                    includeFile.push(fileContent.split(" ")[1].split("=")[1]);
                            });
                            return includeFile;
                        },
                        createAllFileTree = function (productFiletree, projectPath) {
                            var files = file.readfoldersync(projectPath);
                            //If currentApp is CSuprem and project is running, Or currentApp is CSuprem and CSuprem is not init, then all first method. Other situation call second
                            if (($rootScope.simucenter.CSuprem.isProjectRun && $rootScope.simucenter.CSuprem.isCurrentApp) || $rootScope.simucenter.CSuprem.isCurrentApp)
                                //临时的解决方案，如果产品之间同时切换并运行会出错，单独运行一个产品再切换可以
                                createCsupremInputFileTree(files, productFiletree.inputfiles[0], projectPath);
                            else
                                createApsysInputFileTree(files, productFiletree.inputfiles[0], projectPath);

                            createOutputFileTree(files, productFiletree.outputfiles[0], projectPath);
                            //files = file.readfoldersync(projectPath + "\\Projects");
                            //creatSeriesFileTree(files, productFiletree.seriesfiles[0], projectPath + "\\Projects");      
                        },
                        createInputOutputFileTree = function(productFiletree, projectPath){
                            var files = file.readfoldersync(projectPath);                            
                            if (($rootScope.simucenter.CSuprem.isProjectRun && $rootScope.simucenter.CSuprem.isCurrentApp) || $rootScope.simucenter.CSuprem.isCurrentApp)                                
                                createCsupremInputFileTree(files, productFiletree.inputfiles[0], projectPath);
                            else
                                createApsysInputFileTree(files, productFiletree.inputfiles[0], projectPath);
                            createOutputFileTree(files, productFiletree.outputfiles[0], projectPath);
                        },
                        resetAllFileTree = function (filetree) {
                            resetInputFileTree(filetree);
                            resetOutputFileTree(filetree);
                            resetSeriesFileTree(filetree);
                        },
                        resetInputOutputFileTree = function (filetree) {
                            resetInputFileTree(filetree);
                            resetOutputFileTree(filetree);
                        },
                        resetInputFileTree = function (filetree) {
                            filetree.inputfiles.splice(0, filetree.inputfiles.length);
                            if ($rootScope.simucenter.CSuprem.isCurrentApp)
                                filetree.inputfiles = new csupremInputFileTreeInit;
                            else
                                filetree.inputfiles = new apsysInputFileTreeInit;
                        },
                        resetOutputFileTree = function (filetree) {
                            filetree.outputfiles.splice(0, filetree.outputfiles.length);
                            filetree.outputfiles = new outputFileTreeInit;
                        },
                        resetSeriesFileTree = function (filetree) {
                            filetree.seriesfiles.splice(0, filetree.seriesfiles.length);
                            filetree.seriesfiles = new seriesFileTreeInit;
                        },
                        MACRO_FILE_CSUPREM = [
                            {"title": "back.key"},
                            {"title": "suprem.key"},
                            {"title": "Crystal_Trim_table.imp"},
                            {"title": "sup4gs_sims1.imp"},
                            {"title": "sup4gs_stanford.imp"},
                            {"title": "sup4gs_utmarlowe.imp"},
                            {"title": "Trim_table.imp"},
                            {"title": "Modelrc"}
                        ],
                        MACRO_FILE_APSYS = [
                            {"title": "crosslight.mac"},
                            {"title": "crosslight.tab"},
                            {"title": "geometry.tab"},
                            {"title": "layer.tab"},
                            {"title": "macrolist_studio.tab"},
                            {"title": "more.mac"},
                            {"title": "pics1d.tab"},
                            {"title": "plotdata.tab"}
                        ],
                        getFileExtension = function (fileName) {
                            var fn = fileName.split(".");
                            return fn[fn.length - 1];
                        },
                        openFile = function (product, fileName, filePath) {
                            if (!filePath)
                                return;
                            if (!file.existsfile(filePath)) {
                                alert("This file path is not exist.");
                                return;
                            }

                            var simuApp = new $rootScope.simucenter.crosslightApp,
                                    exName = getFileExtension(fileName),
                                    newFilePath = "\"" + filePath + "\"";

                            if (exName === "str") {
                                openFileWithApp(product.appPath + simuApp.CSUPREM_CROSSLIGHTVIEW, filePath);
                            } else if (exName.substr(0, 3) === "std") {
                                openFileWithApp(product.appPath + simuApp.APSYS_CROSSLIGHTVIEW, filePath);
                            } else if (exName === "ps") {
                                openFileWithApp('', filePath);
                            } else {
                                var num = filePath.lastIndexOf("\\");
                                openFileWithEditor(product, fileName, filePath, product.editors.getEditorObject(product.productName, fileName, filePath.substring(0, num - 1)), 0);
                            }
                            $rootScope.simucenter.setFont();
                            $("#fixNoRefresh").click();
                            calculateEditorWidthByTreeClick();
                        },
                        /*
                         * type=0,click file node to open file; type=1 click recent file path to open
                         */
                        openFileWithEditor = function (product, fileName, filePath, editorObject, type) {
                            product.editors.hideAllEditor($("." + editorObject.editorArrayObject));
                            if (product.editors.isFileOpen(fileName, filePath, product.openFiles)) { //the file is open already
                                product.editors.showEditor(product, fileName, filePath, $("." + editorObject.editorArrayObject), editorObject.editorID);
                            } else {
                                product.editors.createEdtior(product, fileName, filePath, editorObject.editorID, editorObject.editorContainerID, editorObject.editorArrayObject);
                            }
                            $("#editorID").val(editorObject.editorID);
                            //write and update recentfiles
                            if (type === 0) {
                                product.writeRecentFile(product.productName, fileName, filePath);
                                product.recentFiles = product.getRecentFile(product.productName);
                            }
                        },
                        openFileWithApp = function (appPath, filePath) {
                            childprocess.callbackground(appPath, filePath, '', function () {
                            }, function () {
                            }, function () {
                            });
                        },
                    calculateEditorWidthByTreeClick = function () {
                                    var tabs = '[id="filetitle"]';
                                    var tabAreaWidth = $(".panel-title").width();
                                    var tabWidths = 100;
                                    var temp = $(tabs).closest( "div" )
                                    var activeDiv;
                                     $.each(temp, function(i,e){
                                         if(!$(e).hasClass("ng-hide")){
                                             activeDiv = e;
                                         }
                                     });
                                     var allActiveLi = $(activeDiv).find("ul.filetitle li:visible");
                                     var allHiddenLi = $(activeDiv).find("ul.filetitle li:hidden");

                                    //Add Up the Tabs' Widths
                                    $.each($(allActiveLi), function(idx, obj){
                                        tabWidths += $(obj).outerWidth(); //padding
                                    });

                             //Find out which ones to hide
                                     while(tabWidths > tabAreaWidth) {
                                         var hider = $(allActiveLi).first();
                                         tabWidths -= $(hider).outerWidth();
                                         $(hider).hide();
                                         allHiddenLi.push(hider);
                                         allActiveLi.splice(0,1);

                                     }
                         };

                factory.createFiletreeObject = function () {
                    return new filetreeObject();
                };

                return factory;
            }]);