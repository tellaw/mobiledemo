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

        tx.executeSql('DROP TABLE IF EXISTS posts');

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

            $toto = function(tx) {

                console.log ("homePostsStarted");

                var sql =   "SELECT * " +
                    "FROM posts " +
                    "ORDER BY id DESC";

                tx.executeSql(sql, [], function(tx, results) {

                    console.log ("homePostsLoaded");

                    var $dataJson = { "posts" : {} };
                    //this.updateHomeModel (results.rows.length > 0 ? results.rows.item(0) : null);
                    angular.forEach ( results.rows , function ( value, key ) {
                        $dataJson.posts.push = value;
                    } );

                    return "test";
                    /*


                                        var $scope = angular.element($("#postSlots")).scope();
                                        //console.log (angular.element($("#postSlots")).scope());
                                        $scope.$apply(function(){
                                            $scope.post.content = $dataJson;
                                        })
                    */
                });

            return $toto;

            },
            function(error) {
                alert("Transaction Error: " + error.message);
            }
        );

        return $toto;
    };


    this.initializeDatabase(successCallback, errorCallback);

}
