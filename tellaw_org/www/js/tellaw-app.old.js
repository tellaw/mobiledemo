angular.module('app', ['ngSanitize']);
//var db = window.openDatabase("newsAppDb", "1.0", "Application DB", 1000000);

/**
 * Routing & Controllers for Angular
 */
var newsAppServices = angular.module('NewsAPP', []);

// Set up our mappings between URLs, templates, and controllers
function newsAppRouteConfig($routeProvider) { $routeProvider.
    when('/', {
        controller: DataController,
        templateUrl: 'partials/partial-index.html'
    }).
    // Notice that for the detail view, we specify a parameterized URL component
    // by placing a colon in front of the id
    when('/view/:id', {
        controller: DetailController,
        templateUrl: 'partials/detail.html'
    }).
    otherwise({
        redirectTo: '/'
    });
}
// Set up our route so the AMail service can find it
newsAppServices.config(newsAppRouteConfig);

function DataController($scope) {
    tellaw_core.log ("<< ==== Start of DataController ==== >>");
    //tellaw_news_home.populateArticles();

    $scope.name = "home";

    $scope.post = {
        content: []
    };

    tellaw_core.log ("<< ==== End of DataController ==== >>");
}


function DetailController($scope, $routeParams) {
    tellaw_core.log ("<< ==== Start of DetailController ==== >>");
    $scope.contentId = $routeParams.id;

    // Load article from DB
    getArticle( $routeParams.id );

    $scope.name = "detail";

    // If content part is empty, load the full article
    $scope.post = {
        content:[]
    };
    tellaw_core.log ("<< ==== End of DetailController ==== >>");
}

var tellaw_new_detail = {

    getArticleDetail : function () {
        
    },

    isArticlecomplete : function () {

    }



}

var tellaw_core = {

    log : function( $str ) {
        console.log( $str );
    },

    error : function( $str ) {
        console.error( $str );
    }

}

var tellaw_news_home = {


    populateArticles: function() {

        // Load datas from database


        // Load ajax
        $.ajax({
            type       : "POST",
            url        : 'http://www.tellaw.org?json=1',
            //url        : 'default.json',
            crossDomain: true,
            dataType   : 'json',
            success    : function(response) {
                tellaw_core.log(response);
                tellaw_news_home.writeArticlesHTMLPost(response);
            },
            error      : function() {
                tellaw_core.error("error");
            }
        });

    },

    writeArticlesHTMLPost: function ( jsonresponse ) {
        console.log (jsonresponse);
        var scope = angular.element($("#postSlots")).scope();
        scope.$apply(function(){
            scope.content = jsonresponse;
        })

        tellaw_news_home.updateLocalDbForList( jsonresponse );

    },

    initApplication: function($scope) {
        //console.log ("initApplication method");
        console.log ($scope.name);
    },

    /**
     * Functions used to manage local storage
     */
     updateLocalDbForList : function ( jsonresponse ) {

        jQuery.each(jsonresponse.posts, function() {

            if ( !isArticleInDb( this.id ) ) {

                // Article is not in local storage, insert
                writeArticle ( this.id, this );

            } else {

                tellaw_core.log( "article is already in database" );

            }

        });

    }

}

/**
 * Shared functions used for all pages
 */


function isArticleInDbQuerySuccess(tx, results) {
    // this will be true since it was a select statement and so rowsAffected was 0
    if (results.rows.length==0) {
        return false;
    }
    return true;
}

