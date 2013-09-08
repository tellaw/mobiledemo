var tellaw_dao = {

    populate: function() {

        console.log ("Sending JSON request");

        $.ajax({
            type       : "POST",
            url        : 'http://www.tellaw.org?json=1',
            crossDomain: true,
            dataType   : 'json',
            success    : function(response) {
                console.log(response);
                tellaw_dao.writeHTMLPost(response);
            },
            error      : function() {
                console.error("error");
            }
        });

        console.log ("End of JSON request");

    },

    writeHTMLPost: function ( jsonresponse ) {

        alert ("Json response");

        for (var i in jsonresponse.posts) {
            output+="<li>post"+i+"</li>";
        }

        alert (output);

    }

}