
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
                appListingComponent.writeArticlesHTMLPost(response, $webSqlPostStore);
            },
            error      : function() {
                tellaw_core.error("error");
            }
        });

    },

    writeArticlesHTMLPost: function ( jsonresponse, $webSqlPostStore ) {

        // Update DB
        appListingComponent.updateLocalDbForList( jsonresponse , $webSqlPostStore);

        // Refesh homepage
        $webSqlPostStore.findHomePosts();

    },

    /**
     * Functions used to manage local storage
     */
    updateLocalDbForList : function ( jsonresponse , $webSqlPostStore ) {

        jQuery.each(jsonresponse.posts, function() {
            $webSqlPostStore.ifArticleNotUpToDateInDbWriteIt( this.id, this );
        });

    }

}