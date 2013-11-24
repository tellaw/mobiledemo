console.log ("Controllers file loaded");

angular.element(document).ready(function() {
    console.log ("Angular now ready");
});

// Modules declarations

// Store creation
var $webSqlPostStore = new WebSqlPostStore();
var $localStorageStore = new LocalStorageStore();
var $synchroManager = new SynchroManager();

// Events Declarations
function initAngularEvents ( $section ){

    //$scope.$on( "DETAIL_ARTICLE_NOT_LOADED_EVENT", $webSqlPostStore.loadDetailArticle );

}

function initAngularApplication () {

    //angular.module('NewsAPP', ['ngRoute','ngSanitize']);

    newsApp = angular.module('NewsAPP', ['ngRoute','ngSanitize']).
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
                when(   '/configuration/', {
                    controller: 'configurationController',
                    templateUrl: 'partials/configuration.html'
                }).
                otherwise({redirectTo: '/'});
        }]);

    // Controller declarations
    newsApp.controller ('homeController', ['$scope', function($scope) {

        console.log ("<< ==== Start of DataController ==== >>");

        initAngularEvents( "home" );

        appListingComponent.populateArticles( $webSqlPostStore );
        $webSqlPostStore.updateNotUpToDateArticles();

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

    newsApp.controller ('configurationController', ['$scope', '$routeParams', function($scope, $routeParams) {


        console.log ("<< ==== Start of ConfigurationController ==== >>");

        console.log ("<< ==== End of ConfigurationController ==== >>");

    }]);

    angular.bootstrap(document, ['NewsAPP']);


}

//$scope.$on( "DETAIL_ARTICLE_NOT_LOADED_EVENT", $webSqlPostStore.loadDetailArticle() );


