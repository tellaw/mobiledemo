angular.module('app', ['ngSanitize']);

var newsApp = angular.module('NewsAPP', []).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when(   '/', {
                controller: 'homeController',
                templateUrl: 'partials/partial-index.html'
            }).
            when(   '/view/:id', {
                controller: 'detailController',
                templateUrl: 'partials/detail.html'
            }).
            otherwise({redirectTo: '/phones'});
    }]);

newsApp.controller ('homeController', ['$scope', function($scope) {

    console.log ("<< ==== Start of DataController ==== >>");

    var $webSqlPostStore = new WebSqlPostStore();
alert ($webSqlPostStore.findHomePosts());
    $scope.name = "home";
    $scope.post = {
        content: []
    };

    console.log ("<< ==== End of DataController ==== >>");

}]);

newsApp.controller ('detailController', ['$scope', function($scope) {

    console.log ("<< ==== Start of DetailController ==== >>");
    $scope.contentId = $routeParams.id;

    // Load article from DB
    //getArticle( $routeParams.id );

    $scope.name = "detail";

    // If content part is empty, load the full article
    $scope.post = {
        content:[]
    };
    console.log ("<< ==== End of DetailController ==== >>");

}]);