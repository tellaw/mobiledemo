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
    tellaw_core.log ("<< ==== Start of DataController ==== >>");
    tellaw_news_home.populateArticles();

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

        var scope = angular.element($("#postSlots")).scope();
        scope.$apply(function(){
            scope.content = jsonresponse;
        })

        tellaw_news_home.updateLocalDbForList( jsonresponse );

    },

    initApplication: function() {

        db.transaction( function (tx) {
            tx.executeSql('DROP TABLE IF EXISTS POSTS');
            tx.executeSql('CREATE TABLE IF NOT EXISTS POSTS (id Varchar default NULL, data Text)');
        }, errorCreationDB, successCreationDB);

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

function errorCreationDB(err) {
    tellaw_core.error("[ERROR CREATION DB] - Error processing SQL request ");
}
function errorCB(err) {
    tellaw_core.error("1 - Error processing SQL: ");
    tellaw_core.error (err);
}

function errorCB2(err) {
    tellaw_core.error("2 - Error processing SQL: ");
    tellaw_core.error (err);
}

function errorCB3(err) {
    tellaw_core.error("3 - Error processing SQL: ");
    tellaw_core.error (err);
}


function successCreationDB() {
    tellaw_core.log("success in DB creation!");
}
function successCB() {
    //tellaw_core.log("success in DB creation!");
}

/**
 * Shared functions used for all pages
 */

function isArticleInDb ( $articleId ) {
    var $sql = "SELECT * FROM POSTS WHERE id="+$articleId;
    tellaw_core.log ($sql);
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
    var $sql = 'INSERT INTO POSTS (id, data) VALUES ('+$articleid+',?)';
    tellaw_core.log ($sql);
    db.transaction( function (tx) {
        return tx.executeSql( $sql, [JSON.stringify( $jsonArticle )] );
    } , errorCB2);
}

function getArticle ( $articleId ) {
    var $sql = "SELECT * FROM POSTS WHERE id="+$articleId;
    tellaw_core.log ($sql);
    db.transaction( function (tx) {
        return tx.executeSql ( $sql, [], getArticleInDbQuerySuccess, errorCB );
    }, errorCB3);
}

// Callback for getArticle
function getArticleInDbQuerySuccess(tx, results) {
    var scope = angular.element($("#slotDetail")).scope();
    scope.$apply(function(){
        scope.post.content = JSON.parse( results.rows.item(0).data);
    })
}