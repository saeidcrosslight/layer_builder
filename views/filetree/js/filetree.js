/**
 * Created by Saeid Sadeh on 11/26/2017.
 */

angular.module('filetree', [])

    .controller('filetreeController', ['$scope', '$rootScope', 'file', function ($scope, $rootScope, file) {
        /*                $scope.openFileInEditor = function (fileName, filePath) {
         var product = $rootScope.product,
         filepath = filePath;
         /!*if(node.type === "sysfile"){
         filepath = product.appPath + "\\" + node.title;
         if (product.appPath === "") {
         product.appPathValidate(product,0);
         return;
         }
         }
         if(node.type === "folder")
         return;*!/
         product.filetree.openFile(product, fileName, filepath);

         };*/

        $scope.treeNodeClick = function (type, fileName, filePath, treeType, event) {
            debugger;
            if (type === "file" || type === "sysfile") {
                //
                $(".filetreestyle span").css("background-color", "#fff");
                $(".filetreestyle span").css("border", "none");
                $(".filetreestyle span").css("color", "#333");
                $(".filetreestyle i").css("color", "#333");
/*                this.$handleElement[0].children[0].style.background = "#328efe";
                this.$handleElement[0].children[0].style.border = "1px solid #666";
                this.$handleElement[0].children[0].style.padding = "2px";
                this.$handleElement[0].children[0].style.color = "#fff";
                this.$handleElement[0].children[0].children[0].style.color = "#fff";*/
            }
            var e = event ? event : (window.event ? window.event : null);
            if (e.button === 2 && fileName !== "Series Files") {//click mouse right
                $rootScope.product.rightClickMenu.createMenuList(type, fileName, filePath, treeType);
                $rootScope.product.rightClickMenu.show($("#rightclickmenu"), e.clientX, e.clientY);
            } else {
                setTimeout(function () {
                    $rootScope.product.rightClickMenu.hide();
                }, 150);
            }
        };

        /*                $scope.showSeriesFile = function (left) {
         var product = $rootScope.simucenter.currentProduct();
         if (product.projectPath !== "") {
         if (!product.isSeriesRun) {
         var seriesPath = product.projectPath + "\\Projects";
         if (file.existsfile(seriesPath)) {
         var files = file.readfoldersync(seriesPath);
         product.filetree.creatSeriesFileTree(files, product.filetree.seriesfiles[0], seriesPath);
         }
         product.isSeriesRun = true;
         }
         }
         $("#seriesPanel").animate({'left': left}, 200, function () {
         });
         if(left === '2px')
         product.isSeriesShow = true;
         else if(left === '-270px')
         product.isSeriesShow = false;
         };*/

    }])

    .directive('filetree', function() {
        return {
            restrict: "E",
            templateUrl: "./views/filetree/page/filetree.html"
        };
    });


