angular.module('app', ['ngSanitize']);
var db = window.openDatabase("newsAppDb", "1.0", "Application DB", 1000000);

/**
 * Routing & Controllers for Angular
 */
var newsAppServices = angular.module('NewsAPP', []);

// Set up our mappings between URLs, templates, and controllers
function newsAppRouteConfig($routeProvider) { $routeProvider.
    when('/', {
        controller: DataController,
        templateUrl: 'partial-index.html'
    }).
    // Notice that for the detail view, we specify a parameterized URL component
    // by placing a colon in front of the id
    when('/view/:id', {
        controller: DetailController,
        templateUrl: 'detail.html'
    }).
    otherwise({
        redirectTo: '/'
    });
}
// Set up our route so the AMail service can find it
newsAppServices.config(newsAppRouteConfig);

function DataController($scope) {
    console.log ("<< ==== Start of DataController ==== >>");
    tellaw_news_home.populateArticles();

    $scope.post = {
        content: []
    };
    console.log ("<< ==== End of DataController ==== >>");
}

function DetailController($scope, $routeParams) {
    console.log ("<< ==== Start of DetailController ==== >>");
    $scope.contentId = $routeParams.id;

    // Load article from DB
    getArticle( $routeParams.id );

    // If content part is empty, load the full article
    $scope.post = {
        content:[]
    };
    console.log ("<< ==== End of DetailController ==== >>");
}

var tellaw_new_detail = {

    getArticleDetail : function () {
        
    },

    isArticlecomplete : function () {

    }



}

var tellaw_news_home = {

    populateArticles: function() {

        console.log ("--> tellaw_news_home.populate()");

        $.ajax({
            type       : "POST",
            url        : 'http://www.tellaw.org?json=1',
            //url        : 'default.json',
            crossDomain: true,
            dataType   : 'json',
            success    : function(response) {
                console.log(response);
                tellaw_news_home.writeArticlesHTMLPost(response);
            },
            error      : function() {
                console.error("error");
            }
        });

        console.log ("End of JSON request");

    },

    writeArticlesHTMLPost: function ( jsonresponse ) {

        console.log ("--> tellaw_news_home.writeHTMLPost()");

        var scope = angular.element($("#postSlots")).scope();
        scope.$apply(function(){
            scope.content = jsonresponse;
        })

        tellaw_news_home.updateLocalDbForList( jsonresponse );

        console.log ("Update is done...");

    },

    initApplication: function() {

        // Open the database of the application
        console.log ("--> tellaw_news_home.initApplication()");

        db.transaction( function (tx) {
            //tx.executeSql('DROP TABLE IF EXISTS POSTS');
            tx.executeSql('CREATE TABLE IF NOT EXISTS POSTS (id unique, data)');
        }, errorCB, successCB);
        //tx.executeSql('DROP TABLE IF EXISTS DEMO');

        console.log (db);

    }

    /**
     * Functions used to manage local storage
     */
    function updateLocalDbForList ( jsonresponse ) {

    jQuery.each(jsonresponse.posts, function() {

        if ( !isArticleInDb( this.id ) ) {

            // Article is not in local storage, insert
            console.log( this );
            writeArticle ( this.id, this );

        }

        console.log ( "ID is : " + this.id );
    });


}

function errorCB(err) {
    console.error("Error processing SQL: ");
    console.error (err);
}

function successCB() {
    //console.log("success in DB creation!");
}

/**
 * Shared functions used for all pages
 */

function isArticleInDb ( $articleId ) {
    var $sql = "SELECT * FROM POSTS WHERE id="+$articleId;
    var $value = db.transaction( function (tx) {
        return tx.executeSql ( $sql, [], isArticleInDbQuerySuccess, errorCB );
    }, errorCB);
    return $value;
}

function isArticleInDbQuerySuccess(tx, results) {
    // this will be true since it was a select statement and so rowsAffected was 0
    if (results.rows.length==0) {
        return false;
    }
    return true;
}

function writeArticle ( $articleid, $jsonArticle ) {
    var $sql = 'INSERT INTO POSTS (id, data) VALUES (?,?)';
    console.log ($sql);
    db.transaction( function (tx) {
        return tx.executeSql( $sql, [$articleid,JSON.stringify($jsonArticle)] );
    } , errorCB);

    console.log ("article has been written");
}

function getArticle ( $articleId ) {
    var $sql = "SELECT * FROM POSTS WHERE id="+$articleId;
    console.log ("///**** Get Article ****//////");
    console.log ($sql);
    db.transaction( function (tx) {
        return tx.executeSql ( $sql, [], getArticleInDbQuerySuccess, errorCB );
    }, errorCB);
    console.log ("///**** END OF Get Article ****//////");
}

// Callback for getArticle
function getArticleInDbQuerySuccess(tx, results) {
    var scope = angular.element($("#slotDetail")).scope();
    scope.$apply(function(){
        //console.log( JSON.parse( results.rows.item(0).data) );
        scope.post.content = JSON.parse( results.rows.item(0).data);
    })
}