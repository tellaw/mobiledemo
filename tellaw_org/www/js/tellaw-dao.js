angular.module('app', ['ngSanitize']);
var db = window.openDatabase("newsAppDb", "1.0", "Application DB", 1000000);

var tellaw_dao = {

    populate: function() {

        console.log ("Sending JSON request");

        $.ajax({
            type       : "POST",
            //url        : 'http://www.tellaw.org?json=1',
            url        : 'default.json',
            crossDomain: true,
            dataType   : 'json',
            success    : function(response) {
                console.log(response);
                tellaw_dao.writeHTMLPost(response);
            },
            error      : function() {
                console.error("error");
            }
        });

        console.log ("End of JSON request");

    },

    writeHTMLPost: function ( jsonresponse ) {

        //$scope.post.posts.push = jsonresponse;

        console.log ("JSon received, updating");

        var scope = angular.element($("#postSlots")).scope();
        scope.$apply(function(){
            scope.content = jsonresponse;
        })

        updateLocalDb( jsonresponse );

        console.log ("Update is done...");

    },

    initApplication: function() {

        // Open the database of the application
        console.log ("Opening databse");

        db.transaction( function (tx) {
            tx.executeSql('DROP TABLE IF EXISTS POSTS');
            tx.executeSql('CREATE TABLE IF NOT EXISTS POSTS (id unique, data)');
        }, errorCB, successCB);
        //tx.executeSql('DROP TABLE IF EXISTS DEMO');

        console.log (db);

    }

}

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
    $scope.post = {
        content: []
    };
}

function DetailController($scope, $routeParams) {
    $scope.contentId = $routeParams.id;

    $scope.post = {
        content: []
    };

}

/**
 * Functions used to manage local storage
 */
function updateLocalDb ( jsonresponse ) {

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
    console.log("success in DB creation!");
}


function isArticleInDb ( $articleId ) {

    var $sql = "SELECT * FROM POSTS WHERE id="+$articleId;

    console.log ($sql);

    var $value = db.transaction( function (tx) {
        return tx.executeSql ( $sql, [], isArticleInDbQuerySuccess, errorCB );
    }, errorCB);

    return $value;

}
function isArticleInDbQuerySuccess(tx, results) {
    console.log("Returned rows = " + results.rows.length);

    // this will be true since it was a select statement and so rowsAffected was 0
    if (!results.rowsAffected) {
        return false;
    }
    return true;
}



function writeArticle ( $articleid, $jsonArticle ) {

    console.log ( "Writing article..." );
    console.log ("--> JSON --> "+JSON.stringify($jsonArticle));

    var $sql = 'INSERT INTO POSTS (id, data) VALUES (?,?)';
    console.log ($sql);
    db.transaction( function (tx) {
        return tx.executeSql( $sql, [$articleid,JSON.stringify($jsonArticle)] );
    } , errorCB);

    console.log ("article has been written");

}

function addslashes( str ) {
    return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}

function getArticle ( $articleId ) {

}

function getArticlesForHome () {



}
