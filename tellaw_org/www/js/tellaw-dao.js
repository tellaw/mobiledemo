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
        /*
        var employees = [
            {"id": 1, "firstName": "Ryan", "lastName": "Howard", "title":"Vice President, North East", "managerId": 0, "city":"New York, NY", "cellPhone":"212-999-8888", "officePhone":"212-999-8887", "email":"ryan@dundermifflin.com"},
            {"id": 2, "firstName": "Michael", "lastName": "Scott", "title":"Regional Manager", "managerId": 1, "city":"Scranton, PA", "cellPhone":"570-865-2536", "officePhone":"570-123-4567", "email":"michael@dundermifflin.com"},
            {"id": 3, "firstName": "Dwight", "lastName": "Schrute", "title":"Assistant Regional Manager", "managerId": 2, "city":"Scranton, PA", "cellPhone":"570-865-1158", "officePhone":"570-843-8963", "email":"dwight@dundermifflin.com"},
            {"id": 4, "firstName": "Jim", "lastName": "Halpert", "title":"Assistant Regional Manager", "managerId": 2, "city":"Scranton, PA", "cellPhone":"570-865-8989", "officePhone":"570-968-5741", "email":"dwight@dundermifflin.com"},
            {"id": 5, "firstName": "Pamela", "lastName": "Beesly", "title":"Receptionist", "managerId": 2, "city":"Scranton, PA", "cellPhone":"570-999-5555", "officePhone":"570-999-7474", "email":"pam@dundermifflin.com"},
            {"id": 6, "firstName": "Angela", "lastName": "Martin", "title":"Senior Accountant", "managerId": 2, "city":"Scranton, PA", "cellPhone":"570-555-9696", "officePhone":"570-999-3232", "email":"angela@dundermifflin.com"},
            {"id": 7, "firstName": "Kevin", "lastName": "Malone", "title":"Accountant", "managerId": 6, "city":"Scranton, PA", "cellPhone":"570-777-9696", "officePhone":"570-111-2525", "email":"kmalone@dundermifflin.com"},
            {"id": 8, "firstName": "Oscar", "lastName": "Martinez", "title":"Accountant", "managerId": 6, "city":"Scranton, PA", "cellPhone":"570-321-9999", "officePhone":"570-585-3333", "email":"oscar@dundermifflin.com"},
            {"id": 9, "firstName": "Creed", "lastName": "Bratton", "title":"Quality Assurance", "managerId": 2, "city":"Scranton, PA", "cellPhone":"570-222-6666", "officePhone":"570-333-8585", "email":"creed@dundermifflin.com"},
            {"id": 10, "firstName": "Andy", "lastName": "Bernard", "title":"Sales Director", "managerId": 4, "city":"Scranton, PA", "cellPhone":"570-555-0000", "officePhone":"570-646-9999", "email":"andy@dundermifflin.com"},
            {"id": 11, "firstName": "Phyllis", "lastName": "Lapin", "title":"Sales Representative", "managerId": 10, "city":"Scranton, PA", "cellPhone":"570-241-8585", "officePhone":"570-632-1919", "email":"phyllis@dundermifflin.com"},
            {"id": 12, "firstName": "Stanley", "lastName": "Hudson", "title":"Sales Representative", "managerId": 10, "city":"Scranton, PA", "cellPhone":"570-700-6464", "officePhone":"570-787-9393", "email":"shudson@dundermifflin.com"},
            {"id": 13, "firstName": "Meredith", "lastName": "Palmer", "title":"Supplier Relations", "managerId": 2, "city":"Scranton, PA", "cellPhone":"570-588-6567", "officePhone":"570-981-6167", "email":"meredith@dundermifflin.com"},
            {"id": 14, "firstName": "Kelly", "lastName": "Kapoor", "title":"Customer Service Rep.", "managerId": 2, "city":"Scranton, PA", "cellPhone":"570-123-9654", "officePhone":"570-125-3666", "email":"kelly@dundermifflin.com"},
            {"id": 15, "firstName": "Toby", "lastName": "Flenderson", "title":"Human Resources", "managerId": 1, "city":"Scranton, PA", "cellPhone":"570-485-8554", "officePhone":"570-699-5577", "email":"toby@dundermifflin.com"}
        ];
        var l = employees.length;
        var sql = "INSERT OR REPLACE INTO employee " +
            "(id, firstName, lastName, managerId, title, city, officePhone, cellPhone, email) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        var e;
        for (var i = 0; i < l; i++) {
            e = employees[i];
            tx.executeSql(sql, [e.id, e.firstName, e.lastName, e.managerId, e.title, e.city, e.officePhone, e.cellPhone, e.email],
                function() {
                    console.log('INSERT success');
                },
                function(tx, error) {
                    alert('INSERT error: ' + error.message);
                });
        }
        */
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

    this.findHomePosts = function () {
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
                        $dataJson.posts.push = value;
                    } );

                    var $scope = angular.element($("#postSlots")).scope();
                    //console.log (angular.element($("#postSlots")).scope());
                    $scope.$apply(function(){
                        $scope.post.content = $dataJson;
                    })

                });
            },
            function(error) {
                alert("Transaction Error: " + error.message);
            }
        );
    };


    this.initializeDatabase(successCallback, errorCallback);

}




/*
function writeArticle ( $articleid, $jsonArticle ) {
    var $sql = 'INSERT INTO POSTS (id, data, title, excerpt, image) VALUES ('+$articleid+',?, ?, ?, ?)';
    tellaw_core.log ($sql);
    db.transaction( function (tx) {
        return tx.executeSql(
                $sql, [JSON.stringify( $jsonArticle ), $jsonArticle.title, $jsonArticle.excerpt, $jsonArticle.thumbnail]
        );
    } );
}

function getArticle ( $articleId ) {

    var $sql = "SELECT * FROM POSTS WHERE id="+$articleId;
    tellaw_core.log ($sql);
    db.transaction( function (tx) {
        return tx.executeSql ( $sql, [],

            function getArticleInDbQuerySuccess(tx, results) {
                var scope = angular.element($("#slotDetail")).scope();
                scope.$apply(function(){
                    scope.post.content = JSON.parse( results.rows.item(0).data);
                })
            }

        );
    });

}

function getArticlesForHomePage () {

    var $sql = "SELECT * FROM POSTS ORDER BY id DESC";
    db.transaction( function (tx) {
        return tx.executeSql ( $sql, [],

            function (tx, results) {
                console.log ( results );
                angular.forEach ( results.rows , function ( value, key ) {

                    console.log (value);

                } );

            }

        );
    });

}

function isArticleInDb ( $articleId ) {
    var $sql = "SELECT * FROM POSTS WHERE id="+$articleId;
    tellaw_core.log ($sql);
    var $value = db.transaction( function (tx) {
        return tx.executeSql ( $sql, [], isArticleInDbQuerySuccess );
    });
    return $value;
}
    */