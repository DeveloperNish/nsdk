/**
 * nsdk javascript library
 ****************************************************************************************************************************
 *	V.1.0 : additions
 ****************************************************************************************************************************
 *	+ ns alias of nsdk
 *	+ selector 			- ns.get("#identifier");							| get element by identifier name
 *						- ns.get(".class");									| get element by class name
 *						- ns.get("tag[property=value]");					| get element by specific property 
 *	+ selector.on 		- ns.get("#identifier").on('click',function(){});	| attaches a event trigger to the element
 *	+ selector.click	- ns.get("#identifier").click(function(){});		| wrapper method for on('click',function(){})
 *	+ selector.fadeIn	- ns.get("#identifier").fadeIn();					| Adds to css opacity property
 *	+ selector.fadeOut	- ns.get("#identifier").fadeOut();					| subtracts from css opacity property
 *	+ selector.hide 	- ns.get("#identifier").hide();						| applies display : none style
 *	+ selector.show 	- ns.get("#identifier").show();						| applies display : block style
 *	+ selector.css 		- ns.get("#identifier").css("property"); 			| getter
 *						- ns.get("#identifier").css("property","value");	| setter
 *	+ ns.ajax			- ns.ajax({parameters});
 *							- state 		: request state (4)
 *							- status 		: request status  (400)
 *							- async 		: request synchronous or asynchronous (true)
 *							- method 		: request method [GET | POST] (GET)
 *							- dataType 		: response datatype (defaults to common datatypes [text/plain, application/json] etc)
 *							- contentType 	: request content-type (application/x-www-form-urlencoded)
 *							- headers		: request additional headers
 *							- params 		: request parameters
 *							- success		: callback function on success
 *								-	ns.ajax({
 *										url : "my_request_url",
 *										dataType : "text/plain",
 *										successs : function(data){
 *											console.log("Response : "+data);
 *									 	}
 *								 	});
 *							- error 		: callback function on error
 *								-	ns.ajax({
 *										url : "bad_request_url",
 *										success : function(data){
 *											console.log("wont get called on error");
 *										},
 *										error : function(xhr,status,data){
 *											console.log("server status : "+status+" error : "+data);
 *										}
 *								 	});
 *	+ ns.load			- ns.load(function(){
 *								console.log("will execute after the document loads");
 *							});
 ****************************************************************************************************************************
 * Created By : Nischal Shrestha (https://nischal-shrestha.github.io)
 * Current Version : 1.0
 */
