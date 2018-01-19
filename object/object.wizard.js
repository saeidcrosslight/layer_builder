'use strict';

angular
        .module('object.wizard', [])
        .factory('wizard', ['file', '$rootScope', function (file, $rootScope) {
                var factory = {},
                        wizardObject = function () {
                            this.getCsupremWizard = getCsupremWizard;
                            this.getApsysWizard = getApsysWizard;
                            this.wizardSort = wizardSort;
                            this.getApsysHelpFileUrl = getApsysHelpFileUrl;
                            this.getApsysWizardProperties = getApsysWizardProperties;
                            this.setApsysWizardHelp = setApsysWizardHelp;
                            this.getJSONSort = getJSONSort;
                        },
                        getJSONdata = function (path) {
                            return angular.fromJson(file.readallsync(path));
                        },
                        getJSONSort = function (order, sortBy) {
                            var ordAlpah = (order === 'asc') ? '>' : '<';
                            var sortFun = new Function('a', 'b', 'return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1');
                            return sortFun;
                        },
                        addDiyDom = function (treeId, treeNode) {
                            var aObj = $("#" + treeNode.tId + "_a");
                            if (treeNode.level !== 2) {
                                var editStr = "<input type='checkbox' class='checkboxBtn' id='checkbox_" + treeNode.id + "' onfocus='this.blur();'></input>";
                                aObj.before(editStr);
                                var btn = $("#checkbox_" + treeNode.id);
                                if (btn)
                                    btn.bind("change", function () {
                                        checkAccessories(treeNode, btn);
                                    });
                            } else if (treeNode.level === 2) {
                                var editStr = "<input type='radio' class='radioBtn' id='radio_" + treeNode.id + "' name='radio_" + treeNode.getParentNode().id + "' onfocus='this.blur();'></input>";
                                aObj.before(editStr);
                                var btn = $("#radio_" + treeNode.id);
                                if (btn)
                                    btn.bind("click", function () {
                                        checkBrand(treeNode, btn);
                                    });
                            }
                        },
                        checkAccessories = function (treeNode, btn) {

                        },
                        checkBrand = function (treeNode, btn) {

                        },
                        createWizardTreeData = function (objbox, obj, value, fontColor, isroot) {
                            if (isroot)
                                obj.name = value.name;
                            else
                                obj.name = value.name + "(" + value.type + ")";
                            obj.realname = value.name;
                            obj.type = value.type;
                            obj.font = {'color': fontColor};
                            objbox.push(obj);
                        },
                        getFont = function (treeId, node) {
                            return node.font ? node.font : {};
                        },
                        wizardSort = function (obj) {
                            obj.sort(getJSONSort("asc", "name"));
                        },
                        getCsupremWizard = function (scope, zNodes) {
                            var setting = {
                                view: {
                                    fontCss: getFont,
                                    showIcon: false,
                                    addDiyDom: addDiyDom
                                },
                                callback: {
                                    onClick: onClick
                                }
                            };
                            var card = getJSONdata("json\\suprem.key.json");
                            angular.forEach(card.cards, function (pvalue, pindex) {
                                var pobj = {};
                                pobj.children = [];
                                createWizardTreeData(zNodes, pobj, pvalue, 'red', true);
                                angular.forEach(pvalue.properties, function (svalue, sindex) {
                                    var sobj = {};
                                    createWizardTreeData(pobj.children, sobj, svalue, 'blue', false);
                                    if (svalue.type === "switch") {
                                        sobj.children = [];
                                        angular.forEach(svalue.properties, function (tvalue, tindex) {
                                            var tobj = {};
                                            createWizardTreeData(sobj.children, tobj, tvalue, 'blue', false);
                                        });
                                    }
                                });
                            });
                            function onClick(event, treeId, treeNode, clickFlag) {
                                scope.$apply(function () {
                                    scope.property = {"Value": null, "Choices": []};
                                    if (treeNode.options) {
                                        var opt = (treeNode.options).split("|");
                                        angular.forEach(opt, function (value, index) {
                                            if (index === 0)
                                                scope.property.Value = value;
                                            scope.property.Choices[index] = {"Id": index + 1, "Value": value, "Name": value};
                                        });
                                    }

                                    var nodeobj = treeNode.getParentNode();
                                    if (!nodeobj)
                                        nodeobj = treeNode;
                                    if (nodeobj.type === "switch")
                                        nodeobj = nodeobj.getParentNode();
                                    var helpPath = $rootScope.simucenter.CSuprem.appPath + "/Doc/csuprem_ref/" + nodeobj.realname + ".htm";
                                    if (file.existsfile(helpPath))
                                        $rootScope.simucenter.CSuprem.helpPath = $rootScope.simucenter.CSuprem.appPath + "/Doc/csuprem_ref/" + nodeobj.realname + ".htm";
                                    else
                                        $rootScope.simucenter.CSuprem.helpPath = $rootScope.simucenter.CSuprem.appPath + "/Doc/csuprem_ref/csuprem_ref.html";
                                });
                            }
                            return {"setting": setting, "zNodes": zNodes};
                        },
                        getApsysWizard = function () {
                            var apsysWizardList = [];
                            angular.forEach(getJSONdata("json\\crosslight.tab.json").cards, function (value) {
                                apsysWizardList.push({"name": value.name});
                            });
                            return apsysWizardList;
                        },
                        getApsysHelpFileUrl = function (product, keyword) {
                            var helpHTMLJsons = [],
                                helpIndexFile = file.readallsync(product.appPath + '\\GUI\\HTML\\general\\manual.html').split("\n");
                            angular.forEach(helpIndexFile, function (lineContent) {
                                if (lineContent.substr(0, 6) === 'href=\"') { //get keywords and url from manual.html
                                    var index1 = lineContent.indexOf('\"'),
                                        index2 = lineContent.indexOf('#'),
                                        index3 = lineContent.indexOf('\>'),
                                        index4 = lineContent.indexOf('\<');
                                    helpHTMLJsons.push({url: lineContent.substring(index1+1, index2), name: lineContent.substring(index3+1, index4)});
                                }
                            });                            

                            var helpUrl = "manual.html";
                            angular.forEach(helpHTMLJsons, function (value) {
                                if (value.name === keyword)
                                    helpUrl = value.url;
                            });
                            return helpUrl;
                        },
                        getApsysWizardProperties = function (product, keyword) {
                            document.getElementById("keywordName_" + product.productName).value = keyword;
                            document.getElementById("keywordName_" + product.productName).title = keyword;
                            var wlist = [];
                            angular.forEach(getJSONdata("json\\crosslight.tab.json").cards, function (value) {
                                if (keyword === value.name) {
                                    angular.forEach(value.properties, function (propt) {
                                        var optionlist = [];
                                        angular.forEach(propt.options.split("|"), function (opt, index) {
                                            if (index >= 0)
                                                optionlist.push({"value": opt});
                                        });
                                        wlist.push({"name": propt.name, "default": propt.default, "options": optionlist});
                                    });
                                }
                            });
                            return wlist;
                        },
                        setApsysWizardHelp = function (product, keyword) {
                            if(product.appPath === ''){
                                alert('The path of Apsys cannot be empty, please set it in "Settings" first.');
                                return;
                            }
                            product.helpPath = product.appPath + "/GUI/HTML/general/" + getApsysHelpFileUrl(product, keyword);
                            product.wizardPropertyList.splice(0, product.wizardPropertyList.length);
                            product.wizardPropertyList = getApsysWizardProperties(product, keyword);
                        };

                factory.createWizardObject = function () {
                    return new wizardObject();
                };

                return factory;
            }]);