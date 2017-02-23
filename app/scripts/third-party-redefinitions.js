//AngularBootstrap - Allow clickeable elements inside tabs

angular.module("uib/template/tabs/tab.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/tabs/tab.html",
    "<li ng-class=\"[{active: active, disabled: disabled}, classes]\" class=\"uib-tab nav-item\">\n" +
    "  <div href ng-click=\"select($event)\" class=\"nav-link\" uib-tab-heading-transclude>{{heading}}</div>\n" +
    "</li>\n" +
    "");
}]);