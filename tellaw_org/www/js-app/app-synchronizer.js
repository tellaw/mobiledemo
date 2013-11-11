console.log ("Synchronizer file loaded");

var SynchroManager = function(successCallback, errorCallback) {

    this.$_queue = new Array();
    this.$_queueObjects = new Array();
    this.$_processing = false;

    this.initialize = function(successCallback, errorCallback) {
        var self = this;
        
        setInterval(
        	function(){
        		$synchroManager.processOneItem();
        	},15000
        );
        
    }

    this.addToQueue = function ( $item ) {
        if ( this.$_queueObjects[$item.id] == null ) {
        	tellaw_core.log ("SynchroManager adding to queue " + $item.id + " - " + $item.url);
        	this.$_queue.push( $item.id );
        	this.$_queueObjects[ $item.id ] = $item;
        }
    }

    this.processOneItem = function (  ) {
        
    	if ( !this.$_processing ) {
    	
	    	if (this.$_queue.length > 0) {
	    		$id = this.$_queue.shift();
	    		$item = this.$_queueObjects[$id];
	
	            tellaw_core.log ("SynchroManager start's processing " + $item.id + " - " + $item.url);    
	            
	            this.$_processing = true;
	            // Call Update function
	            appDetailComponent.populateArticle ( $item.id, $item.url );
	        } else {
	        	tellaw_core.log ("SynchroManager - no item to process in the queue");
	        }
    	
    	} else {
    		tellaw_core.log ("SynchroManager already processing an item");
    	}
    }

    this.initialize(successCallback, errorCallback);

}

var QueueItem = function ( $id, $url ) {
    this.id = $id;
    this.url = $url;
}