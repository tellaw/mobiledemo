console.log ("localStorageStore file loaded");

var LocalStorageStore = function(successCallback, errorCallback) {

    this.initializeDatabase = function(successCallback, errorCallback) {
        var self = this;
    }

    this.setArticle = function ( $articleId, $articleJson ) {

        $articleStorageName = this.getArticleStorageName( $articleId );

        tellaw_core.log ("Setting article : "+ $articleStorageName );
        tellaw_core.log ( $articleJson );
        window.localStorage.setItem( $articleStorageName , $articleJson );

    }

    this.getArticle = function ( $articleId ) {
        $articleStorageName = this.getArticleStorageName( $articleId );
        tellaw_core.log ("Getting article : "+$articleStorageName);
        return window.localStorage.getItem( $articleStorageName );
    }

    this.deleteArticle = function ( $articleId ) {
        $articleStorageName = this.getArticleStorageName( $articleId );
        window.localStorage.removeItem( $articleStorageName );
    }

    this.getArticleStorageName = function ( $articleId ) {
        return "article-"+$articleId;
    }

    this.initializeDatabase(successCallback, errorCallback);

}