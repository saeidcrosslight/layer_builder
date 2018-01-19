angular
        .module('object.networks', [])
        .factory('network_compute', ['$rootScope', 'file', function ($rootScope, file) {
                var factory = {},
                        networkObject = function () {
                            this.projectName = "";
                            this.seriesList = [];
                            /*
                             [
                             {
                             seriesFolderName:'',
                             subProjectNumber:0,
                             
                             }
                             ] 
                             */
                            this.uploadIP = "http://127.0.0.1:3000/api/instances"; //PC Server IP and port
                            this.savePath = getCurrentPath() + "\\crosslight";     //PC Server path
                            this.distributeNum = 0;
                            this.remotePClist = [];
                            /* remotePClist对象的结构
                             [
                                {
                                   connectInfo:'',  //内存和CPU信息
                                   distributeNum:0, //这个PC分发子项目的数量
                                   ip:'',           //这个PC的ip
                                   subFolders:[]    //分发的子项目文件夹名称数组
                                }
                             ]
                             */
                            this.selectedSeriesName = '';
                            this.processList = [ //记录在远程PC需要计算的执行列表
                                {
                                    'isCsuprem': false,
                                    'inList': [],
                                    'inFile': ''
                                }, {
                                    'isLayer': false,
                                    'layerList': [],
                                    'layerFile': ''
                                }, {
                                    'isGeo': false,
                                    'geoList': [],
                                    'geoFile': ''
                                }, {
                                    'isApsys': false,
                                    'solList': [],
                                    'solFile': ''
                                }, {
                                    'isPics3d': false,
                                }, {
                                    'isPlt': false,
                                    'pltList': [],
                                    'pltFile': ''
                                }, {
                                    'isJunkg': false,
                                    'junkgList': ['junkg.tmp'],
                                    'junkgFile': 'junkg.tmp'
                                }
                            ];                            
                            this.getInstanceID = getInstanceID;  //each project has a own instanceID
                            this.writeInstanceID = writeInstanceID;
                            this.uploadSubProjects = uploadSubProjects;
                            this.operate = operate;
                            this.ping = ping;
                        },
                        getInstanceID = function () {
                            var pname = getProjectName();
                            var instanceID = false;
                            if (file.existsfile(instancePath())) {
                                try {
                                    var instances = angular.fromJson(file.readallsync(instancePath()));
                                } catch (e) {
                                    //alert('\'' + instancePath() + '\' content is empty.');
                                }
                                angular.forEach(instances, function (iobj) {
                                    if (iobj.projectName === pname)
                                        instanceID = iobj.instanceID;
                                });
                            }
                            return instanceID;
                        },
                        writeInstanceID = function (instanceid) {
                            var instances = [],
                                    pname = getProjectName();
                            if (file.existsfile(instancePath())) {
                                var instanceFile = file.readallsync(instancePath());
                                if (instanceFile !== "") {
                                    instances = angular.fromJson(instanceFile);
                                    var hasProject = false, isFileExist = false;
                                    angular.forEach(instances, function (iid) {
                                        if (pname === iid.projectName)
                                            hasProject = true;
                                    });
                                    if (!hasProject)
                                        instances.push({"projectName": pname, "instanceID": instanceid});
                                } else {
                                    instances.push({"projectName": pname, "instanceID": instanceid});
                                }
                            } else {
                                instances.push({"projectName": pname, "instanceID": instanceid});
                            }
                            file.writeallsync(instancePath(), angular.toJson(instances));
                        },
                        getProjectName = function () {
                            var pn = $rootScope.simucenter.currentProduct().projectPath.split('\\');
                            return pn[pn.length - 1];
                        },
                        instancePath = function () {
                            return getCurrentPath() + "\\instance.json";
                        },
                        uploadSubProjects = function (projectPath, selectedSeriesName, networkObject) {
                            var hasInstanceID = getInstanceID();//this is local instanceID
                            if (!hasInstanceID) {//If this project has no instanceID
                                var settings = {
                                    "url": networkObject.uploadIP, //save instanceID to local first
                                    "data": {"savePath": networkObject.savePath + "\\"},
                                    "method": "POST"
                                };
                                $.ajax(settings).done(function (response) {//create instanceID for root project
                                    writeInstanceID(response.data);
                                    forSeriesProject(response.data, selectedSeriesName, projectPath, networkObject);
                                });
                            } else {
                                forSeriesProject(hasInstanceID, selectedSeriesName, projectPath, networkObject);
                            }
                        },
                        getCurrentPath = function () {
                            var path = require('path');
                            return path.dirname(process.execPath);
                        },
                        getExtensionName = function (fileName) {
                            var fn = fileName.split(".");
                            return fn[fn.length - 1];
                        },
                        forSeriesProject = function (instanceid, selectSeries, projectPath, networkObject) {
                            var uploadIP = networkObject.uploadIP,
                                    savePath = networkObject.savePath,
                                    remotePClist = networkObject.remotePClist,
                                    series = file.readfoldersync(projectPath + "\\Projects"),
                                    seriesIndex = 0,
                                    settings2 = {
                                        "url": uploadIP + "/" + instanceid + "/files", //this need to ping first
                                        "data": {"savePath": savePath + "\\", "filename": "", "data": "", "seriesName": '', "subProjectName": ''},
                                        "dataType": "json",
                                        "method": "POST"
                                    };
                            angular.forEach(series, function (seriesName, index) {
                                if (selectSeries.seriesFolderName === seriesName)
                                    seriesIndex = index;
                            });
                            forEachSeriesFolder = function () {
                                var seriesPath = projectPath + "\\Projects\\" + series[seriesIndex],
                                        sProjects = file.readfoldersync(seriesPath),
                                        proIndex = 0, //number of sub folders, like 0001,0002,0003...
                                        pcIndex = 0;  //
                                forEachProjectFolder = function () {
                                    if (proIndex < sProjects.length && !file.isFile(seriesPath + "\\" + sProjects[proIndex])) {
                                        remotePClist[pcIndex].subFolders.push(sProjects[proIndex]);
                                        var projectFiles = file.readfoldersync(seriesPath + "\\" + sProjects[proIndex]);
                                        var fileIndex = 0;

                                        //$rootScope.remotePCs: ip, savedPath, distributeNum       
                                        settings2.url = "http://" + remotePClist[pcIndex].ip + ":3000/api/instances/" + instanceid + "/files";
                                        settings2.data.savePath = savePath + "\\";

                                        //if project folder number equal PC1's distribute number, goto next remote PC
                                        if (pcIndex === 0 && parseInt(remotePClist[pcIndex].distributeNum) === proIndex) {//remote PC1
                                            pcIndex++;
                                            forEachProjectFolder();
                                        } else if (pcIndex > 0 && pcIndex !== remotePClist.length - 1) {
                                            var tempDNum = 0;
                                            for (var i = 0; i < pcIndex; i++) {
                                                tempDNum += parseInt(remotePClist[i].distributeNum);
                                            }
                                            if (tempDNum === proIndex) {//if project folder number equal all forward PCs' distribute number, goto next remote PC
                                                pcIndex++;
                                                forEachProjectFolder();
                                            }
                                        }

                                        forEachFile = function () {
                                            if (fileIndex < projectFiles.length) {
                                                var en = getExtensionName(projectFiles[fileIndex]);
                                                var isfile = file.isFile(seriesPath + "\\" + sProjects[proIndex] + "\\" + projectFiles[fileIndex]);

                                                if (isfile && en !== "str" && en.substring(0, 3) !== "std" && en.substring(0, 3) !== "out" && en.substring(0, 2) !== "zp") {
                                                    var filename = series[seriesIndex] + "\\" + sProjects[proIndex] + '\\' + projectFiles[fileIndex];
                                                    var filedata = file.readallsync(projectPath + "\\Projects\\" + filename);
                                                    settings2.data.filename = projectFiles[fileIndex];
                                                    settings2.data.data = filedata;
                                                    settings2.data.seriesName = series[seriesIndex];
                                                    settings2.data.subProjectName = sProjects[proIndex];
                                                    settings2.data.savePath = series[seriesIndex] + "\\" + sProjects[proIndex];
                                                    try {
                                                        $.ajax(settings2).done(function (response) {//upload each file under each sub folder
                                                            if (response.data == 1) {
                                                                alert('instanceid is missing.');
                                                                return;
                                                            } else if (response.data == 2) {
                                                                alert('filename is missing.');
                                                                return;
                                                            } else if (proIndex !== selectSeries.subProjectNumber) {//except file, only project folder number
                                                                fileIndex++;
                                                                forEachFile();
                                                            }
                                                        });
                                                    } catch (e) {
                                                        alert(e);
                                                        return false;
                                                    }
                                                } else {
                                                    fileIndex++;
                                                    forEachFile();
                                                }
                                            } else {
                                                var settings3 = {
                                                    "url": "http://" + remotePClist[pcIndex].ip + ":3000/api/instances/" + instanceid + "/initstatus",
                                                    "data": {"seriesName": series[seriesIndex], "subProjectName": sProjects[proIndex], "ip": remotePClist[pcIndex].ip},
                                                    "dataType": "json",
                                                    "method": "PUT"
                                                };
                                                $.ajax(settings3).done(function (response) {
                                                    if (response) {
                                                        fileIndex = 0;
                                                        proIndex++;
                                                        forEachProjectFolder();
                                                    }
                                                });
                                            }
                                        };
                                        forEachFile();
                                    } else {
                                        alert("upload finished.");
                                        $("#loading").hide();
                                        //$("#uploadProjectWindow").modal('toggle');
                                    }
                                };
                                forEachProjectFolder();
                            };
                            forEachSeriesFolder();
                        },
                        operate = function (seriesObj) { //type: start, stop
                            var networkObject = $rootScope.networkObject;
                            try {
                                var instanceID = getInstanceID(),
                                        remotePClist = networkObject.remotePClist,
                                        pcIndex = 0;
                                if (!instanceID)
                                    return;
                                /*var appName = '';
                                var mainFileType = 'sol';
                                var fileList = [];
                                if ($rootScope.simucenter.CSuprem.isCurrentApp) {
                                    appName = 'csuprem';
                                    mainFileType = 'in';
                                } else if ($rootScope.simucenter.Apsys.isCurrentApp) {
                                    appName = 'apsys';
                                } else if ($rootScope.simucenter.Pics3d.isCurrentApp) {
                                    appName = 'pics3d';
                                }*/

                                //获取根目录文件列表
                                var rootPath = $rootScope.simucenter.currentProduct().projectPath;
                                //var files = file.readfoldersync(rootPath);
                                var runList = []; //每个子项目自己的运行列表，比如是需要哪几个exe文件来执行文件
                                //循环匹配文件格式是否等于fileType，是则添加到fileList
                                /*angular.forEach(files, function (f) {
                                    var a = f.split(".");
                                    if (file.isFile(rootPath + '\\' + f) && a[a.length - 1] === mainFileType)
                                        fileList.push(f);
                                });*/                                

                                if(networkObject.processList[0].isCsuprem && networkObject.processList[0].inFile!=='')  //csuprem.exe
                                    runList.push({appName:'csuprem',fileName:networkObject.processList[0].inFile});
                                if(networkObject.processList[3].isApsys && networkObject.processList[3].solFile!=='')   //apsys.exe
                                    runList.push({appName:'apsys',fileName:networkObject.processList[3].solFile});
                                if(networkObject.processList[4].isPics3d && networkObject.processList[3].solFile!=='')  //pics3d.exe
                                    runList.push({appName:'pics3d',fileName:networkObject.processList[3].solFile});
                                if(networkObject.processList[3].isApsys){
                                    if(networkObject.processList[1].isLayer && networkObject.processList[1].layerFile!=='')
                                        runList.push({appName:'apsys_layer',fileName:networkObject.processList[1].layerFile});
                                    if(networkObject.processList[2].isGeo && networkObject.processList[2].georFile!=='')
                                        runList.push({appName:'apsys_geo',fileName:networkObject.processList[1].georFile});
                                    if(networkObject.processList[5].isPlt && networkObject.processList[5].pltFile!==''){
                                        runList.push({appName:'apsys',fileName:networkObject.processList[5].pltFile});
                                        runList.push({appName:'apsys_plt',fileName:networkObject.processList[6].junkgFile});
                                    }
                                }else if(networkObject.processList[4].isPics3d){
                                    if(networkObject.processList[1].isLayer && networkObject.processList[1].layerFile!=='')
                                        runList.push({appName:'pics3d_layer',fileName:networkObject.processList[1].layerFile});
                                    if(networkObject.processList[2].isGeo && networkObject.processList[2].georFile!=='')
                                        runList.push({appName:'pics3d_geo',fileName:networkObject.processList[1].georFile});
                                    if(networkObject.processList[5].isPlt && networkObject.processList[5].pltFile!==''){
                                        runList.push({appName:'pics3d',fileName:networkObject.processList[5].pltFile});
                                        runList.push({appName:'pics3d_plt',fileName:networkObject.processList[6].junkgFile});
                                    }
                                }
               
                                var callRemoteRun = function(){
                                    var settings = { //要循环pc，再循环子项目
                                        //remotePClist[pcIndex].distributeNum，这个是每个PC上分配几个子项目数
                                        "url": "http://" + remotePClist[pcIndex].ip + ":3000/api/instances/" + instanceID,
                                        "data": {"seriesName": seriesObj.seriesFolderName, "subProjectName": "0001", "cmd": "start", /*"appName": appName, "fileName": fileList[0],*/
                                            "runList": runList, "subFolders": remotePClist[pcIndex].subFolders},
                                        "dataType": "json",
                                        "method": "PUT"
                                    };
                                    $.ajax(settings).done(function (response) {
                                        if (response.data === 6) {
                                            if(pcIndex < remotePClist.length){
                                                pcIndex++;
                                                callRemoteRun();
                                            }else{
                                                alert('remote computing all finish!');
                                            }                                                
                                        }
                                    });
                                };
                                callRemoteRun();
                            } catch (e) {
                                alert(e);
                                return;
                            }
                        },
                        ping = function () {
                            var pcList = $rootScope.networkObject.remotePClist,
                                    pIndex = 0;
                            callapi = function () {
                                if (pIndex === pcList.length)
                                    return;
                                var settings = {
                                    "url": "http://" + pcList[pIndex].ip + ":3000/api/ping",
                                    "method": "GET"
                                };
                                $.ajax(settings).done(function (response) {
                                    if (response.data) {
                                        $rootScope.networkObject.remotePClist[pIndex].connectInfo = JSON.stringify(response.data);
                                        $("#fixNoRefresh").click();
                                        pIndex++;
                                        callapi();
                                    }
                                });
                            };
                            callapi();
                        };


                factory.createNetworkObject = function () {
                    return new networkObject();
                };

                return factory;
            }]);