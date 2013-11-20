console.log ("Controllers file loaded");
angular.module('app', ['ngSanitize']);

// Modules declarations
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

// Store creation
var $webSqlPostStore = new WebSqlPostStore();
var $localStorageStore = new LocalStorageStore();
var $synchroManager = new SynchroManager();

// Events Declarations
function initAngularEvents ( $section ){

    $scope = getAngularScope();
    //$scope.$on( "DETAIL_ARTICLE_NOT_LOADED_EVENT", $webSqlPostStore.loadDetailArticle );

}

//$scope.$on( "DETAIL_ARTICLE_NOT_LOADED_EVENT", $webSqlPostStore.loadDetailArticle() );


// Controller declarations
newsApp.controller ('homeController', ['$scope', function($scope) {

    console.log ("<< ==== Start of DataController ==== >>");

    initAngularEvents( "home" );

    appListingComponent.download();
    appListingComponent.populateArticles( $webSqlPostStore );
    appDetailComponent.updateArticles();
    
    $scope.name = "home";
    $scope.post = {
        content: $webSqlPostStore.findHomePosts()
    };
    
    console.log ("<< ==== End of DataController ==== >>");

}]);

newsApp.controller ('detailController', ['$scope', '$routeParams', function($scope, $routeParams) {

    initAngularEvents( "detail" );

    console.log ("<< ==== Start of DetailController ==== >>");
    $scope.contentId = $routeParams.id;

    $scope.name = "detail";

    // If content part is empty, load the full article
    $scope.post = {
        content:[]
    };

    // Load article from DB
    //var $webSqlPostStore = new WebSqlPostStore();
    $webSqlPostStore.getArticle( $routeParams.id, $scope );

    console.log ("<< ==== End of DetailController ==== >>");

}]);