var nsdk = nsdk || {

	//readonly data
	data : Object.create(this,{
		_id 		: {writable: false, enumerable: true, value: "#"},
		_class 		: {writable: false, enumerable: true, value: "."},
		_equals 	: {writable: false, enumerable: true, value: "="},
		_amp	 	: {writable: false, enumerable: true, value: "&"},
		_squareBracketOpen	: {writable: false, enumerable: true, value: "["},
		_squareBracketClose : {writable: false, enumerable: true, value: "]"},
		_post 		: {writable: false, enumerable: true, value: "POST"},
		_get 		: {writable: false, enumerable: true, value: "GET"},
		_baseUrl 	: {writable: false, enumerable: true, configurable: true, value: "http://"+window.location.host},
	}),

	/**
	 * Utility functions
	 * @type {Object}
	 */
	util : {
		/**
		 * Safe guard and format url parameter
		 * @param  {String} str [parameter]
		 * @return {String|boolean}     [returns string if test passes or false if fails]
		 */
		urlSafe : function(str){
			str = str.replace(/\s/g,"-");
			var regexp = /^[a-zA-Z0-9-]+$/;
			if(regexp.test(str)){
				return str;
			}else{
				return false;
			}
		},
	},
	/**
	 * Returns a element node list
	 * @param  {String} elem [name of the element with prefix of type]
	 * @return {NodeList}      returns a dom node list of the type
	 */
	get : function(elem){
		var type = elem.charAt(0);
		var selector = null;
		if(type === nsdk.data._id){
			var elem = elem.substr(1,elem.length);
			selector = document.getElementById(elem);
			selector._type = nsdk.data._id;
		}else if(type === nsdk.data._class){
			var elem = elem.substr(1,elem.length);
			selector = document.getElementsByClassName(elem);
			selector._type = nsdk.data._class;
		}else{
			if(elem.indexOf(nsdk.data._squareBracketOpen) != -1){
				var op = elem.indexOf(nsdk.data._squareBracketOpen);
				var cl = elem.indexOf(nsdk.data._squareBracketClose);
				var tagName = elem.substring(0,op);
				var elem = elem.substring(op+1,cl);
				var eq = elem.indexOf(nsdk.data._equals);
				var selectBy = elem.substring(0,eq);
				var value = elem.substring(eq+1,elem.length);
				selector = document.getElementsByTagName(tagName);
				for(var i=0;i<selector.length;i++){
					if(selector[i].getAttribute(selectBy) == value){
						selector = selector[i];
						break;
					}
				}
			}else{
				selector = document.getElementsByTagName(elem);
			}
		}
		if(selector.length != 0){
			/**
			 * Attaches an event on a specific trigger
			 * @param  {String} trigger [trigger type ('click','keydown','keyup')]
			 * @param  {Function} func    [a callback function]
			 * @return {Node|Nodelist}         [reference to the Node or Nodelist]
			 */
			selector.on = function(trigger,func){
				if(this._type != nsdk.data._id){
					for(var i=0;i<this.length;i++){
						this[i].addEventListener(trigger,func);
					}
				}else{
					this.addEventListener(trigger,func);
				}
				return this;
			}
			/**
			 * Fades out an element
			 * @param  {Integer} interval [Time taken to fade out in ms]
			 * @return {Node|NodeList}          
			 */
			selector.fadeOut = function(interval){
				(interval==='undefined' ? interval = 70 : interval = interval);
				var op = 1; 
                var timer = setInterval(function () {
                    if (op <= 0){
                        clearInterval(timer);
                    }
                   	selector.css("opacity",op.toFixed(1));
                    op -= 0.1;
                }, interval);
                return this;
			}
			/**
			 * Fades in an element
			 * @param  {Integer} interval [Time taken to fade in]
			 * @return {Node|NodeList}          
			 */
			selector.fadeIn = function(interval){
				(interval==='undefined' ? interval = 70 : interval = interval);
				var op = 0.1; 
                var timer = setInterval(function () {
                    if (op >= 1 || op >= 1.0){
                        clearInterval(timer);
                    }
                   	selector.css("opacity",op.toFixed(1));
                    op += 0.1;
                }, interval);
                return this;
			}
			/**
			 * Trigger on('click',func) method
			 * @param  {Function} func [callback function]
			 * @return {Node|NodeList}      
			 */
			selector.click = function(func){
				return this.on("click",func);
			}
			/**
			 * Hides an element
			 * @return {Node|NodeList} 
			 */
			selector.hide = function(){
				this.css("display","none");
				return this;
			}
			/**
			 * Shows an element
			 * @return {Node|NodeList} 
			 */
			selector.show = function(){
				this.css("display","block");
				return this;
			}
			/**
			 * Returns css property or sets a css property 
			 * depending on how many parameters are passed
			 * @param  {String} propertyName [name of the property]
			 * @param  {String} value        [value to assign the property]
			 * @return {Node|NodeList}              
			 */
			selector.css = function(propertyName,value){
				if(value===undefined){
					if(this._type === ns.data._id){
						var cs = window.getComputedStyle(selector,null).getPropertyValue(propertyName);
					}else{
						var cs = window.getComputedStyle(selector[0],null).getPropertyValue(propertyName);
					}
					return cs;
				}else{
					if(propertyName === "background-color"){
						propertyName = "backgroundColor";
					}
					if(this._type===ns.data._id){
						this.style[propertyName] = value;
					}else{
						if(this.length==1){
							this[0].style[propertyName] = value;
						}else{
							for(node in this){
								this[node].style[propertyName] = value;
							}
						}
					}
				}
				return this;
			}
			/**
			 * Returns a specific attribute of an element
			 * @param  {String} of Attribute name of the lement
			 * @return {Node|NodeList|boolean}   
			 */
			selector.attr = function(of){
				if(this._type == nsdk.data._class){
					return false;
				}
				return this.getAttribute(of);
			}
		}
		return selector;
	},
	/**
	 * Trigger on window load
	 * @param  {Function} func [a function]
	 * @return {window.onload}      [return the event]
	 */
	load : function(func){
		return window.onload = func;
	},

	/**
	 * Attaches an even tto an element
	 * @param  {String} trigger [trigger type]
	 * @param  {Node||NodeList} elem    [A DOM node of nodelist]
	 * @param  {Function} func    [a function]
	 * @return {NONE}
	 */
	on : function(trigger,elem,func){
		if(elem._type != nsdk.data._id){
			for(var i=0;i<elem.length;i++){
				elem[i].addEventListener(trigger,func);
			}
		}
		else
		{
			elem.addEventListener(trigger,func);
		}
	},
	keydown : function(elem,func){
		nsdk.on("keydown",elem,func);
		return elem;
	},
	keyup : function(elem,func){
		nsdk.on("keyup",elem,func);
		return elem;
	},
	click : function(elem,func){
		nsdk.on("click",elem,func);
		return elem;
	},
	css : function(elem,propertyName,value){
		if(value===undefined){
			if(elem._type === ns.data._id){
				var cs = window.getComputedStyle(elem,null).getPropertyValue(propertyName);
			}else{
				var cs = window.getComputedStyle(elem[0],null).getPropertyValue(propertyName);
			}
			return cs;
		}else{
			if(propertyName === "background-color"){
				propertyName = "backgroundColor";
			}
			if(elem._type===ns.data._id){
				elem.style[propertyName] = value;
			}else{
				if(elem.length==1){
					elem[0].style[propertyName] = value;
				}else{
					for(node in elem){
						elem[node].style[propertyName] = value;
					}
				}
			}
		}
		return elem;
	},
	ajax : function(obj){
		var xhr = new XMLHttpRequest();
		(obj.hasOwnProperty('state') ? null : obj.state = 4);
		(obj.hasOwnProperty('status') ? null : obj.status = 200);
		(obj.hasOwnProperty("async") ? null : obj.async=true);
		(obj.hasOwnProperty("method") ? null : obj.method=nsdk.data._get);
		xhr.onreadystatechange = function(){
			if(xhr.readyState == obj.state && xhr.status == obj.status){
				var responseType = xhr.getResponseHeader("Content-Type").split(";",1)[0];
				if(obj.hasOwnProperty("dataType")){
					if(obj.dataType === responseType){
						obj.success(xhr.responseText);
					}else{
						obj.error(xhr,xhr.status = 500,"Response datatype mismatch ("+responseType+") returned by the server but ("+obj.dataType+") requested by client!");
					}
				}else{
					obj.success(xhr.responseText);
				}
			}else if(xhr.status >= 500){
				obj.error(xhr,xhr.status,"Server Error!");
			}else if(xhr.status == 400){
				obj.error(xhr,xhr.status,"Not Found!");
			}
		};
		xhr.open(obj.method,obj.url,obj.async);
		if(obj.method===nsdk.data._post){
			xhr.setRequestHeader("Content-type",(obj.contentType === undefined ? "application/x-www-form-urlencoded" : obj.contentType));
		}
		if(obj.headers !== undefined){
			for(var key in obj.headers){
				xhr.setRequestHeader(key,obj.headers[key]);
			}
		}
		if(obj.hasOwnProperty("params") && obj.method===nsdk.data._post){
			var i = 1;
			var parameters = "";
			for(data in obj.params){
				parameters+=data+"="+obj.params[data];
				if(Object.keys(obj.params).length != i){
					parameters+=nsdk.data._amp;
				}
				i++;
			}
			xhr.send(parameters);	
		}else{
			xhr.send();
		}
		
	},
};

var ns = nsdk;
