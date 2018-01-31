'use strict';

angular
        .module('object.product', [])
        .factory('product', ['$rootScope', 'filetree','rightclickmenu', 'message', 'editor', 'file', 'childprocess', '$sce', function ($rootScope, filetrees, rightclickmenu, messages, editor, file, childprocess, $sce) {
                var factory = {},
                        productObject = function () {
                            this.title = '';
                            this.appPath = '';
                            this.projectPath = '';
                            this.helpPath = '';
                            this.navigations = [];
                            this.quickMenus = [];
                            this.recentFiles = [];
                            this.openFiles = [];
                            this.runFileList = [];
                            this.wizard = [];
                            this.LAYER= "\\layer.exe", //apsys / pics3d
                            this.GEOMETRY= "\\geometry.exe", //apsys / pics3d
                            this.rightClickMenu =rightclickmenu.createRightClickMenuObject();
                            this.filetree = filetrees.createFiletreeObject();
                            this.message = messages.createMessageObject();
                            this.editors = editor.createEditorContainerObject();
                            this.isInit = false;
                           // this.isCurrentApp = false;
                            this.isProjectRun = false;
                            this.isSeriesRun = false;
                            this.isSeriesShow = false; //hide or show seriesfiletree pannel
                            this.showRecentFile = false;
                            this.showStartPage = true;
                            this.init = init;
                            // this.appPathValidate = appPathValidate;
                            // this.getUserSetting = getUserSetting;
                            this.setUserSetting = setUserSetting;
                            // this.getSettingValue = getSettingValue;
                            this.getNavigation = getNavigation;
                             this.getQuickBar = getQuickBar;
                            // this.getRecentFile = getRecentFile;
                            // this.getCurrentPath = getCurrentPath;
                            // this.getExtensionName = getExtensionName;
                            // this.writeRecentFile = writeRecentFile;
                            // this.deleteRecentFile = deleteRecentFile;
                            // this.runProject = runProject;
                             this.createBatFileToRun = createBatFileToRun;
                            // this.createProject = createProject;
                            // this.createNewFile = createNewFile;
                            // this.clearProjectFolder = clearProjectFolder;
                            // this.callAppToRun = callAppToRun;
                            // this.callAppToRun2 = callAppToRun2;
                            // this.executeFile = executeFile;
                            // this.switchQuickButton = switchQuickButton;
                            // this.switchQuickMenu = switchQuickMenu;
                            // this.openStop = openStop;
                            // this.closeStop = closeStop;
                            // this.refreshUndoRedo = refreshUndoRedo;
                        },
                        init = function () {
                            //this.appPath = getUserSetting(this);
                            this.navigations = getNavigation();
                            this.quickMenus = getQuickBar();
                            // this.recentFiles = getRecentFile(this.productName);
                            // if (this.productName === "CSuprem") {
                            //     this.filetree.inputfiles = new this.filetree.csupremInputFileTreeInit;
                            //     this.helpPath = this.appPath + "/Doc/csuprem_ref/initialize.htm";
                            // } else if (this.productName === "Apsys") {
                            //     this.helpPath = this.appPath + "/GUI/HTML/general/manualse280.html";
                            // } else {
                            //     this.helpPath = this.appPath + "/GUI/HTML/general/manualse292.html";
                            // }
                            // if (this.productName !== "CSuprem")
                            this.filetree.inputfiles = new this.filetree.apsysInputFileTreeInit;
                            // this.filetree.outputfiles = new this.filetree.outputFileTreeInit;
                            // this.filetree.seriesfiles = new this.filetree.seriesFileTreeInit;
                            // this.editors.startPageInit(this.openFiles);
                            // this.message.runtime.isActive = true;
                            this.isInit = true;
                         },
                        // userSettingFunction = function (product, chooseID, appPathID, helpPath) {
                        //     $("#userSettingWindow").modal('toggle');
                        //     var pj = document.querySelector(chooseID);
                        //     pj.addEventListener("change", function (evt) {
                        //         document.querySelector(appPathID).value = this.value;
                        //         product.appPath = this.value;
                        //         product.helpPath = product.appPath + helpPath;
                        //         product.setUserSetting(product.appPathName, this.value);
                        //     }, false);
                        // },
                        // stopSeries = function (product, taskname) {
                        //     var filePath = product.getCurrentPath() + "\\stop.bat";
                        //     file.writeallsync(filePath, "taskkill \/f \/im " + taskname + " \/t \r\n \
                        //                                  taskkill \/f \/im layer.exe \/t \r\n \
                        //                                  taskkill \/f \/im gnuplot.exe \/t \r\n \
                        //                                  taskkill \/f \/im pause.exe \/t \r\n \
                        //                                  ");
                        //     product.executeFile(filePath, function () {
                        //         product.closeStop(product);
                        //     });
                        // },
                        // /* five normal path example:
                        //  *  c:\NovaTCAD\Apsys\apsys\
                        //  c:\NovaTCAD\Pics3d\pics3d\
                        //  c:\NovaTCAD\CSuprem\bin\
                        //  c:\crosslig\apsys\
                        //  c:\crosslig\pics3d\
                        //  */
                        // checkAppPath = function (product) {
                        //     var pt = getCurrentPath(),
                        //             t = pt.split('\\'),
                        //             foldername = t[t.length - 1],
                        //             indexnum = pt.lastIndexOf('\\'),
                        //             rpath = "";
                        //     var haspath = false;
                        //     if (foldername === 'Bin' || foldername === 'bin' || foldername === 'Csuprem' || foldername === 'csuprem') { //is csuprem folder, e.g.c:\NovaTCAD\CSuprem\bin\
                        //         if (product.productName === 'CSuprem') {
                        //             rpath = pt.substr(0, indexnum);
                        //             haspath = true;
                        //         } else if (product.productName === 'Apsys') {//this is apsys path, the exe file is under c:\NovaTCAD\CSuprem\bin
                        //             var pt2 = pt.substr(0, indexnum),
                        //                     indexnum2 = pt2.lastIndexOf('\\');
                        //             if (file.existsfile(pt.substr(0, indexnum2) + '\\Apsys\\apsys') && file.existsfile(pt.substr(0, indexnum2) + '\\Apsys\\apsys_examples')) {
                        //                 rpath = pt.substr(0, indexnum2) + '\\Apsys';
                        //                 haspath = true;
                        //             }
                        //         }
                        //     } else if (foldername === 'apsys' || foldername === 'Apsys') { //is apsys folder, e.g. c:\NovaTCAD\Apsys\apsys\
                        //         if (product.productName === 'Apsys' || (product.productName === 'Apsys' && file.existsfile(pt + "\\SimuApsys.exe"))) {
                        //             rpath = pt.substr(0, indexnum);
                        //             haspath = true;
                        //         } else if (product.productName === "CSuprem") {//this is csuprem path, the exe file is under c:\NovaTCAD\Apsys\apsys
                        //             var pt2 = pt.substr(0, indexnum),
                        //                     indexnum2 = pt2.lastIndexOf('\\');
                        //             if (file.existsfile(pt.substr(0, indexnum2) + '\\Csuprem\\Bin') && file.existsfile(pt.substr(0, indexnum2) + '\\Csuprem\\examples')) {
                        //                 rpath = pt.substr(0, indexnum2) + '\\Csuprem';
                        //                 haspath = true;
                        //             }
                        //         }
                        //     } else if (foldername === 'pics3d' || foldername === 'Pics3d') {//c:\crosslig\pics3d\
                        //         if (product.productName === 'Pics3d' && file.existsfile(pt + "\\SimuPics3d.exe")) {
                        //             rpath = pt.substr(0, indexnum);
                        //             haspath = true;
                        //         }
                        //     }
                        //     if (file.existsfile(userSettingPath()) && !haspath) {
                        //         var uersetting = angular.fromJson(file.readallsync(userSettingPath()));
                        //         if (product.productName === 'CSuprem') {
                        //             rpath = getSettingValue(uersetting, "CSupremPath");
                        //             if (!file.existsfile(rpath + '\\Bin') && !file.existsfile(rpath + '\\examples'))
                        //                 rpath = "";
                        //         } else if (product.productName === 'Apsys') {
                        //             rpath = getSettingValue(uersetting, "ApsysPath");
                        //             if (!file.existsfile(rpath + '\\apsys') && !file.existsfile(rpath + '\\apsys_examples'))
                        //                 rpath = "";
                        //         } else if (product.productName === 'Pics3d') {
                        //             rpath = getSettingValue(uersetting, "Pics3dPath");
                        //             if (!file.existsfile(rpath + '\\pics3d') && !file.existsfile(rpath + '\\pics3d_examples'))
                        //                 rpath = "";
                        //         }
                        //     }
                        //     return rpath;
                        // },
                        // appPathValidate = function (product) {
                        //     if (checkAppPath(product) === "") {
                        //         if (confirm('The system cannot detect the path of ' + product.productName + ', go to manually set?')) {
                        //             if (product.productName === 'CSuprem')
                        //                 userSettingFunction(this, '#appPathFolder_CSuprem', "input[ng-model='simucenter.CSuprem.appPath']", "/Doc/csuprem_ref/initialize.htm");
                        //             else if (product.productName === 'Apsys')
                        //                 userSettingFunction(this, '#appPathFolder_Apsys', "input[ng-model='simucenter.Apsys.appPath']", "/GUI/HTML/general/manualse280.html");
                        //             else if (product.productName === 'Pics3d')
                        //                 userSettingFunction(this, '#appPathFolder_Pics3d', "input[ng-model='simucenter.Pics3d.appPath']", "/GUI/HTML/general/manualse292.html");
                        //         }
                        //         return false;
                        //     } else {
                        //         return true;
                        //     }
                        // },
                        // getUserSetting = function (product) {//"CSupremPath","ApsysPath","Pics3dPath"
                        //     return checkAppPath(product);
                        //     /*else{//need user to set path
                        //      if(confirm('The system cannot detect a path of ' + product.productName + ', do you need to manually set?')){
                        //      if(product.productName === 'CSuprem')
                        //      userSettingFunction(this, '#appPathFolder_CSuprem', "input[ng-model='simucenter.CSuprem.appPath']", "/Doc/csuprem_ref/initialize.htm");
                        //      else if(product.productName === 'Apsys')
                        //      userSettingFunction(this, '#appPathFolder_Apsys', "input[ng-model='simucenter.Apsys.appPath']", "/GUI/HTML/general/manualse280.html");
                        //      }
                        //      }*/
                        //
                        //     /*if (file.existsfile(userSettingPath())) {
                        //      var uersetting = angular.fromJson(file.readallsync(userSettingPath())),
                        //      appPath = getSettingPath(uersetting, pathName);
                        //      return appPath;
                        //      }*/
                        // },
                        setUserSetting = function (pathName, productPath) {
                            var uersetting = [];
                            if (file.existsfile(userSettingPath())) {
                                uersetting = angular.fromJson(file.readallsync(userSettingPath()));
                                if (getSettingValue(uersetting, pathName) !== "") {
                                    for (var app in uersetting) {
                                        for (var value in uersetting[app]) {
                                            if (pathName === value) {
                                                uersetting[app][value] = productPath;
                                                break;
                                            }
                                        }
                                    }
                                } else {
                                    pushSettingData(uersetting, pathName, productPath);
                                }
                            } else {
                                pushSettingData(uersetting, pathName, productPath);
                            }
                            file.writeallsync(userSettingPath(), angular.toJson(uersetting));
                        },
                        getNavigation = function () {
                            return angular.fromJson(file.readallsync("json\\nav\\navigation.json"));
                        },
                        getQuickBar = function () {
                                return angular.fromJson(file.readallsync("json\\quick\\quick.json"));
                        },
                        // getRecentFile = function (productName) {
                        //     var recentFiles = [], rPath = recentFilePath();
                        //     if (file.existsfile(rPath)) {
                        //         var recentfile = angular.fromJson(file.readallsync(rPath));
                        //         angular.forEach(recentfile, function (rf) {
                        //             if (productName === rf.productName)
                        //                 recentFiles = rf.recentFiles;
                        //         });
                        //     }
                        //     return recentFiles;
                        // },
                        // writeRecentFile = function (productName, fileName, filePath) {
                        //     var recentfile = "", rPath = recentFilePath();
                        //     if (file.existsfile(rPath)) {
                        //         recentfile = angular.fromJson(file.readallsync(rPath));
                        //         var hasProduct = false, isFileExist = false;
                        //         angular.forEach(recentfile, function (rf) {
                        //             if (productName === rf.productName) {
                        //                 hasProduct = true;
                        //                 angular.forEach(rf.recentFiles, function (rfile) {
                        //                     if (rfile.fileName === fileName && rfile.filePath === filePath)
                        //                         isFileExist = true;
                        //                 });
                        //                 if (!isFileExist) {
                        //                     if (rf.recentFiles.length >= 10)
                        //                         rf.recentFiles.length -= 1;
                        //                     rf.recentFiles.unshift({"fileName": fileName, "filePath": filePath});
                        //                 }
                        //             }
                        //         });
                        //         if (!hasProduct && !isFileExist)
                        //             recentfile.push({"productName": productName, "recentFiles": [{"fileName": fileName, "filePath": filePath}]});
                        //     } else {
                        //         recentfile = [{"productName": productName, "recentFiles": [{"fileName": fileName, "filePath": filePath}]}];
                        //     }
                        //     file.writeallsync(rPath, angular.toJson(recentfile));
                        // },
                        // deleteRecentFile = function (productName, fileName, filePath) {
                        //     var rPath = recentFilePath(),
                        //             recentFile = angular.fromJson(file.readallsync(rPath));
                        //     angular.forEach(recentFile, function (rfs, pindex) {
                        //         if (productName === rfs.productName) {
                        //             angular.forEach(rfs.recentFiles, function (rf, index) {
                        //                 if (rf.fileName === fileName && rf.filePath === filePath)
                        //                     recentFile[pindex].recentFiles.splice(index, 1);
                        //             });
                        //         }
                        //     });
                        //     file.writeallsync(rPath, angular.toJson(recentFile));
                        // },
                        // /*
                        //  * type=0, click RUN button
                        //  *         (1).only one file goto Run
                        //  *         (2).more than one files will return a filelist and goto type=1
                        //  * type=1, select one project file to run in popwindow
                        //  * type=2, .in file node or .sol file node right click to simulate. In this case, projectfilelist=filepath(on the inputfile tree)
                        //  *         (1).if the node from inputfiletree then need to update inputfiletree & outputfiletree
                        //  *         (2).if the node from seriesfiletree then need to update seriesfiletree
                        //  * type=3, (1).if folder node like: init_wavel_1_1.3_11142016_692881, then checking the .bat in fisrt sub folder(0001), and return a .bat file list
                        //  *         (2).if folder node like: 0001,0002, then checking the .in or .sol file in this folder, and return file list
                        //  * type=4, choose a filename from file list(last step from type=3)
                        //  *         (1)if node type is 'series', then run all sub project folders with the selected file
                        //  *         (2)if node type is 'sub', then run this file
                        //  * treeType = 0, it means 'Use .bat File' on AutoTCAD pannel
                        //  */
                        // runProject = function (product, appPath, filetreeNodes, projectNum, fileFormat, runFileList, projectFileList, type, treeType) {
                        //     var runFunction = function (product, appPath, runFileName, filePath) {
                        //         openStop(product);
                        //         product.message.setMessageActive(product.message, product.message.simu, 1);
                        //         if (type === 0)
                        //             product.message.simu.content.push(product.projectPath + ">" + appPath + " " + runFileName);
                        //         else if (type === 1)
                        //             product.message.simu.content.push(filePath + ">" + appPath + " " + runFileName);
                        //         //if (type !== 2)
                        //             callAppToRun(product, appPath, runFileName, filePath, product.message.simu, type,treeType);
                        //     }
                        //
                        //     switch (type) {
                        //         case 0: //click RUN button
                        //             product.runFileList = [];
                        //             for (var i = (projectNum - 1); i < filetreeNodes.length; i++) {
                        //                 if (getExtensionName(filetreeNodes[i].title) === fileFormat && filetreeNodes[i].title.substr(0, 3) !== "geo" && filetreeNodes[i].title.substr(0, 4) !== "temp")
                        //                     product.runFileList.push({"fileName": filetreeNodes[i].title, "filePath": filetreeNodes[i].url, type: ""});
                        //             }
                        //             if (product.runFileList.length > 1)
                        //                 $("#selectProjectWindow").modal('toggle');
                        //             else
                        //                 runFunction(product, appPath, product.runFileList[0].fileName, product.projectPath.replace(/\\/g,"\\\\"), 0);
                        //             break;
                        //         case 1: //select one project to run in popwindow(select project window)(from click RUN)
                        //             var fname = $('input[name=' + projectFileList + ']:checked').val();
                        //             if (fname) {
                        //                 runFunction(product, appPath, fname, product.projectPath, 0);
                        //                 $('#selectProjectWindow').modal('toggle');
                        //             } else {
                        //                 alert("Please select one project file.");
                        //                 return;
                        //             }
                        //             break;
                        //         case 2: //tree right-click to simulate(inputfiletree and seriesfiletree, only file node right-click). In this case, projectfilelist=filepath
                        //             var filename = runFileList,
                        //                     filepath = fileFormat,
                        //                     lindex = filepath.lastIndexOf("\\");
                        //             runFunction(product, appPath, filename, filepath.substr(0, lindex - 1), 1);
                        //             break;
                        //         case 3: //seriesfile tree right-click to simulate
                        //             //select 0001 of series, search .bat file under this directory, then add it to select list
                        //             //popup select project file window to choose one .bat file
                        //             //click OK to run .bat file
                        //             //run all series project with this .bat file
                        //             product.runFileList = [];
                        //             var seriesPath = filetreeNodes, //simulate one of series projects, like: simulate folder '0001'
                        //                     seriesType = "sub";
                        //             if (appPath === "") { //simulate a series projects, like: simulate folder 'init_wavel_1_1.3_11152016_308572'
                        //                 seriesPath = filetreeNodes + "\\0001";
                        //                 seriesType = "series";
                        //             }
                        //             var seriesFiles = file.readfoldersync(seriesPath);
                        //             for (var i = 0; i < seriesFiles.length; i++) {
                        //                 if (getExtensionName(seriesFiles[i]) === fileFormat)
                        //                     product.runFileList.push({"fileName": seriesFiles[i], "filePath": seriesPath + "\\" + seriesFiles[i], type: seriesType, seriesPath: filetreeNodes});
                        //             }
                        //             $("#selectProjectWindow").modal('toggle');
                        //             break;
                        //         case 4: //select one file to run in popwindow(from series filetree right-click)
                        //             var fname = $('input[name=' + projectFileList + ']:checked').val();
                        //             if (fname) {
                        //                 var fobj = "";
                        //                 for (var i = 0; i < product.runFileList.length; i++) {
                        //                     if (product.runFileList[i].fileName === fname) { //get one series from 'Projects' folder
                        //                         fobj = product.runFileList[i];
                        //                         break;
                        //                     }
                        //                 }
                        //                 var folderPath = filetreeNodes; //folderPath like: init_wavel_1_1.3_11142016_692881
                        //                 if (fobj.type === "series") {     //run whole series(run .bat file)
                        //                     var allsub = file.readfoldersync(folderPath), //get all sub folders under series parent directory
                        //                             subindex = 0,
                        //                             callbat = function () {
                        //                                 if (subindex < allsub.length && allsub[subindex].indexOf(".") === -1) {
                        //                                     var tpath = folderPath + "\\" + allsub[subindex],
                        //                                             fullPath = tpath + "\\temp.bat";
                        //                                     if (!file.isFile(tpath)) {
                        //                                         file.writeallsync(fullPath, folderPath.split("\\")[0] + "\r\n cd \"" + tpath + "\"\r\n" + fname + "\"\r\n");//temp.bat
                        //                                         $("#loading").show();
                        //                                         runFunction(product, '', '', '', 2);
                        //                                         product.callAppToRun2(product, fullPath, product.message.simu, function () { //run .bat file in every sub folders
                        //                                             dataFresh(product, allsub[subindex] + " finished.\r\n", product.message.simu);
                        //
                        //                                             if (subindex === allsub.length - 1 && treeType == 0) {
                        //                                                 finishRunAndFresh(product);
                        //                                             } else {
                        //                                                 subindex++;
                        //                                                 callbat();
                        //                                             }
                        //                                             if (file.existsfile(fullPath))
                        //                                                 file.delfile(fullPath);
                        //                                         });
                        //                                     } else {
                        //                                         subindex++;
                        //                                         callbat();
                        //                                     }
                        //                                 } else {
                        //                                     if(treeType == 0)
                        //                                         finishRunAndFresh(product);
                        //                                 }
                        //                             };
                        //                     callbat();
                        //                 } else if (fobj.type === "sub") {//run sub one series(run .sol file)  //folderPath like:0001
                        //                     openStop(product);
                        //                     product.message.setMessageActive(product.message, product.message.simu, 1);
                        //                     product.message.simu.content.push(folderPath + ">" + appPath + " " + fname);
                        //                     callAppToRun(product, appPath, fname, folderPath, product.message.simu, type,treeType); //only run .sol file in this sub folder
                        //                 }
                        //             } else {
                        //                 alert("Please select one file. to simulate.");
                        //                 return;
                        //             }
                        //
                        //             $("#selectProjectWindow").modal('toggle');
                        //             break;
                        //     }
                        // },
                        // finishRunAndFresh = function (product) {
                        //     dataFresh(product, "All finished.\r\n", product.message.simu);
                        //     $("#loading").hide();
                        //     closeStop(product);
                        //
                        //     refreshPsAndStd();
                        //
                        //     //show result
                        //     if ($("#autotcadPanel").parent()[0].style.display === 'none') //show result
                        //         $("body").layout("expand", "east");
                        //     $("#seriesPages").accordion("select", "Results");
                        // },
                        // /**
                        //  * @param {type} typeName = 'pltViewResult'
                        //  *                          'generateGainPlot'
                        //  *                          'gainPreview'
                        //  *                          'viewMesh'
                        //  *                          'geoGenerateMesh'
                        //  *                          'layerProcessToGeo'
                        //  * @param {type} toolbar = 0 for tree node right-right
                        //  *                       = 1 for quick bar button
                        //  */
                        createBatFileToRun = function (appName, fileName, filePath, typeName, batName, toolbar) {
                            var mainFileName = fileName.split(".")[0],
                                    lindex = filePath.lastIndexOf("\\");
                            switch (typeName) {
                                case "pltViewResult": //quick bar 'Plot.Plt'   or   'View result' on right-click of .plt file   or    'Plot' on right-click of .gnu file
                                    writeBatFile1(this, appName, filePath.substr(0, lindex), mainFileName, ".plt", ".ps", batName);//viewresult.bat
                                    break;
                                case "generateGainPlot": //'Generate .gain and plot' on right-click of .mater file
                                    writeBatFile1(this, appName, filePath.substr(0, lindex), mainFileName, ".mater", "_g.ps", batName);//generateGainPlot.bat
                                    break;
                                case "gainPreview": //'Gain preview' on right-click of .gain file
                                    writeBatFile1(this, appName, filePath.substr(0, lindex), mainFileName, ".gain", "_g.ps", batName);//gainpreview.bat
                                    break;
                                case "viewMesh": //'View mesh' on right-click of .msh and .mplt file
                                    //1.create ganled.mplt
                                    var sb = "begin_plotmesh\r\n";
                                    sb += "plot_mesh mesh_infile=" + mainFileName + ".msh plot_device=postscript\r\n";
                                    sb += "end_plotmesh\r\n";
                                    file.writeallsync(filePath.substr(0, lindex) + "\\" + mainFileName + ".mplt", sb);
                                    writeBatFile1(this, appName, filePath.substr(0, lindex), mainFileName, ".mplt", "_m.ps", batName);//viewgs.bat
                                    break;
                                case "geoGenerateMesh": // step2 of quick bar 'Gen.Mesh'   or   'Generate mesh' on right-click of .geo file
                                    writeBatFile2(this, appName, filePath.substr(0, lindex), fileName);
                                    break;
                                case "layerProcessToGeo": // step1 of quick bar 'Gen.Mesh'   or    'Process this .layer file to generate .geo' on right-click of .layer file
                                    writeBatFile2(this, appName, filePath.substr(0, lindex), fileName);
                                    break;
                            }

                            if (!toolbar) {//for right-click
                                this.message.setMessageActive(this.message, this.message.runtime);
                                this.message.runtime.cleanMessage();
                                callAppToRun(this, '', filePath.substr(0, lindex) + "\\" + batName, '', this.message.runtime, -1);
                            }
                        },
                        // createProject = function (projectName, projectPath, fileTypes) {
                        //     if (file.existsfile(projectPath)) {
                        //         if (confirm("The project path already exists, are sure use it?")) {
                        //             angular.forEach(fileTypes, function (fileType) {
                        //                 var filePath = projectPath + "\\" + projectName + "." + fileType;
                        //                 if (file.existsfile(filePath)) {
                        //                     if (confirm("The project file already exists, whether or not to replace it?")) {
                        //                         file.delfile(filePath);
                        //                         file.writeallsync(filePath, "");
                        //                     }
                        //                 } else {
                        //                     file.writeallsync(filePath, "");
                        //                 }
                        //             });
                        //         }
                        //     } else {
                        //         file.mkdirsync(projectPath);
                        //         angular.forEach(fileTypes, function (fileType) {
                        //             file.writeallsync(projectPath + "\\" + projectName + "." + fileType, "");
                        //         });
                        //     }
                        // },
                        // createNewFile = function (fileName, filePath, fileType) {
                        //     if (file.existsfile(filePath)) {
                        //         file.writeallsync(filePath + "\\" + fileName + "." + fileType, "");
                        //         return true;
                        //     } else {
                        //         return false;
                        //     }
                        // },
                        // clearProjectFolder = function (projectPath) {
                        //     var clearSeriesProjectFolder = function (folderPath) {
                        //         var folderNames = file.readfoldersync(folderPath);
                        //         angular.forEach(folderNames, function (folderName, index) {
                        //             if (folderName !== 'series.json') {
                        //                 var newFolderName = folderPath + '\\' + folderName;
                        //                 if (file.isFile(newFolderName)) {
                        //                     file.delfile(newFolderName);
                        //                 } else {
                        //                     clearSeriesProjectFolder(newFolderName);
                        //                 }
                        //                 if (index === folderNames.length - 1)
                        //                     file.rmdirsync(folderPath);
                        //             }
                        //         });
                        //     };
                        //     clearSeriesProjectFolder(projectPath);
                        // },
                        // openStop = function (product) {
                        //     product.isProjectRun = true;
                        //     switchQuickButton(product.productName, "Stop", 1); //open(turn gray)   //actually this line code is not need, the page just need fresh
                        //     switchQuickMenu(product, "Stop", 1);
                        //     switchQuickButton(product.productName, "Run", 0);  //close(turn green)
                        //     switchQuickMenu(product, "Run", 0);
                        // },
                        // closeStop = function (product) {
                        //     product.isProjectRun = false;
                        //     switchQuickButton(product.productName, "Stop", 0); //close(turn green)
                        //     switchQuickMenu(product, "Stop", 0);
                        //     switchQuickButton(product.productName, "Run", 1);  //open(turn gray)
                        //     switchQuickMenu(product, "Run", 1);
                        // },
                        // refreshUndoRedo = function (product) {
                        //     var currentEditor = product.editors.getCurrentEditorObject(product);
                        //     if (currentEditor)
                        //         showFileFunction(product, currentEditor.fileName, currentEditor.filePath, currentEditor.editorID);
                        // },
                        // /*
                        //  * switch button on the page
                        //  */
                        // switchQuickButton = function (productName, buttonName, type) { //type=0 is close(turn grenn); type=1 is open(turn gray)
                        //     var quickButton = $(".quickbar." + productName + " button");
                        //     for (var i = 0; i < quickButton.length; i++) {
                        //         var bText = $(quickButton[i]).text().replace(/(^\s*)|(\s*$)/g, "");
                        //         if (bText === buttonName) {
                        //             if (type === 0)
                        //                 $(quickButton[i]).addClass("disabled");
                        //             else
                        //                 $(quickButton[i]).removeClass("disabled");
                        //             break;
                        //         }
                        //     }
                        // },
                        // /*
                        //  * switch json data for product'quickMenu(this is a test)
                        //  */
                        // switchQuickMenu = function (product, menuName, type) {
                        //     for (var i = 0; i < product.quickMenus.length; i++) {
                        //         if (product.quickMenus[i].name === menuName) {
                        //             if (type === 0)
                        //                 product.quickMenus[i].disabled = "disabled";
                        //             else
                        //                 product.quickMenus[i].disabled = "";
                        //             break;
                        //         }
                        //     }
                        // },
                        // /**
                        //  * type - -1
                        //  *         0 click RUN icon
                        //  *         1
                        //  *         2
                        //  *         3
                        //  *         4
                        //  */
                        doFreshData = function (product, data, msgbox, type,treetype) {
                            dataFresh(product, data, msgbox);
                            if(type === 0 || type === 1 || (type === 2 && treetype !== 'seriesfile')){ //updata inputfile & outputfile
                                product.filetree.resetInputOutputFileTree(product.filetree);
                                product.filetree.createInputOutputFileTree(product.filetree, product.projectPath);
                            }else if((type === 2 && treetype === 'seriesfile') || type === 4){ //update seriesfile
                                product.filetree.resetSeriesFileTree(product.filetree);
                                var seriesPath = product.projectPath + "\\Projects";
                                if (file.existsfile(seriesPath)) {
                                    var files = file.readfoldersync(seriesPath);
                                    product.filetree.creatSeriesFileTree(files, product.filetree.seriesfiles[0], seriesPath);
                                }
                            }
                        },
                        // setLightHight = function (product, currentLineFile, lineAmount, lastLine, ifFileOpen, editorId) {
                        //     return window.setInterval(function () {
                        //         var currentLine = 0;
                        //         if (file.existsfile(currentLineFile)) {
                        //             var currentLineNumber = angular.fromJson(file.readallsync(currentLineFile));
                        //             if (currentLineNumber.currentLine)
                        //                 currentLine = currentLineNumber.currentLine;
                        //         }
                        //         if (currentLine !== 0 && currentLine !== lastLine && currentLine <= lineAmount && ifFileOpen) {
                        //             var tempLineNumber = currentLine;//if first line (need hightlight line)
                        //             var currentEditor = ace.edit(product.editors.getCurrentEditorObject(product).editorID);
                        //             currentEditor.gotoLine(currentLine + 1);
                        //             var firstLineNumber = parseInt($($("#editorContainer_" + product.productName + " .ace_layer .ace_gutter-cell ")[0]).text());//get editor's first line number
                        //             if (firstLineNumber !== 0) //it means editor scrolled (need hightlight line)
                        //                 tempLineNumber = currentLine - firstLineNumber + 1;
                        //             $($(editorId +" .ace_line")).css("background", "");       //clear background color for line number
                        //             $($(editorId +" .ace_gutter-cell")).css("background", "");//clear background color for text line
                        //             $($(editorId +" .ace_line")[tempLineNumber]).css("background", "yellow");
                        //             $($(editorId +" .ace_gutter-cell")[tempLineNumber]).css("background", "yellow");
                        //             lastLine = currentLine;
                        //         }
                        //     }, 500);
                        // },
                        callAppToRun = function (product, appName, fileName, outpath, msgbox, type, treetype) {
                            product.appPath = "C:\\NovaTCAD\\Apsys";
                            product.productName="Apsys";
                            product.appPathName = "ApsysPath";
                            debugger;
                            $("#loading").show();
                            var lastLine = 0;
                            var ifFileOpen = false;
                            var editorId = product.editors.getEditorObject("CSuprem", fileName, outpath).editorID;
                            angular.forEach(product.openFiles, function(of){
                                if(of.fileName == fileName && of.editorID == editorId)
                                    ifFileOpen = true;
                            });
                            if (fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length) === 'in') { //only for CSuprem
                                var lineAmount = file.readallsync(outpath + '\\' + fileName).split("\r\n").length;
                                var callRunningLighthigh = setLightHight(product, outpath + "\\currentLine.json", lineAmount, lastLine, ifFileOpen, "#editorContainer_CSuprem #"+ editorId +" .ace_layer");
                            }

                            childprocess.callbackground(appName, fileName, outpath,
                                    function (data) {
                                        doFreshData(product, data, msgbox, type,treetype);
                                    },
                                    function (data) {
                                        doFreshData(product, data, msgbox, type,treetype);
                                    },
                                    function (code) {
                                        window.clearInterval(callRunningLighthigh); //clear timeout function
                                        if (file.existsfile(outpath + "\\currentLine.json"))
                                            file.delfile(outpath + "\\currentLine.json");

                                        if (outpath !== "" && fileName.indexOf("\\") === -1) {
                                            var str = "---------------------------------Start Simulation---------------------------------\r\n\r\n";
                                            angular.forEach(msgbox.content, function (content) {
                                                if (content.indexOf("#_#") !== -1 || content.indexOf("###") !== -1)
                                                    str += content.replaceAll("_", " ") + "\n";
                                                else
                                                    str += content + "\n";
                                            });
                                            str += "---------------------------------Finish Simulation---------------------------------";
                                            file.writeallsync(outpath + "\\" + fileName.split(".")[0] + ".log", str);
                                        }

                                        doFreshData(product, 'finished.', msgbox, type,treetype);
                                        // closeStop(product);

                                        var ename = getExtensionName(fileName);
                                        var tempPath = outpath + '\\psview_' + angular.lowercase(product.productName) + ".bat";
                                        var tempName = fileName;
                                        if (fileName.indexOf("\\") !== -1) {
                                            ename = getExtensionName(fileName.substr(fileName.lastIndexOf("\\") + 1));
                                            tempPath = product.projectPath + '\\psview_' + angular.lowercase(product.productName) + ".bat";
                                            tempName = fileName.substr(fileName.lastIndexOf("\\") + 1);
                                        }
                                        if (ename === "bat" && tempName.substr(0, 3) === "RUN") {  //delete RUN*.bat
                                            file.delfile(fileName);
                                            if (file.existsfile(tempPath))
                                                file.delfile(tempPath);
                                            product.filetree.resetAllFileTree(product.filetree);
                                            product.filetree.createAllFileTree(product.filetree, product.projectPath);
                                        }

                                        $("#loading").hide();
                                        $("#fixNoRefresh").click();
                                    });
                        },
                        // callAppToRun2 = function (product, fileName, msgbox, callback) {
                        //     childprocess.callbackground('', fileName, '',
                        //             function (data) {
                        //                 doFreshData(product, data, msgbox, -1,0);
                        //             },
                        //             function (data) {
                        //                 doFreshData(product, data, msgbox, -1,0);
                        //             },
                        //             callback);
                        // },
                        // executeFile = function (filePath, callback) {
                        //     childprocess.callbackground('', filePath, '',
                        //             function () {
                        //             },
                        //             function () {
                        //             }, callback);
                        // },
                        dataFresh = function (product, data, msgbox) {
                            setMessage(data, msgbox); //set message
                            $("#fixNoRefresh").click();
                            // document.getElementById("msgcontent" + product.productName).scrollTop = document.getElementById("msgcontent" + product.productName).scrollHeight;
                        },
                        setMessage = function (data, msgbox) {
                            var str = data.toString().split("\n");

                            angular.forEach(str, function (msgstr) {
                                if((msgstr.indexOf(".layer") > -1 || msgstr.indexOf(".geo") > -1 || msgstr.indexOf(".mater") > -1 || msgstr.indexOf(".mplt") > -1 || msgstr.indexOf(".plt") > -1) && msgbox.name !== "simu"){
                                    msgbox.cleanMessage();
                                    msgbox.content.push("--------------------Start--------------------");
                                }
                                msgstr = msgstr.replace(/\\\\/g, "\\");
                                msgstr = msgstr.replace(/['"]+/g, '');
                                msgbox.content.push(msgstr);
                            });
                        },
                        // getSettingValue = function (settingJSON, pathName) {
                        //     var appPath = "";
                        //     for (var app in settingJSON) {
                        //         for (var value in settingJSON[app]) {
                        //             if (pathName === value) {
                        //                 appPath = settingJSON[app][value];
                        //                 break;
                        //             }
                        //         }
                        //     }
                        //     if (appPath === undefined)
                        //         appPath = "";
                        //     return appPath;
                        // },
                        // pushSettingData = function (uersetting, pathName, productPath) {
                        //     if (pathName === "CSupremPath")
                        //         uersetting.push({CSupremPath: productPath});
                        //     else if (pathName === "ApsysPath")
                        //         uersetting.push({ApsysPath: productPath});
                        //     else if (pathName === "Pics3dPath")
                        //         uersetting.push({Pics3dPath: productPath});
                        //     else if (pathName === "editorFontSize")
                        //         uersetting.push({editorFontSize: productPath});
                        //     else if (pathName === "wizardFontSize")
                        //         uersetting.push({wizardFontSize: productPath});
                        // },
                        getExtensionName = function (fileName) {
                            var fn = fileName.split(".");
                            return fn[fn.length - 1];
                        },
                        // getCurrentPath = function () {
                        //     var path = require('path');
                        //     return path.dirname(process.execPath);
                        // },
                        // recentFilePath = function () {
                        //     return getCurrentPath() + "\\recentfile.json";
                        // },
                        // userSettingPath = function () {
                        //     return getCurrentPath() + "\\crosslight.usersetting";
                        // },
                        // writeBatFile1 = function (app, appName, projectPath, fileName, fileType1, fileType2, batName) {
                        //     var sb = new String(),
                        //             pname = "",
                        //             newpath = "";
                        //     if (app.productName === "Apsys") {
                        //         pname = "apsys";
                        //     } else if (app.productName === "Pics3d") {
                        //         pname = "pics3d";
                        //     }
                        //     newpath = app.appPath + "\\" + pname;
                        //     sb = "";
                        //     //1.create psview_apsys.bat
                        //     //sb += "call " + newpath + "\\gnuplot.exe  junkg.tmp > NUL\r\n"
                        //     //sb += "move /Y output.ps %1\r\n";
                        //     //sb += "call %1";
                        //     //file.writeallsync(projectPath + "\\psview_" + pname + ".bat", sb);
                        //     //2.create viewresult.bat
                        //     sb = "\r\n" + projectPath.split("\\")[0] + "\r\n";
                        //     sb += "cd \"" + projectPath + "\"\r\n";
                        //     //sb += "del " + fileName + "_m.ps\r\n";
                        //     sb += "del junkg.tmp\r\n";
                        //     sb += "\"" + app.appPath + appName + "\" " + fileName + fileType1 + "\r\n";
                        //     sb += "call " + newpath + "\\gnuplot.exe  junkg.tmp > NUL\r\n"
                        //     sb += "move /Y output.ps "+ fileName + fileType2 +" \r\n";
                        //     sb += "call "+ fileName + fileType2;
                        //     //sb += projectPath + "\\psview_" + pname + ".bat " + fileName + fileType2 + "\r\n";  //replace(/\/\//g,"/")   become // to /
                        //     //sb += "\"" + newpath + "\\gnuplot.exe\" junkg.tmp\r\n";
                        //     //sb += "\"" + newpath + "\\wait.exe\"\r\n";
                        //     //sb += "\"" + newpath + "\\rename.exe\" output.ps " + fileName + fileType2 + "\r\n";
                        //     //sb += "\"" + newpath + "\\wait.exe\"\r\n";
                        //     //sb += fileName + fileType2 + "\r\n";
                        //     file.writeallsync(projectPath + "\\" + batName, sb);//viewresult.bat
                        // },
                        writeBatFile2 = function (app, appName, projectPath, fileName) {
                            var sb = new String();
                            sb = projectPath.split("\\")[0] + "\r\n";
                            sb += "cd \"" + projectPath + "\"\r\n";
                            sb += "\"" + "C:\\NovaTCAD\\Apsy" + appName + "\" " + fileName;
                            file.writeallsync(projectPath + "\\temp.bat", sb);//temp.bat
                        };

                factory.createProductObject = function () {
                    return new productObject();
                };


                return factory;
            }]);