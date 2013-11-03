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

    this.createTable = function(tx) {

        console.log ("Creating table for POSTS");

        //tx.executeSql('DROP TABLE IF EXISTS posts');

        var sql = "CREATE TABLE IF NOT EXISTS posts ( " +
            "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "externalId VARCHAR(50), " +
            "title VARCHAR(50), " +
            "url VARCHAR(255), " +
            //"data Text," +
            "updated DateTime," +
            "created DateTime," +
            "needUpdate boolean" +
            " );";

        tx.executeSql(sql, null,
            function() {
                console.log('Create table success');
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
                    //this.updateHomeModel (results.rows.length > 0 ? results.rows.item(0) : null);
                    angular.forEach ( results.rows , function ( value, key ) {

                        console.log ("article readen from DB");

                        $postHeaders = results.rows.item(key);
                        $postJson = $localStorageStore.getArticle( $postHeaders.externalId );

                        if ( $postJson != "" ) {
                            $postJson = JSON.parse( $postJson );
                            console.log ($postJson);
                            $dataJson.posts[$postHeaders.id] = $postJson;
                        }

                    } );

                    console.log ($dataJson);

                    var $scope = angular.element($("#postSlots")).scope();
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

    this.ifArticleNotUpToDateInDbWriteIt = function ( $articleId, $json ) {

        var $sql = "SELECT * FROM POSTS WHERE externalId="+$articleId;
        tellaw_core.log ($sql);

        this.db.transaction( function (tx) {
            return tx.executeSql ( $sql, [], function (tx, results) {

                if (results.rows.length) {
                    console.log ("article "+$articleId+" is in DB");
                } else {
                    console.log ("article "+$articleId+" is NOT in DB");
                    $webSqlPostStore.writeArticle( $articleId, $json );
                }

            } );
        });

    };

    this.writeArticle = function ( $articleid, $jsonArticle ) {
        var $sql = 'INSERT INTO POSTS (externalId, title, url, created, needUpdate) VALUES ('+$articleid+', ?, ?, ?, ?)';
        tellaw_core.log ($sql);
        $d = new Date();
        this.db.transaction( function (tx) {
            return tx.executeSql(
                $sql, [$jsonArticle.title, $jsonArticle.url ,$jsonArticle.excerpt, $jsonArticle.thumbnail, $d.getTime(), true ],
                null,
                function(tx, error) {
                    console.log('Error inserting : ');
                    console.log (error);
                }
            );
        } );
        tellaw_core.log ("Adding to local storage.");
        $localStorageStore.setArticle($articleid, JSON.stringify($jsonArticle));
    };

    this.updateNotUpToDateArticles = function () {

        var $sql = "SELECT * FROM POSTS WHERE needUpdate=true";
        tellaw_core.log ($sql);
        tx.executeSql(sql, [], function(tx, results) {

            angular.forEach ( results.rows , function ( value, key ) {

                $postHeaders = results.rows.item(key);
                appDetailComponent.populateArticle( $postHeaders.url );

            } );


        });


    }

    this.initializeDatabase(successCallback, errorCallback);

}
