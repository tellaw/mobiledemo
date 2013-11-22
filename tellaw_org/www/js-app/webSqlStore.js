console.log ("WebSQLStore file loaded");

var WebSqlPostStore = function(successCallback, errorCallback) {

    this.initializeDatabase = function(successCallback, errorCallback) {
        var self = this;
        this.db = window.openDatabase("newsAppDb", "1.0", "News APP DB", 200000);
        this.db.transaction(
            function(tx) {
                self.createTable(tx);
                self.addSampleData(tx);
            },
            function(error) {
                console.log('Transaction error: ' + error);
                if (errorCallback) errorCallback();
            },
            function() {
                console.log('Transaction success');
                if (successCallback) successCallback();
            }
        )
    };

    this.reset = function (tx) {
        this.db.transaction(
            function(tx) {
                tx.executeSql('DROP TABLE IF EXISTS posts');
                tx.executeSql('DROP TABLE IF EXISTS posts_categories');
                tx.executeSql('DROP TABLE IF EXISTS categories');
            },
            function(error) {
                console.log('Transaction error: ' + error);
            },
            function() {
                $webSqlPostStore.initializeDatabase();
                console.log('Transaction success');
            }
        )
    };

    this.createTable = function(tx) {

        console.log ("Creating table for POSTS");
/*
        tx.executeSql('DROP TABLE IF EXISTS posts');
        tx.executeSql('DROP TABLE IF EXISTS posts_categories');
        tx.executeSql('DROP TABLE IF EXISTS categories');
*/
        var sql = "CREATE TABLE IF NOT EXISTS posts ( " +
            "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "externalId VARCHAR(50), " +
            "title VARCHAR(50), " +
            "url VARCHAR(255), " +
            "categories VARCHAR(255), " +
            //"data Text," +
            "updated DateTime," +
            "created DateTime," +
            "listingmode VARCHAR(2)" +
            " );";

        tx.executeSql(sql, null,
            function() {
                console.log('Create table POST success');
            },
            function(tx, error) {
                alert('Create table error: ' + error.message);
            });

    };

    this.addSampleData = function(tx) {
        /* Insert here the sample loading */
    };

    this.findHomePosts = function ( $scope ) {
        this.db.transaction(

            function(tx) {

                console.log ("homePostsStarted");
                var sql =   "SELECT * FROM posts ORDER BY id DESC";

                tx.executeSql(sql, [], function(tx, results) {

                    console.log ("homePostsLoaded");

                    var $dataJson = { "posts" : {} };
                    var $loop=0;
                    //this.updateHomeModel (results.rows.length > 0 ? results.rows.item(0) : null);
                    angular.forEach ( results.rows , function ( value, key ) {

                        $postHeaders = results.rows.item($loop++);
                        console.log ("article readen from DB : "+ $postHeaders.externalId+" : mode : "+$postHeaders.listingmode);
                        $postJson = $localStorageStore.getArticle( $postHeaders.externalId );

                        if ( $postJson != "" ) {
                            $postJson = JSON.parse( $postJson );
                            //console.log ($postJson);
                            $dataJson.posts[$postHeaders.id] = $postJson;
                        }

                    } );

                    //console.log ($dataJson);

                    var $scope = getAngularScope();
                    //console.log (angular.element($("#postSlots")).scope());
                    $scope.$apply(function(){
                        $scope.content = $dataJson;
                    })

                });

            },
            function(error) {
                alert("Transaction Error: " + error.message);
            }
        );


    };

    /**
     * $detailMode = 0 for listing page content | 1 for detail page content
     */
    this.ifArticleNotUpToDateInDbWriteIt = function ( $articleId, $json, $detailMode ) {

    	if ( !$detailMode ) {
    		var $sql = "SELECT * FROM POSTS WHERE externalId="+$articleId;
    	} else {
    		var $sql = "SELECT * FROM POSTS WHERE externalId="+$articleId+" AND listingmode='1'";
    	}
        tellaw_core.log ($sql);

        this.db.transaction( function (tx) {
            return tx.executeSql ( $sql, [], function (tx, results) {

                if (results.rows.length) {
                    console.log ("article "+$articleId+" is in DB and maybe up to date");
                } else {
                    console.log ("article "+$articleId+" is NOT in DB or maybe NOT update to date");
                    $webSqlPostStore.writeArticle( $articleId, $json, $detailMode );
                }

            } );
        });

    };

    this.writeArticle = function ( $articleid, $jsonArticle, $detailMode ) {
        
    	if ( !$detailMode ) {
    		var $sql = 'INSERT INTO POSTS (externalId, title, url, categories, created, listingmode) VALUES ("'+$articleid+'", ?, ?, ?, ?, ?)';
    	} else {
    		var $sql = 'UPDATE POSTS SET title=?, url=?, categories=?, created=?, listingmode=? WHERE externalId="'+$articleid+'"';
    	}
        
    	tellaw_core.log ($sql);
        $d = new Date();

        $categories = "";
        angular.forEach ( $jsonArticle.categories , function ( value, key ) {
            console.log ("Adding category");
            $categories += value.slug+"|";
        } );

        tellaw_core.log ("writing article : "+$articleid+ " listingmode : "+$detailMode);
        
        this.db.transaction( function (tx) {
            return tx.executeSql(
                $sql, [ $jsonArticle.title, $jsonArticle.url , $categories, $d.getTime(), $detailMode ],
                null,
                function(tx, error) {
                    console.log('Error inserting : ');
                    console.log (error);
                }
            );
        } );
        tellaw_core.log ("Adding to local storage.");
        $localStorageStore.setArticle($articleid, JSON.stringify($jsonArticle));
        
        if ( !$detailMode ) {
        	$webSqlPostStore.findHomePosts();
        }
        
    };

    this.updateNotUpToDateArticles = function () {

        var $sql = "SELECT * FROM POSTS WHERE listingmode='0.0'";
        tellaw_core.log ($sql);
        
        this.db.transaction( function (tx) {
	        tx.executeSql($sql, [], function(tx, results) {
	
	        	tellaw_core.log ("Articles needing update : "+ results.rows.length);

                var $loop=0;
	            angular.forEach ( results.rows , function ( value, key ) {

                    console.log ("Article for update : "+key);

	                $postHeaders = results.rows.item($loop++);
	                //appDetailComponent.populateArticle( $postHeaders.url );
	                tellaw_core.log ("Updating article......... " + $postHeaders.externalId);
	                $item = new QueueItem( $postHeaders.externalId, $postHeaders.url );
	                $synchroManager.addToQueue($item);
	            } );
	
	
	        });
        });

    }

    this.getArticle = function ( $articleId, $scope ) {

        var $sql = "SELECT * FROM POSTS WHERE externalId="+$articleId;
        tellaw_core.log ($sql);
        this.db.transaction( function (tx) {
            return tx.executeSql ( $sql, [],

                function getArticleInDbQuerySuccess(tx, results) {
                    //var scope = getAngularScope();
                    $scope.$apply(function(){
                    	
                    	$postHeaders = results.rows.item(0);
                    	$json = JSON.parse( $localStorageStore.getArticle( $postHeaders.externalId ) );
                    	
                    	console.log ( $postHeaders );
                    	console.log ( $json );
                    	
                        $scope.post.content = $json;
                    })
                }

            );
        });

    };
    
    this.initializeDatabase(successCallback, errorCallback);

}
