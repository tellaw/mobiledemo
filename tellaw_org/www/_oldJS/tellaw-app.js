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

// Events Declarations

function initAngularEvents ( $section ){

    $scope = getAngularScope();
    $scope.$on( "DETAIL_ARTICLE_NOT_LOADED_EVENT", $webSqlPostStore.loadDetailArticle );

}

//$scope.$on( "DETAIL_ARTICLE_NOT_LOADED_EVENT", $webSqlPostStore.loadDetailArticle() );


// Controller declarations
newsApp.controller ('homeController', ['$scope', function($scope) {

    console.log ("<< ==== Start of DataController ==== >>");

    initAngularEvents( "home" );

    tellaw_news_home.populateArticles( $webSqlPostStore );

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
    $webSqlPostStore.getArticle( $routeParams.id );

    // validate if article is already stored. Load it if not already stored
    if ( !$webSqlPostStore.isArticleFullyLoaded( $routeParams.id ) ) {

        // Load article

    }

    console.log ("<< ==== End of DetailController ==== >>");

}]);

var tellaw_core = {

    log : function( $str ) {
        console.log( $str );
    },

    error : function( $str ) {
        console.error( $str );
    }

}

// **** Global functions
var tellaw_news_home = {


    populateArticles: function( $webSqlPostStore ) {

        // Load ajax
        $.ajax({
            type       : "POST",
            url        : 'http://www.tellaw.org?json=1',
            //url        : 'default.json',
            crossDomain: true,
            dataType   : 'json',
            success    : function(response) {
                tellaw_core.log(response);
                tellaw_news_home.writeArticlesHTMLPost(response, $webSqlPostStore);
            },
            error      : function() {
                tellaw_core.error("error");
            }
        });

    },

    writeArticlesHTMLPost: function ( jsonresponse, $webSqlPostStore ) {

        // Update DB
        tellaw_news_home.updateLocalDbForList( jsonresponse , $webSqlPostStore);

        // Refesh homepage
        $webSqlPostStore.findHomePosts();

    },

    /**
     * Functions used to manage local storage
     */
    updateLocalDbForList : function ( jsonresponse , $webSqlPostStore ) {

        jQuery.each(jsonresponse.posts, function() {

            $webSqlPostStore.isArticleInDb( this.id )
            $scope = getAngularScope();

            if ( !$scope.isArticleInDb ) {

                // Article is not in local storage, insert

                $scope = getAngularScope();
                console.log ("emit event : DETAIL_ARTICLE_NOT_LOADED_EVENT");
                $scope.$emit ("DETAIL_ARTICLE_NOT_LOADED_EVENT");


                $webSqlPostStore.writeArticle ( this.id, this );
            } else {
                tellaw_core.log( "article is already in database" );
            }
        });

    }

}