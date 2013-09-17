angular.module('app', ['ngSanitize']);


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

        var scope = angular.element($("#postSlots")).scope();
        scope.$apply(function(){
            scope.content = jsonresponse;
        })

        updateLocalDb( jsonresponse );

        console.log ("Json get Success");

    },

    initApplication: function() {

        // Open the database of the application
        console.log ("Opening databse");
        var db = window.openDatabase("newsAppDb", "1.0", "Application DB", 1000000);

        db.transaction(populateDB, errorCB, successCB);
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

function populateDB(tx) {
    tx.executeSql('DROP TABLE IF EXISTS DEMO');
    tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
    tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "First row")');
    tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")');
}

function errorCB(err) {
    alert("Error processing SQL: "+err.code);
}

function successCB() {
    alert("success!");
}



function isArticleInDb ( $articleId ) {

    return false;

}

function writeArticle ( $jsonArticle, $articleid ) {

}

function getArticle ( $articleId ) {

}

function getArticlesForHome () {



}