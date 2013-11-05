console.log ("Synchronizer file loaded");

var SynchroManager = function(successCallback, errorCallback) {

    this.$_queue = new Array();
    this.$_processing = false;

    this.initialize = function(successCallback, errorCallback) {
        var self = this;
    }

    this.addToQueue = function ( $item ) {
        this.$_queue.push( $item );
    }

    this.processOneItem = function (  ) {
        if (this.$_queue.length > 0) {
            $item = this.$_queue.get(0);

            this.$_processing = true;
            // Call Update function

        }
    }

    this.initialize(successCallback, errorCallback);

}

var QueueItem = function ( $id, $url ) {
    this.$id = $id;
    this.$url = $url;
}