'use strict';

angular
        .module('object.autotcad', [])
        .factory('autotcad', ['file', '$rootScope', function (file, $rootScope) {
                var factory = {},
                        autotcadObject = function () {
                            this.seriesObject = {
                                index: 0,
                                seriesName: "",
                                seriesTitle: "",
                                seriesProjectPath: 'Please Edit Series first...',
                                date: "",
                                variables: [],
                                variableTitles: [{variableName: "variable", lineNumber: "0"}, {variableName: "variable", lineNumber: "0"}, {variableName: "variable", lineNumber: "0"}],
                                seriesCsuprem: "NA", //.in file
                                seriesCsupremList: ["NA"], //.in files list
                                seriesApsys: "NA", //.sol file
                                seriesApsysList: ["NA"], //.sol files list
                                seriesLayer: "NA", //.layer file
                                seriesLayerList: ["NA"], //.layer files list
                                seriesGeo: "NA", //.geo file
                                seriesGeoList: ["NA"], //.geo files list
                                seriesPlt: "NA", //.plt file
                                seriesPltList: ["NA"], //.plt files list
                                paraExtract: "", //.txt file
                                paraExtractList: ["NA"], //.txt files list
                                softwareTitles: [{softwareName: "Csuprem", rolspan: 1, display: true}, {softwareName: "Apsys", rolspan: 1, display: true}, {softwareName: "Pics3d", rolspan: 1, display: true}],
                                seriesDisplayList: [],
                                isCsupremSeries: false, //if has .in file, use csuprem.exe to run
                                isApsysSeries: false, //if has .sol file, use apsys.exe(or pics3d.exe) to run
                                isLayerSeries: false     //if has .geo file, use geometry.exe to run
                            };
                            this.seriesEachVariable = []; //store every series
                            this.seriesList = [];
                            this.addNewNodes = [];
                            this.familyPlotList = [];       //saving datas for junkg.tmp
                            /** format of familyPlotList:
                             * [
                             *      { xlabel: '', ylabel: '', plotFiles: [] }
                             * ]
                             */
                            this.familyPlot = '';           //
                            this.familyPlotOptionList = []; //for select options
                            //this.seriesPlot = '';
                            //this.seriesPlotOptionList = [];
                            this.isSeriesLoad = false;
                            this.isSeriesRun = false;
                            this.isforcedStop = false;
                            this.showPannel = showPannel;
                            this.forEachStepNumber = forEachStepNumber;
                            this.createSeriesRunList = createSeriesRunList;
                            this.getNewFolderName = getNewFolderName;
                            this.createFamilyPlotList = createFamilyPlotList;
                            this.createSeriesPlotList = createSeriesPlotList;
                            this.getNewNumbers = getNewNumbers;
                        },
                        getExtensionName = function (fileName) {
                            var fn = fileName.split(".");
                            return fn[fn.length - 1];
                        },
                        forEachStepNumber = function (stepNumArray, series, seriesPath, fileType) {
                            var slength = stepNumArray.length;
                            if (slength === 0)
                                return false;

                            var stateNum = [],
                                    isComplete = false,
                                    folderName = 0,
                                    stepNumObj = [],
                                    seriesNumbers = "";
                            for (var i = 0; i < slength; i++) {
                                stateNum.push(0);// initialize all the stateNum
                                var tempObj = {};
                                tempObj.groupID = stepNumArray[i].groupID;
                                tempObj.stepnum = stepNumArray[i].stepNumber;
                                tempObj.sn = stateNum[i];
                                stepNumObj.push(tempObj);// initialize the stepNumObj
                            }

                            $rootScope.simucenter.autoTCAD.seriesEachVariable.splice(0, $rootScope.simucenter.autoTCAD.seriesEachVariable.length);
                            while (!isComplete) {
                                seriesNumbers += createSeriesFiles(series, seriesPath, folderName, stepNumObj, fileType);
                                folderName++;
                                isComplete = !changeStepNumObj(slength - 1, stateNum, stepNumObj, stepNumArray, slength); //change the stepNumObj with new sn
                            }
                            file.writeallsync(seriesPath + "\\series.dat", seriesNumbers);
                            return true;
                        },
                        createSeriesRunList = function (variableCols, variableList) {//variableList = autoTCAD.seriesEachVariable
                            this.seriesObject.isCsupremSeries = false;
                            this.seriesObject.isApsysSeries = false;
                            this.seriesObject.isLayerSeries = true;
                            this.seriesObject.variableTitles = [];
                            this.seriesObject.seriesDisplayList = [];
                            this.seriesObject.softwareTitles = [{softwareName: "Csuprem", colspan: 0, display: false}, {softwareName: "Apsys", colspan: 0, display: false}, {softwareName: "Pics3d", colspan: 0, display: false}];

                            for (var i = 0; i < variableCols; i++) {//check if csuprem.exe and apsys.exe is in use
                                var swCode = checkProgram(variableList[i].fileName);

                                if (swCode === 1) {//.in
                                    this.seriesObject.isCsupremSeries = true;
                                    this.seriesObject.softwareTitles[0].colspan++;
                                    this.seriesObject.softwareTitles[0].display = true;
                                } else if (swCode === 2) {
                                    this.seriesObject.isApsysSeries = true;
                                    this.seriesObject.softwareTitles[1].colspan++;
                                    this.seriesObject.softwareTitles[1].display = true;
                                } else if (swCode === 6) {
                                    this.seriesObject.isApsysSeries = true;
                                    this.seriesObject.softwareTitles[2].colspan++;
                                    this.seriesObject.softwareTitles[2].display = true;
                                } else { //swCode === -1
                                    //alert("Cannot identify the file in the series!");
                                    //return; //stop creating series if the filename is not in the lib of checkProgram();
                                }
                            }

                            if (this.seriesObject.isCsupremSeries && this.seriesObject.isApsysSeries) { //push obj in order. csuprem project push first, apsys project push later
                                for (var i = 0; i < variableList.length; i = i + variableCols) {
                                    var obj = {};
                                    obj.nodeIndex = variableList[i].nodeIndex;
                                    obj.folderPath = variableList[i].folderPath;
                                    obj.type = "original";
                                    obj.seriesStd = "";
                                    obj.seriesStdList = [];
                                    obj.seriesPs = "";
                                    obj.seriesPsList = [];
                                    obj.paraExtract = "";
                                    obj.paraExtractList = "";
                                    obj.variable = [];
                                    for (var j = 0; j < variableCols; j++) {
                                        var temp = {};
                                        swCode = checkProgram(variableList[i + j].fileName);
                                        if (swCode === 1) {
                                            temp.variableName = variableList[i + j].variableName;
                                            temp.variableValue = variableList[i + j].variableValue;
                                            temp.fileName = variableList[i + j].fileName;
                                            temp.lineNumber = variableList[i + j].lineNumber;
                                            temp.vPosition = variableList[i + j].vPosition;
                                            temp.class = "csupremSeriesClass";
                                            obj.variable.push(temp);
                                        }
                                    }
                                    for (var j = 0; j < variableCols; j++) {
                                        var temp = {};
                                        swCode = checkProgram(variableList[i + j].fileName);
                                        if (swCode > 1) {
                                            temp.variableName = variableList[i + j].variableName;
                                            temp.variableValue = variableList[i + j].variableValue;
                                            temp.fileName = variableList[i + j].fileName;
                                            temp.lineNumber = variableList[i + j].lineNumber;
                                            temp.vPosition = variableList[i + j].vPosition;
                                            temp.class = "apsysSeriesClass";
                                            obj.variable.push(temp);
                                        }
                                    }
                                    this.seriesObject.seriesDisplayList.push(obj);
                                }
                            } else {
                                for (var i = 0; i < variableList.length; i = i + variableCols) {
                                    var obj = {};
                                    obj.nodeIndex = variableList[i].nodeIndex;
                                    obj.folderPath = variableList[i].folderPath;
                                    obj.type = "original";
                                    obj.seriesStd = "";
                                    obj.seriesStdList = [];
                                    obj.seriesPs = "";
                                    obj.seriesPsList = [];
                                    obj.paraExtract = "";
                                    obj.paraExtractList = "";
                                    obj.variable = [];
                                    for (var j = 0; j < variableCols; j++) {
                                        var temp = {};
                                        temp.variableName = variableList[i + j].variableName;
                                        temp.variableValue = variableList[i + j].variableValue;
                                        temp.fileName = variableList[i + j].fileName;
                                        temp.lineNumber = variableList[i + j].lineNumber;
                                        temp.vPosition = variableList[i + j].vPosition;
                                        temp.class = "csupremSeriesClass";
                                        if (this.seriesObject.isApsysSeries)
                                            temp.class = "apsysSeriesClass";
                                        obj.variable.push(temp);
                                    }
                                    this.seriesObject.seriesDisplayList.push(obj);
                                }
                            }

                            for (var i = 0; i < variableCols; i++) {
                                var obj = {};
                                obj.variableName = this.seriesObject.seriesDisplayList[0].variable[i].variableName;
                                obj.lineNumber = this.seriesObject.seriesDisplayList[0].variable[i].lineNumber;
                                this.seriesObject.variableTitles.push(obj);
                            }

                            //////////////////////////////////////////
                            //for the table display, merge cell with same value
                            /////////////////////////////////////////                   
                            for (var j = 0; j < variableCols; j++) {
                                this.seriesObject.seriesDisplayList[0].variable[j].rowspan = 1;
                                this.seriesObject.seriesDisplayList[0].variable[j].display = true;
                            }

                            for (var j = 0; j < variableCols; j++) {
                                var rowNum = 0;
                                for (var i = 1; i < this.seriesObject.seriesDisplayList.length; i++) {
                                    if (this.seriesObject.seriesDisplayList[i].variable[j].variableValue === this.seriesObject.seriesDisplayList[i - 1].variable[j].variableValue) {
                                        this.seriesObject.seriesDisplayList[i].variable[j].rowspan = 1;
                                        //this.seriesDisplayList[i].variable[j].colspan = 1;
                                        this.seriesObject.seriesDisplayList[i].variable[j].display = false;
                                        this.seriesObject.seriesDisplayList[rowNum].variable[j].rowspan += 1;
                                    } else {
                                        rowNum = i;
                                        this.seriesObject.seriesDisplayList[rowNum].variable[j].rowspan = 1;
                                        //this.seriesDisplayList[rowNum].variable[j].colspan = 1;
                                        this.seriesObject.seriesDisplayList[rowNum].variable[j].display = true;
                                    }
                                }
                            }
                        },
                        changeStepNumObj = function (index, stateNum, stepNumObj, stepNumArray, slength) {
                            if (index < 0)
                                return false;

                            stateNum[index]++;
                            if (stateNum[index] < stepNumArray[index].stepNumber) {
                                for (var i = slength - 1; i >= index; i--) {
                                    stepNumObj[i].sn = stateNum[i];
                                }
                                return true;
                            } else {
                                stateNum[index] = 0;
                                index = index - 1;
                                return changeStepNumObj(index, stateNum, stepNumObj, stepNumArray, slength);
                            }
                        },
                        createSeriesFiles = function (series, seriesPath, foldernum, stepNumObjs, fileType) {
                            var projectPath = series[0].projectPath,
                                    foldername = getNewFolderName(foldernum),
                                    seriesNumbers = "";
                            file.mkdirsync(seriesPath + '\\' + foldername);

                            angular.forEach(file.readfoldersync(projectPath), function (files) {//read project file, get file list
                                if (files.split(".").length === 2) {//exclude folder
                                    var newFilePath = seriesPath + '\\' + foldername + "\\" + files;
                                    var str = file.readallsync(projectPath + "\\" + files);
                                    var fileContent = str;
                                    var isCurrentFile = false;
                                    angular.forEach(series, function (sobj, sindex) {
                                        var tempObj = {};
                                        tempObj.nodeIndex = foldername;
                                        tempObj.folderPath = seriesPath + '\\' + foldername;
                                        tempObj.fileName = sobj.fileName;
                                        tempObj.lineNumber = sobj.lineNumber;
                                        tempObj.variableName = sobj.variableName;
                                        tempObj.vPosition = sobj.vPosition;
                                        tempObj.variableValue = "NA";

                                        if (files === sobj.fileName) {//this is the file that need to modify
                                            isCurrentFile = true;
                                            var sNindex = 0;
                                            for (var i = 0; i < stepNumObjs.length; i++) {//get the modify number
                                                if (stepNumObjs[i].stepnum == sobj.stepNumber && sobj.groupID == stepNumObjs[i].groupID) {//groupID='2' or groupID=2 is the same
                                                    sNindex = stepNumObjs[i].sn;
                                                    break;
                                                }
                                            }
                                            str = angular.fromJson($rootScope.simucenter.validator.fileToJSON(projectPath + "\\" + files, '', getExtensionName(files)));

                                            var tempfileContent = str;
                                            tempfileContent.push({keyword: '', lineNumber: str.length, lineType: 'data', property: []});//this is to fix last line missing, create a blank line manually.
                                            if (sindex > 0) {//if this filename is same with last series factory
                                                for (var i = sindex - 1; i > -1; i--) {
                                                    if (sobj.fileName === series[i].fileName) {
                                                        tempfileContent = fileContent;//the content that last time already modified
                                                        break;
                                                    }
                                                }
                                            }

                                            angular.forEach(tempfileContent, function (linedata, index) {
                                                if (sobj.lineNumber === linedata.lineNumber) {
                                                    angular.forEach(tempfileContent[index].property, function (pro, pindex) {
                                                        if (sobj.variableName === pro.name) {
                                                            if (sobj.vPosition === -1 && tempfileContent[index].property[pindex].value.length === 1) {//for one value
                                                                var newNumber = Number(getNewNumbers(sobj)[sNindex]).toExponential();
                                                                seriesNumbers = seriesNumbers + ', '+tempfileContent[index].property[pindex].name+'='+newNumber + "\r\n";
                                                                tempfileContent[index].property[pindex].value[0] = newNumber;
                                                                tempObj.variableValue = newNumber; //number to scientific notation
                                                            } else {//for more than one values
                                                                angular.forEach(tempfileContent[index].property[pindex].value, function (dvalue, vindex) {
                                                                    var newNumber = Number(getNewNumbers(sobj)[sNindex]).toExponential();
                                                                    seriesNumbers = seriesNumbers + ', '+tempfileContent[index].property[pindex].name+'='+newNumber + "\r\n";
                                                                    if (sobj.vPosition === vindex)
                                                                        tempfileContent[index].property[pindex].value[sobj.vPosition] = newNumber;
                                                                    tempObj.variableValue = newNumber;
                                                                });
                                                            }
                                                            $rootScope.simucenter.autoTCAD.seriesEachVariable.push(tempObj);//for creating series run list
                                                        }
                                                    });
                                                }
                                            });
                                            fileContent = tempfileContent;
                                        } else {
                                            isCurrentFile = false;
                                        }
                                    });
                                    for (var i = 0; i < fileType.length; i++) {//write file content to local folder
                                        if (files.split(".")[1] === fileType[i] || files.split(".")[1].substr(0, fileType[i].length) === fileType[i] || isCurrentFile) {
                                            if (!file.existsfile(newFilePath)) {
                                                var newContent = fileContent;//if this file no modify, so this is the original file
                                                if (typeof fileContent === "object") {//if the content is transformed to JSON file to modify
                                                    newContent = $rootScope.simucenter.validator.jsonToFile('', fileContent);
                                                    newContent = newContent.substring(0, newContent.length - 1); //delete last blank line(manually created)
                                                }
                                                file.writeallsync(newFilePath, newContent);
                                                break;
                                            }
                                        }
                                    }
                                } else if (files === "CSupremLayerMater") {
                                    if (!file.existsfile(seriesPath + '\\' + foldername + "\\CSupremLayerMater"))
                                        file.mkdirsync(seriesPath + '\\' + foldername + "\\CSupremLayerMater");
                                    angular.forEach(file.readfoldersync(projectPath + "\\CSupremLayerMater"), function (cfile) {
                                        var str = file.readallsync(projectPath + "\\CSupremLayerMater" + "\\" + cfile);
                                        var newFilePath = seriesPath + '\\' + foldername + "\\CSupremLayerMater\\" + cfile;
                                        file.writeallsync(newFilePath, str);
                                    });
                                }
                            });
                            return seriesNumbers;
                        },
                        getNewFolderName = function (num) {
                            var foldername = "";
                            if ((num + 1) < 10)
                                foldername = "000" + (num + 1).toString();
                            if ((num + 1) > 9 && (num + 1) < 100)
                                foldername = "00" + (num + 1).toString();
                            if ((num + 1) > 99 && (num + 1) < 1000)
                                foldername = "0" + (num + 1).toString();
                            return foldername;
                        },
                        checkProgram = function (fileName) {
                            var softwareCode = -1; //nothing
                            if (fileName.split(".")[1] === "in") {
                                softwareCode = 1; //1: Csuprem
                            } else if (fileName.split(".")[1] === "sol") {
                                if ($rootScope.simucenter.currentProduct().productName === 'Apsys' || $rootScope.simucenter.currentProduct().productName === 'CSuprem') {
                                    softwareCode = 2; //2: Apsys
                                } else if ($rootScope.simucenter.currentProduct().productName === 'Pics3d') {
                                    softwareCode = 6; //6: Pics3d
                                }
                            } else if (fileName.split(".")[1] === "layer") {
                                softwareCode = 3;//3: layer.exe in Apsys
                            } else if (fileName.split(".")[1] === "plt") {
                                softwareCode = 4;//4: different plt files ....
                            } else if (fileName.split(".")[1] === "geo") {
                                softwareCode = 5;//4: geo.exe in Apsys;
                            }
                            /*cannot identify the filename*/
                            return softwareCode;
                        },
                        getNewNumbers = function (seriesObj) { //to calculate new number
                            var newNum = [];
                            if (seriesObj.isUniform) {
                                var initialV = Number(seriesObj.initialValue);
                                var finalV = Number(seriesObj.finalValue);
                                var averageNum = (finalV - initialV) / (seriesObj.stepNumber - 1);
                                newNum[0] = initialV;
                                newNum[seriesObj.stepNumber - 1] = finalV;
                                for (var nn = 1; nn < seriesObj.stepNumber - 1; nn++) {
                                    newNum[nn] = averageNum * (nn) + initialV;// it has error here : 0.1+0.2=0.30000000000000004 , this is JS error
                                    if (String(newNum[nn]).length > 5)
                                        newNum[nn] = parseFloat(newNum[nn].toFixed(2));
                                }

                                if (seriesObj.isLog) {//if select 'log' checkbox
                                    angular.forEach(newNum, function (value, index) {
                                        newNum[index] = Math.pow(10, value).toFixed(4);
                                    });
                                }
                            } else {//if choose 'selected', read selected list
                                newNum = seriesObj.selectedValues;
                            }
                            return newNum;
                        },
                        showPannel = function () {
                            if ($("#autotcadPanel").parent()[0].style.display === 'none') {
                                $("body").layout("expand", "east");//show wizard pannel
                            } else {
                                $("body").layout("collapse", "east");//hide wizard pannel
                            }
                        },
                        createFamilyPlotList = function () {
                            /*  1. foreach every sub folder
                             *  2. if has junkg.tmp file, if no alert: 'no junkg.tmp file'
                             *  3. if has it, start to analysis it
                             *  3.1 if first keyword is 'reset', then to start a picture
                             *  3.2 if first keyword is 'plot', then get fileName from double quotation marks.
                             *      and record end if it has '\', if yes, record isPlot, it means plot does not finish. if no it means this picture is finish.
                             *  3.3 the file that is got the fileName before, judge its content if two column, if yes add it to array
                             */
                            var path = require('path');
                            var seriesPath = this.seriesObject.seriesprojectPath;
                            var familyPlotOptionList = this.familyPlotOptionList;
                            var subFolders = file.readfoldersync(seriesPath);
                            var tempList = [];
                            for(var sindex=0; sindex<subFolders.length; sindex++){
                                if (subFolders[sindex].indexOf('.') === -1) { //only folder, not file
                                    var junkgFilePath = path.join(seriesPath, subFolders[sindex], 'junkg.tmp');
                                    if (file.existsfile(junkgFilePath)) {
                                        var junkgFileContent = file.readallsync(junkgFilePath).split('\r\n');
                                        var startDraw = false;
                                        var isPlot = false;
                                        var onePicture = {xlabel: '', ylabel: '', plotFiles: []};
                                        for (var jindex = 0; jindex < junkgFileContent.length; jindex++) {
                                            var lineContent = junkgFileContent[jindex].trim();
                                            if (lineContent.substring(0, 5) === 'reset') {
                                                onePicture = {xlabel: '', ylabel: '', plotFiles: []}; //clean and init
                                                startDraw = true;
                                                continue;
                                            } else if (lineContent.substring(0, 10) === 'set xlabel' && startDraw) {
                                                onePicture.xlabel = lineContent.substring(lineContent.indexOf('"') + 1, lineContent.lastIndexOf('"'));                                                
                                            } else if (lineContent.substring(0, 10) === 'set ylabel' && startDraw) {
                                                onePicture.ylabel = lineContent.substring(lineContent.indexOf('"') + 1, lineContent.lastIndexOf('"'));
                                            } else if (lineContent.substring(0, 4) === 'plot' && startDraw) {
                                                onePicture.plotFiles.push(lineContent.substring(lineContent.indexOf('"') + 1, lineContent.lastIndexOf('"')));
                                                if(lineContent.substr(lineContent.length - 1) === '\\'){                                                    
                                                    isPlot = true;
                                                }else{ //one picture is finish
                                                    angular.forEach(onePicture.plotFiles,function(junkgFile){
                                                        var junkgFileContent = file.readallsync(path.join(seriesPath, subFolders[sindex], junkgFile)).split('\r\n');
                                                        var tempValues = junkgFileContent[0].trim().replace(/\s+/g, ' ').split(' ');
                                                        if(tempValues.length == 2 && $.inArray('"' + onePicture.ylabel + '"  VS  "' + onePicture.xlabel + '"', familyPlotOptionList) === -1){ //if only two values
                                                            familyPlotOptionList.push('"' + onePicture.ylabel + '"  VS  "' + onePicture.xlabel + '"');
                                                            tempList.push(onePicture);                                                            
                                                        }
                                                    });                                                    
                                                    isPlot = false;
                                                    startDraw = false;
                                                }
                                            } else if (startDraw && isPlot){
                                                onePicture.plotFiles.push(lineContent.substring(lineContent.indexOf('"') + 1, lineContent.lastIndexOf('"')));
                                                if(lineContent.substr(lineContent.length - 1) !== '\\'){
                                                    angular.forEach(onePicture.plotFiles,function(junkgFile){
                                                        var junkgFileContent = file.readallsync(path.join(seriesPath, subFolders[sindex], junkgFile)).split('\r\n');
                                                        var tempValues = junkgFileContent[0].trim().replace(/\s+/g, ' ').split(' ');
                                                        if(tempValues.length == 2 && $.inArray('"' + onePicture.ylabel + '"  VS  "' + onePicture.xlabel + '"', familyPlotOptionList) === -1){ //if only two values
                                                            familyPlotOptionList.push('"' + onePicture.ylabel + '"  VS  "' + onePicture.xlabel + '"');
                                                            tempList.push(onePicture);
                                                        }
                                                    });
                                                    isPlot = false;
                                                    startDraw = false;
                                                }
                                            }
                                        }
                                    } else {
                                        alert('No junkg.tmp file, please Process .plt first.');
                                        return false;
                                    }
                                }
                            }
                            this.familyPlotList = tempList;
                            
                        },
                        createSeriesPlotList = function(){
                            
                        };

                factory.createAutoTcadObject = function () {
                    return new autotcadObject();
                };

                return factory;
            }]);