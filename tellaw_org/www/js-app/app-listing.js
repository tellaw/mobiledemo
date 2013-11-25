
var appListingComponent = {

    populateArticles: function( $webSqlPostStore ) {

        // Load ajax
        $.ajax({
            type       : "POST",
            url        : 'http://www.tellaw.org?json=1&count=50',
            //url        : 'default.json',
            crossDomain: true,
            dataType   : 'json',
            success    : function(response) {
                tellaw_core.log(response);
                appListingComponent.updateLocalDbForList( response , $webSqlPostStore);
            },
            error      : function() {
                tellaw_core.error("error");
            }
        });

    },

    populateCategory: function ( $category ) {

        return $webSqlPostStore.findCategoryPosts( $category );

    },

    populateSearch: function ( $keyword ) {

        // Load ajax
        $.ajax({
            type       : "POST",
            url        : 'http://www.tellaw.org/?s='+$keyword+'&json=1&count=50',
            //url        : 'default.json',
            crossDomain: true,
            dataType   : 'json',
            success    : function(response) {

                var $dataJson = { "posts" : {} };
                jQuery.each(response.posts, function() {

                    $webSqlPostStore.ifArticleNotUpToDateInDbWriteIt( this.id, this, 0 );
                    $dataJson.posts[this.id] = this;

                });

                var $scope = getAngularScope();
                //console.log (angular.element($("#postSlots")).scope());
                $scope.$apply(function(){
                    $scope.content = $dataJson;
                })

            },
            error      : function() {
                tellaw_core.error("error");
            }
        });

    },

    /**
     * Functions used to manage local storage
     */
    updateLocalDbForList : function ( jsonresponse , $webSqlPostStore ) {

        jQuery.each(jsonresponse.posts, function() {
            $webSqlPostStore.ifArticleNotUpToDateInDbWriteIt( this.id, this, 0 );
        });

    }

}

function fail(error) {
    console.log(error.code);
}