angular.module('app', ['ngSanitize']);

var tellaw_dao = {

    populate: function() {

        console.log ("Sending JSON request");

        $.ajax({
            type       : "POST",
            url        : 'http://www.tellaw.org?json=1',
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

    }

}

function DataController($scope) {
    $scope.post = {
        content: [

        ]
    };
}

function updateLocalDb ( jsonresponse ) {

    jQuery.each(jsonresponse.posts, function() {

        if ( !isArticleInDb( this.id ) ) {

            // Article is not in local storage, insert

        }

        console.log ( "ID is : " + this.id );
    });

}

function isArticleInDb ( $articleId ) {

}

function writeArticle ( $jsonArticle, $articleid ) {

}

function getArticle ( $articleId ) {

}

function getArticlesForHome () {



}