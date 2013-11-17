function DataController($scope) {

    $scope.articleid = $.url().param('articleid');

    $scope.post = {
        name: 'Joe the Manager',
        content: [

        ]
    };
}