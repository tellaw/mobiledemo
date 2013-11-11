var appDetailComponent = {

    populateArticle: function( $id , $url ) {

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
                appDetailComponent.writeArticleHTMLPost($id, response, $webSqlPostStore);
            },
            error      : function() {
                tellaw_core.error("error");
            }
        });

    },

    writeArticleHTMLPost: function ($id, jsonresponse, $webSqlPostStore ) {

        // Update DB
    	$webSqlPostStore.ifArticleNotUpToDateInDbWriteIt( $id, jsonresponse.post, 1 );

        // Refesh homepage
        //$webSqlPostStore.findHomePosts();

    	// Tell Synchro tool to update next
    	$synchroManager.$_processing = false;
    	
    },

    updateArticles : function () {
    	$webSqlPostStore.updateNotUpToDateArticles();
    },

    updateArticle : function () {

    }

}