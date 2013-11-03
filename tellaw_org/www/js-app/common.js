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