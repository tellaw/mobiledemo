console.log ("DAO file loaded");

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
    }

    this.createTable = function(tx) {

        console.log ("Creating table for POSTS");

        // tx.executeSql('DROP TABLE IF EXISTS posts');

        var sql = "CREATE TABLE IF NOT EXISTS posts ( " +
            "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "title VARCHAR(50), " +
            "image VARCHAR(50), " +
            "excerpt Text, " +
            "data Text );";

        tx.executeSql(sql, null,
            function() {
                console.log('Create table success');
            },
            function(tx, error) {
                alert('Create table error: ' + error.message);
            });
    }

    this.addSampleData = function(tx) {
        /* Insert here the sample loading */
    }

    this.findById = function(id, callback) {
        this.db.transaction(
            function(tx) {

                var sql = "SELECT * " +
                    "FROM posts " +
                    "WHERE id=:id";

                tx.executeSql(sql, [id], function(tx, results) {
                    callback(results.rows.length === 1 ? results.rows.item(0) : null);
                });
            },
            function(error) {
                alert("Transaction Error: " + error.message);
            }
        );
    };

    this.findHomePosts = function ( $scope ) {
        this.db.transaction(

            function(tx) {

                console.log ("homePostsStarted");

                var sql =   "SELECT * " +
                    "FROM posts " +
                    "ORDER BY id DESC";

                tx.executeSql(sql, [], function(tx, results) {

                    console.log ("homePostsLoaded");

                    var $dataJson = { "posts" : {} };
                    //this.updateHomeModel (results.rows.length > 0 ? results.rows.item(0) : null);
                    angular.forEach ( results.rows , function ( value, key ) {
                        console.log ("article readen from DB");
                        console.log ( results.rows.item(key) );

                        $postItem = results.rows.item(key);

                        $dataJson.posts[$postItem.id] = $postItem;
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

    this.getArticle = function ( $articleId ) {

        var $sql = "SELECT * FROM POSTS WHERE id="+$articleId;
        tellaw_core.log ($sql);
        this.db.transaction( function (tx) {
            return tx.executeSql ( $sql, [],

                function getArticleInDbQuerySuccess(tx, results) {
                    var scope = angular.element($("#slotDetail")).scope();
                    scope.$apply(function(){
                        console.log (JSON.parse( results.rows.item(0).data));
                        scope.post.content = JSON.parse( results.rows.item(0).data);
                    })
                }

            );
        });

    };

    this.isArticleInDb = function ( $articleId ) {
        var $sql = "SELECT * FROM POSTS WHERE id="+$articleId;
        tellaw_core.log ($sql);
        var $value = this.db.transaction( function (tx) {
            return tx.executeSql ( $sql, [], function (tx, results) {
                //console.log ("isArticleInDb : " + results.rows.item(0));
            } );
        });
        return $value;
    };

    this.writeArticle = function ( $articleid, $jsonArticle ) {
        var $sql = 'INSERT INTO POSTS (id, data, title, excerpt, image) VALUES ('+$articleid+',?, ?, ?, ?)';
        tellaw_core.log ($sql);
        this.db.transaction( function (tx) {
            return tx.executeSql(
                $sql, [JSON.stringify( $jsonArticle ), $jsonArticle.title, $jsonArticle.excerpt, $jsonArticle.thumbnail]
            );
        } );
    };

    this.initializeDatabase(successCallback, errorCallback);

}