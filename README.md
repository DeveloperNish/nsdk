 # nsdk javascript library
 
 ## V.1.0 : additions
 
 	+ ns alias of nsdk
 	+ selector 			- ns.get("#identifier");							| get element by identifier name
 						- ns.get(".class");									| get element by class name
 						- ns.get("tag[property=value]");					| get element by specific property 
 	+ selector.on 		- ns.get("#identifier").on('click',function(){});	| attaches a event trigger to the element
 	+ selector.click	- ns.get("#identifier").click(function(){});		| wrapper method for on('click',function(){})
 	+ selector.fadeIn	- ns.get("#identifier").fadeIn();					| Adds to css opacity property
 	+ selector.fadeOut	- ns.get("#identifier").fadeOut();					| subtracts from css opacity property
 	+ selector.hide 	- ns.get("#identifier").hide();						| applies display : none style
 	+ selector.show 	- ns.get("#identifier").show();						| applies display : block style
 	+ selector.css 		- ns.get("#identifier").css("property"); 			| getter
 						- ns.get("#identifier").css("property","value");	| setter
 	+ ns.ajax			- ns.ajax({parameters});
 							- state 		: request state (4)
 							- status 		: request status  (400)
 							- async 		: request synchronous or asynchronous (true)
 							- method 		: request method [GET | POST] (GET)
 							- dataType 		: response datatype (defaults to common datatypes [text/plain, application/json] etc)
 							- contentType 	: request content-type (application/x-www-form-urlencoded)
 							- headers		: request additional headers
 							- params 		: request parameters
 							- success		: callback function on success
 								-	ns.ajax({
 										url : "my_request_url",
 										dataType : "text/plain",
 										successs : function(data){
 											console.log("Response : "+data);
 									 	}
 								 	});
 							- error 		: callback function on error
 								-	ns.ajax({
 										url : "bad_request_url",
 										success : function(data){
 											console.log("wont get called on error");
 										},
 										error : function(xhr,status,data){
 											console.log("server status : "+status+" error : "+data);
 										}
 								 	});
 	+ ns.load			- ns.load(function(){
 								console.log("will execute after the document loads");
 							});
 
  Created By : Nischal Shrestha (https://nischal-shrestha.github.io)
  Current Version : 1.0
