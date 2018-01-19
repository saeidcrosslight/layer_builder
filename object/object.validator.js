'use strict';

angular
        .module('object.validator', [])
        .factory('validator', ['file', function (file) {
                String.prototype.trim = function () {
                    var r = /\s+/g;
                    return this.replace(/(^\s*)|(\s*$)/g, '').replace(r, ' ');
                };
                String.prototype.replaceAll = function (reallyDo, replaceWith, ignoreCase) {
                    if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
                        return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi" : "g")), replaceWith);
                    } else {
                        return this.replace(reallyDo, replaceWith);
                    }
                };
                var factory = {},
                        plength = 0,
                        validatorObject = function () {
                            this.error = {result: true, content: []};
                            this.checkSupremGrammar = checkSupremGrammar;
                            this.checkCrosslightGrammar = checkCrosslightGrammar;
                            this.fileToJSON = fileToJSON;
                            this.jsonToFile = jsonToFile;
                            this.trimAll = trimAll;
                        },
                        trimAll = function (str) {
                            return str.trim().replaceAll(" = ", '=').replaceAll("= ", '=').replaceAll(" =", '=').replaceAll(",", '').replace("( ", '(').replace(" )", ')').replace("[ ", '[').replace(" ]", ']');
                        },
                        getLastTwoWords = function (line) {
                            return line.substring(line.length - 2, line.length);
                        },
                        /**
                         * Get property length from crosslight.tab
                         */
                        getProPertyLength = function (kyname, proName, fileFormat) {
                            var plength = 0;
                            if (fileFormat !== "in") {
                                var tabFile = angular.fromJson(file.readallsync("json\\crosslight.tab.json")).cards;
                                angular.forEach(tabFile, function (card) {
                                    if (card.name === kyname) {
                                        angular.forEach(card.properties, function (pro) {
                                            if (pro.name === proName) {
                                                var len = pro.default.split(",").length;
                                                if (len > 1)
                                                    plength = len;
                                            }
                                        });
                                    }
                                });
                            }
                            return plength;
                        },
                        /**
                         * Description:   Read properties of each line, than push them into jsonData factory
                         * @param        kyname - keyword name
                         *               jsonData - json data factory
                         *               lineData - each line data
                         *               proty - properties of each line
                         *               index - property's index of each line
                         *               fileFormat - file format
                         * Author:        Alice (xuling@crosslight.com.cn / xuling5300@163.com)
                         * Last Modify:   2015-12-28                 
                         */
                        readProperty = function (kyname, jsonData, lineData, proty, index, fileFormat) {
                            var wd = proty.split("=");
                            if (wd[0] !== "&&") {
                                if (wd.length === 2) {//include =
                                    if (wd[1][0] === "(" || wd[1][0] === "[") {//
                                        var values = [wd[1].substring(1)];
                                        lineData.property.push({"name": wd[0], "value": values});
                                    } else {
                                        lineData.property.push({"name": wd[0], "value": [wd[1]]});
                                    }
                                    plength = getProPertyLength(kyname, wd[0], fileFormat);
                                } else {
                                    var lastProValueLen = 0;
                                    for (var item in lineData.property[lineData.property.length - 1]) {
                                        if (item === "value" && fileFormat !== "in")
                                            lastProValueLen = lineData.property[lineData.property.length - 1].value.length;
                                    }

                                    if (lastProValueLen !== plength) {//
                                        if (proty.substring(proty.length - 1) === ")" || proty.substring(proty.length - 1) === "]") {
                                            if (index === 0) {//first data like '9999.000000)', it is belong last line last property data value
                                                jsonData[jsonData.length - 1].property[jsonData[jsonData.length - 1].property.length - 1].value.push(proty.substring(0, proty.length - 1));
                                            } else {
                                                lineData.property[lineData.property.length - 1].value.push(proty.substring(0, proty.length - 1));
                                            }
                                        } else {
                                            lineData.property[lineData.property.length - 1].value.push(proty);
                                        }
                                    } else {
                                        lineData.property.push({"name": proty});
                                    }
                                }
                            }
                        },
                        /**
                         * Convert property json data to string
                         */
                        getPropertyString = function (keyword, jsonline) {
                            var str = keyword;
                            angular.forEach(jsonline.property, function (property) {
                                if (property.value) {
                                    if (property.value.length === 1) {
                                        str += " " + property.name + "=" + property.value;
                                    } else {
                                        str += " " + property.name + "=(";
                                        angular.forEach(property.value, function (val, index) {
                                            if (index === 0)
                                                str += val;
                                            else
                                                str += " " + val;
                                        });
                                        str += ")";
                                    }
                                } else {
                                    str += " " + property.name;
                                }
                            });
                            if (jsonline.endsign)
                                str += " &&";
                            return str;
                        },
                        checkSupremGrammar = function (jsonObject) {
                            return this.error;
                        },
                        checkCrosslightGrammar = function (jsonObject) {
                            return this.error;
                        },
                        fileToJSON = function (filePath, fileContent, fileFormat) {
                            var fcontent = fileContent;
                            var fileFormat = fileFormat;
                            if (filePath !== "")
                                fcontent = (file.readallsync(filePath)).split("\n");

                            var jsonData = [];
                            angular.forEach(fcontent, function (line, index) {
                                var lineData = {};
                                lineData.lineNumber = index + 1;
                                if (line === " " || line.length === 0) {//blank line                            
                                    lineData.lineType = "blank";
                                } else if (line[0] === "$" || line[0] === "#") {//comment line
                                    lineData.lineType = "comment";
                                    lineData.comment = line;
                                } else {//data line
                                    lineData.property = [];
                                    line = trimAll(line);
                                    var property = line.split(" ");
                                    var lastline = "";
                                    if (index > 0)
                                        lastline = getLastTwoWords(trimAll(fcontent[index - 1]));
                                    if (lastline === "&&") {//propery line
                                        var kyindex = index;
                                        var kyname = "";
                                        var i2 = 1;
                                        for (i2 = 1; i2 < 10; i2++) {
                                            if (kyindex - i2 === 0) {
                                                kyname = trimAll(fcontent[0]).split(" ")[0];
                                                break;
                                            }
                                            if (getLastTwoWords(trimAll(fcontent[kyindex - i2])) !== "&&") {
                                                kyname = trimAll(fcontent[kyindex - i2]).split(" ")[0];
                                                break;
                                            } else {
                                                continue;
                                            }
                                        }

                                        lineData.lineType = "subdata";
                                        angular.forEach(property, function (proty, index) {
                                            readProperty(kyname, jsonData, lineData, proty, index, fileFormat);
                                        });
                                    } else {//real data line
                                        lineData.lineType = "data";
                                        lineData.keyword = property[0];
                                        angular.forEach(property, function (proty, index) {
                                            if (index > 0) {
                                                readProperty(lineData.keyword, jsonData, lineData, proty, index, fileFormat);
                                            }
                                        });
                                    }
                                    if (getLastTwoWords(line) === "&&")
                                        lineData.endsign = "&&";
                                }
                                jsonData.push(lineData);
                            });
                            return angular.toJson(jsonData);
                        },
                        jsonToFile = function (jsonPath, jsonContent) {
                            if (jsonPath !== "")
                                var jcontent = this.getJSONdata(jsonPath);
                            else
                                var jcontent = jsonContent;
                            var lineData = [];
                            angular.forEach(jcontent, function (jsonline) {
                                if (jsonline.lineType === "blank") {
                                    lineData.push("\r\n");
                                } else if (jsonline.lineType === "comment") {
                                    lineData.push(jsonline.comment + "\n"); //here if it is '\r\n', it can cause comment
                                } else if (jsonline.lineType === "data") {
                                    if (jsonline.property.length === 0) {
                                        lineData.push(jsonline.keyword + "\r\n");
                                    } else {
                                        lineData.push(getPropertyString(jsonline.keyword, jsonline) + "\r\n");
                                    }
                                } else if (jsonline.lineType === "subdata") {
                                    lineData.push(getPropertyString(" ", jsonline) + "\r\n");
                                }
                            });
                            lineData.splice(lineData.length - 1, 1);//delete last more blank line
                            return lineData.toString().replaceAll(",", "");
                        };

                factory.createValidatorObject = function () {
                    return new validatorObject();
                };

                return factory;
            }]);