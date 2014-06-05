$( document ).ready(function() {

   var baseUrl = "https://" + user + ":" + pass + "@" + user + ".cloudant.com/" + db;
   
   function errorHandler(jqXHR, textStatus, errorThrown) {
      $( "#output-data" ).text(JSON.stringify(jqXHR, null, 2));
   }

   // on create
   $( "#create" ).click(function( event ) {
      var newplaylist = $( "#newplaylistname" ).val();
      if(newplaylist) {
         $.ajax({
            url: baseUrl,
            xhrFields: { withCredentials: true },
	    type: "POST",
	    contentType: "application/json",
	    data: JSON.stringify({_id: newplaylist, songs: []}),
	    error: errorHandler
         }).done(function( data ) {
	    var doc = JSON.parse(data);
	    $( "#output-data" ).text(JSON.stringify(doc, null, 2));
	    $( "#newplaylistname" ).val("");
         });
      }
   });

   // on read
   $( "#read" ).click(function( event ) {
      var readplaylist = $( "#readplaylistname" ).val();
      var docUrl = baseUrl + "/" + readplaylist;
      if(readplaylist) {
         $.ajax({
            url: docUrl,
            xhrFields: { withCredentials: true },
            type: "GET",
            error: errorHandler
         }).done(function( data ) {
            var doc = JSON.parse(data);
            $( "#output-data" ).text(JSON.stringify(doc, null, 2));
            $( "#readplaylistname" ).val("");
         });
      }
   });

   // on update
   $( "#update" ).click(function( event ) {
      var playlist = $( "#updateplaylistname" ).val();
      var artist = $( "#artistname" ).val();
      var song = $( "#songname" ).val();
      var docUrl = baseUrl + "/" + playlist;
      if(playlist && artist && song) {
         $.ajax({
            url: docUrl,
            xhrFields: { withCredentials: true },
            type: "GET",
            error: errorHandler
         }).done(function( data ) {
            var doc = JSON.parse(data);
            doc['songs'].push({"artist":artist,"title":song});
            $.ajax({
	       url: docUrl,
               xhrFields: { withCredentials: true },
	       type: "PUT",
	       data: JSON.stringify(doc),
	       contentType: "application/json",
	       error: errorHandler
            }).done(function( data ) {
	       var doc2 = JSON.parse(data);
	       $( "#output-data" ).text(JSON.stringify(doc2, null, 2));
	       $( "#updateplaylistname" ).val("<Playlist Name>");
	       $( "#artistname" ).val("<Artist Name>");
	       $( "#songname" ).val("<Song Title>");
            });
         });
      }
   });

   // on delete
   $( "#delete" ).click(function( event ) {
      var deleteplaylist = $( "#deleteplaylistname" ).val();
      var docUrl = baseUrl + "/" + deleteplaylist;
      if(deleteplaylist) {
         $.ajax({
            url: docUrl,
            xhrFields: { withCredentials: true },
            type: "GET",
            error: errorHandler
         }).done(function( data ) {
            var doc = JSON.parse(data);
            var rev = doc['_rev'];
            $.ajax({
	       url: docUrl + "?rev=" + rev,
               xhrFields: { withCredentials: true },
	       type: "DELETE",
	       error: errorHandler
            }).done(function( data ) {
	       var doc2 = JSON.parse(data)
	       $( "#output-data" ).text(JSON.stringify(doc2, null, 2));
	       $( "#deleteplaylistname" ).val("");
            });
         });
      }
   });

   // reset the update playlist name field if it is empty
   $( "#updateplaylistname" ).blur(function() {
      if($( "#updateplaylistname" ).val() == "") {
         $( "#updateplaylistname" ).val("<Playlist Name>");
      }
   });

   // reset the artist name field if it is empty
   $( "#artistname" ).blur(function() {
      if($( "#artistname" ).val() == "") {
         $( "#artistname" ).val("<Artist Name>");
      }
   });

   // reset the song name field if it is empty
   $( "#songname" ).blur(function() {
      if($( "#songname" ).val() == "") {
         $( "#songname" ).val("<Song Title>");
      }
   });
});

