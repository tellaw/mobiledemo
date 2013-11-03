var appDetailComponent = {

    populateArticle: function( $url ) {

        console.log ( "loading json for article : "+$url );

        // Load ajax
        $.ajax({
            type       : "POST",
            url        : $url+'?json=1',
            //url        : 'default.json',
            crossDomain: true,
            dataType   : 'json',
            success    : function(response) {
                tellaw_core.log(response);
                appDetailComponent.writeArticleHTMLPost(response, $webSqlPostStore);
            },
            error      : function() {
                tellaw_core.error("error");
            }
        });

    },

    writeArticlesHTMLPost: function ( jsonresponse, $webSqlPostStore ) {

        // Update DB
        //appDetailComponent.updateLocalDbForList( jsonresponse , $webSqlPostStore);

        // Refesh homepage
        //$webSqlPostStore.findHomePosts();

    },

    updateArticles : function () {

    },

    updateArticle : function () {

    }

}