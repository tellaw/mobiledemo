
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

    download: function() {

        var localFileName = "index.json";
/*
        var fileTransfer = new FileTransfer();
        var uri = encodeURI("http://www.tellaw.org?json=1");

        fileTransfer.download(
            uri,
            localFileName,
            function(entry) {
                console.log("download complete: " + entry.fullPath);
            },
            function(error) {
                console.log("download error source " + error.source);
                console.log("download error target " + error.target);
                console.log("upload error code" + error.code);
            },
            false,
            {
                headers: {
                    "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                }
            }
        );*/
    },

    writeArticlesHTMLPost: function ( jsonresponse, $webSqlPostStore ) {

        // Update DB
        appListingComponent.updateLocalDbForList( jsonresponse , $webSqlPostStore);

        // Refesh homepage
        //$webSqlPostStore.findHomePosts();

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