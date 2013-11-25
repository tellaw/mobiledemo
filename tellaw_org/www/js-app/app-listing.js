
var appListingComponent = {

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