'use strict';

angular
        .module('object.rightclickmenu', [])
        .factory('rightclickmenu', ['$rootScope', 'file', function ($rootScope, file) {
                var factory = {},
                        rightClickMenuObject = function () {
                            this.menuList = [];
                            this.show = showMenu;
                            this.hide = hideMenu;
                            this.cleanMenuList = cleanMenuList;
                            this.createMenuList = createMenuList;
                        },
                        showMenu = function (pannelobj, x, y) {
                            if ((this.menuList.length * 30 + y) > document.documentElement.clientHeight) {
                                pannelobj.css("top", (y - (this.menuList.length * 30) - 10) + "px");
                            } else {
                                pannelobj.css("top", (y - 10) + "px");
                            }
                            pannelobj.css("left", x + "px");
                            pannelobj.show();
                        },
                        hideMenu = function () {
                            $("#rightclickmenu").hide();
                        },
                        cleanMenuList = function () {
                            this.menuList = [];
                        },
                        getMenu = function (menuid) {
                            var menuobj = {},
                                    menus = angular.fromJson(file.readallsync("json\\rightclick.json"));
                            for (var i = 0; i < menus.length; i++) {
                                if (menuid === menus[i].number) {
                                    menuobj = menus[i];
                                    break;
                                }
                            }
                            return menuobj;
                        },
                        createMenuList = function (type, fileName, filePath, treeType) {
                            var pannelNumber = [1, 2, 3, 4], //Edit, Rename, Delete, Property                                
                                    rightmenu = this;
                            if (type === 'folder') {                                
                                if (fileName === "Input Files" || fileName === "Output Files"){
                                    pannelNumber = [25, 26]; //Add files, Add folder  
                                }else if(fileName !== "Series Files"){
                                    var regex = new RegExp('_', 'g'),
                                        result = fileName.match(regex),
                                        count = !result ? 0 : result.length;
                                    if(count >= 4){//like: init_wavel_1_1.3_11142016_692881
                                        pannelNumber = [41, 42, 43]; //Simulate, Open folder, Delete
                                    }else if(fileName.length === 4 && !isNaN(fileName)){
                                        pannelNumber = [41, 42, 43]; //Simulate, Open folder, Delete
                                    }else{
                                        pannelNumber = [25, 43]; //Add files, Delete
                                    }
                                }
                            } else if (type === 'file') {
                                var fn = fileName.split("."),
                                        ex = fn[fn.length - 1];
                                if (ex.indexOf("_") !== -1)
                                    ex = ex.substr(0, 3);
                                switch (ex) {
                                    case 'in':
                                        pannelNumber = [1, 5, 2, 3, 4]; //Edit, Simulate, Rename, Delete, Property
                                        break;
                                    case 'str':
                                        pannelNumber = [10, 1, 2, 3, 4]; //Open with CrosslightView, Edit, Rename, Delete, Property
                                        break;
                                    case 'std':
                                        pannelNumber = [10, 1, 2, 3, 4];
                                        break;
                                    case 'plt':
                                        if (!$rootScope.simucenter.CSuprem.isCurrentApp)
                                            pannelNumber = [1, 6, 7, 2, 3, 4]; //Edit, Setup.plt, View result, Rename, Delete, Property
                                        break;
                                    case 'sol':
                                        if (!$rootScope.simucenter.CSuprem.isCurrentApp)
                                            pannelNumber = [1, 11, 8, 9, 5, 2, 3, 4]; //Edit, Edit by SolverManager, Layer3d, Setup by command, Simulate, Rename, Delete, Property
                                        break;
                                    case 'ps':
                                        pannelNumber = [12, 1, 2, 3, 4]; //Open with GhostView, Edit, Rename, Delete, Property
                                        break;
                                    case 'mater':
                                        pannelNumber = [1, 13, 2, 3, 4]; //Edit, Generate .gain and plot, Rename, Delete, Property
                                        break;
                                    case 'geo':
                                        pannelNumber = [1, 14, 15, 16, 2, 3, 4]; //Edit, Open with GeoEditor, Generate mesh, Generate all, Rename, Delete, Property
                                        break;
                                    case 'msh':
                                        pannelNumber = [18, 1, 2, 3, 4]; //View mesh, Edit, Rename, Delete, Property
                                        break;
                                    case 'gain':
                                        pannelNumber = [1, 17, 9, 2, 3, 4]; //Edit, Gain preview, Setup by command, Rename, Delete, Property
                                        break;
                                    case 'mplt':
                                        pannelNumber = [1, 18, 2, 3, 4]; //Edit, View mesh, Rename, Delete, Property
                                        break;
                                    case 'bat':
                                        pannelNumber = [19, 1, 2, 3, 4]; //Run, Edit, Rename, Delete, Property
                                        break;
                                    case 'layer':
                                        //Edit/ Setup layer by command/ Open with Layerbuilder/ Process this .layer file to generate .geo/ Process all .layer files to generate .geo/ Rename, Delete, Property
                                        pannelNumber = [1, 20, 21, 22, 23, 2, 3, 4];
                                        break;
                                    case 'gnu':
                                        pannelNumber = [24, 1, 2, 3, 4]; //Plot, Edit, Rename, Delete, Property
                                        break;
                                }
                            } else if (type === 'editor') {
                                if (fileName === 0) {//Csuprem editor rightclick menu
                                    //["Cut", "Copy", "Paste", "Check", "User Defined Value", "Series", "Wizard", "Mater Define", "Comment out", "Remove comments"];
                                    pannelNumber = [27, 28, 29, 30, 31, 32, 33, 34, 35, 36];
                                } else {//Apsys editor rightclick menu
                                    //["Cut", "Copy", "Paste", "Check", "Series", "Wizard", "Help", "Comment out", "Remove comments"];
                                    pannelNumber = [27, 28, 29, 30, 32, 33, 37, 35, 36];
                                }
                            } else if (type === 'message') {
                                if (fileName === 0) {//runtime & simulation
                                    pannelNumber = [38, 39, 40]; //copy,clear,save
                                }
                            }

                            rightmenu.cleanMenuList();
                            angular.forEach(pannelNumber, function (pnum) {
                                var menuobj = getMenu(pnum);
                                rightmenu.menuList.push({"id": pnum, "name": menuobj.name, "fileName": fileName, "filePath": filePath, "useable":menuobj.useable, "treeType":treeType});
                            });
                        };

                factory.createRightClickMenuObject = function () {
                    return new rightClickMenuObject();
                };

                return factory;
            }]);