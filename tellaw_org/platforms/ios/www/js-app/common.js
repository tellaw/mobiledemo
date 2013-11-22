var $isCordovaReady = false;
var $isAngularReady = false;
var $isJqueryReady = false;

function getAngularScope () {
    return angular.element($("#postSlots")).scope();
}

var tellaw_core = {

    log : function( $str ) {
        console.log( $str );
    },

    error : function( $str ) {
        console.error( $str );
    }

}

$( document ).ready(function($scope) {
    console.log ("-----------------------> JQuery ready Event");
    $isJqueryReady = true;
});

angular.element(document).ready(function( $scope ) {
    console.log ("-----------------------> Angular ready Event");
    $isAngularReady = true;
});

$checkInitReady = setInterval(
    function(){
        isApplicationReady();
    },1000
);

function isApplicationReady() {

    console.log("Application starting : Checking for component's to be ready");

    if ( $isAngularReady && $isCordovaReady && $isJqueryReady ) {
        console.log ("Application starting, ready events detected");
        initAngularApplication();
        window.clearInterval($checkInitReady);
    } else {
        console.log ("Application starting, waiting for a ready event");
    }

}