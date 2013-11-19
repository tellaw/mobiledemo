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

function appready() {
	
	$('.click').css("cursor","pointer").click(
			function(){
				var link=$(this).find('a:first');
				var linkhref=link.attr('href');
				if(link.attr('target')){
					var newWindow=window.open(linkhref,link.attr('target'));
					newWindow.focus()
				}else{
					window.location=linkhref
				}
				return false
			}
		);
}