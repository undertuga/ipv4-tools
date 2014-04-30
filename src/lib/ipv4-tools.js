/*
 * ==============================================================
 * 		IPv4-Tools
 * ==============================================================
 * 		IPv4 Toolkit for NodeJS
 * ==============================================================
 * License: MIT (check attached file)
 * Author: undertuga[at]gmail[dot]com
 * RepURL: https://github.com/undertuga/ipv4-tools
 * ==============================================================
 */





/* 
 * THA SPOT 
 * - Main 
 */
IPv4Tools = function(){
	
	// declaring required holders && external dependencies
	this.ipapi = 'http://ip-api.com/json/'; // IP-API GEOLOCATION SERVICE
	this.cymruASN = '.asn.cymru.com'; // TEAM CYMRU IP TO ASN SERVICE
	this.cymruOrigin = '.origin.asn.cymru.com'; // TEAM CYMRU SERVICE
	this.cymruPeers = '.peer.asn.cymru.com'; // TEAM CYMRU SERVICE
	this.zenSpamHaus = '.zen.spamhaus.org';
	this.abuseCBL = '.cbl.abuseat.org';
	this.async = require('async'), this.http = require('http'), this.dns = require('dns');
	
	
	// SpamHaus Reputation Check
	this.SpamHausRep = function(ipv4, callback){
		
		// validating gathered data
		if((typeof(ipv4) === 'undefined') || (ipv4 === null) || (ipv4 === '') || (ipv4.length <= 0) || (ipv4.length > 16)){callback(null, false);}
		else{
			
			// reversing gathered ip, appending spamhaus ZEN dns url
	        var ip = ipv4.split(".");
	        ip = ip[3] + '.' + ip[2] + '.' + ip[1] + '.' + ip[0] + this.zenSpamHaus;
	        
	        // check ip on spamhaus ZEN DNSBL
	        this.dns.resolve(ip, 'A', function(error, address)
	        {   
	        	// fail safe bail out
	        	//if(error){console.log(error);}
	        	
	            // checking gathered dns result
	            if(!address){callback(null, false);}
	            else{
	                // sweeping result
	                address.forEach(function(rephost)
	                {
	                    // checking host for score matching
	                    switch(rephost)
	                    {   
	                        // SH1 HOSTS
	                        case '127.0.0.2':
	                            callback(null, 2);
	                            break;
	    
	                        // SH2 HOSTS
	                        case '127.0.0.3':
	                            callback(null, 3);
	                            break;
	    
	                        // SH3 HOSTS
	                        case '127.0.0.10':
	                        case '127.0.0.11':
	                            callback(null, 4);
	                            break;
	                            
	                        // HH1 HOSTS
	                        case '127.0.0.4':
	                        case '127.0.0.5':
	                        case '127.0.0.6':
	                        case '127.0.0.7':
	                            callback(null, 5);
	                            break;
	    
	                        // NH0 HOSTS
	                        default: 
	                            callback(null, 1);
	                            break;
	                    }        
	                });
	            }
	        });
		}
	};
	
	
	
	
	
	// CBL Reputation Check
	this.CblRep = function(ipv4, callback){
		
		// validating gathered data
		if((typeof(ipv4) === 'undefined') || (ipv4 === null) || (ipv4 === '') || (ipv4.length <= 0) || (ipv4.length > 16)){callback(null, false);}
		else{
			
			// reversing gathered ip
	        var ip = ipv4.split(".");
	        ip = ip[3] + '.' + ip[2] + '.' + ip[1] + '.' + ip[0] + this.abuseCBL;
	        
	        // check ip on CBL DNSBL
	        this.dns.resolve(ip, 'A', function(error, address)
	        {
	        	// fail safe bail out
	        	//if(error){console.log(error);}
	        	
	            // checking gathered dns result
	            if(!address){callback(null, false);}
	            else{
	                // sweeping result
	                address.forEach(function(rephost)
	                {
	                    if(rephost === '127.0.0.2'){callback(null, 2);}
	                    else{callback(null, 1);}
	                });
	            }
	        });
		}
	};
};










/* "PROTOTYPING" ZONE */







/*
 * Name: generateIPv4
 * Detail: Generates random IPv4 address according to desired class!
 * Receives: IPv4 class(string) | class A to E; R to random
 * Returns: false(bool) on failure / error | IPv4 address (string)
 */
IPv4Tools.prototype.generateIPv4 = function(ipclass, callback){
	
	// validating gathered ip class
	if((typeof(ipclass) === 'undefined') || (ipclass === null) || (ipclass === '') || (ipclass.length <= 0) || (ipclass.length > 1)){callback(null, false);}
	else{
		// declaring octet's (-1st) holder
		var octets = '.' + (Math.floor(Math.random() * 255) + 0) + '.' + (Math.floor(Math.random() * 255) + 0) + '.' + (Math.floor(Math.random() * 255) + 0);
		
		// matching ipv4 class
		switch(ipclass.toUpperCase()){
		
			// class A IPv4
			case 'A':
				var oc1 = Math.floor(Math.random() * 127) + 0;
				callback(null, oc1 + octets);
				break;
				
			// class B IPv4
			case 'B':
				var oc1 = Math.floor(Math.random() * 191) + 128;
				callback(null, oc1 + octets);
				break;
				
			// class C IPv4
			case 'C':
				var oc1 = Math.floor(Math.random() * 223) + 192;
				callback(null, oc1 + octets);
				break;
				
			// class D IPv4
			case 'D':
				var oc1 = Math.floor(Math.random() * 239) + 224;
				callback(null, oc1 + octets);
				break;
				
			// class E IPv4
			case 'E':
				var oc1 = Math.floor(Math.random() * 247) + 240;
				callback(null, oc1 + octets);
				break;
				
			// Random IPv4 class selection (fail safe bail out)
			case 'R':
			default:
				var oc1 = Math.floor(Math.random() * 247) + 0;
				callback(null, oc1 + octets);
				break;
		}
	}
};






/* 
 * IPv4 Validation Prototype
 * (boolean response)
 */
IPv4Tools.prototype.validateIPv4 = function(ipv4, callback){
	
	// validating gathered data
	if((typeof(ipv4) === 'undefined') || (ipv4 === null) || (ipv4 === '') || (ipv4.length <= 0) || (ipv4.length > 16)){callback(null, false);}
	else{
		
		// check for valid ipv4 address
		ipv4.split('.').forEach(function(octect){
			if((typeof(octect) === 'undefined') || (octect === null) || (octect === '') || ((octect < 0) || (octect > 255))){callback(null, false);}
		});
		
		// return validation state
		callback(null, true);
	}
};






/*
 * Get IPv4 Class
 * (returns class type as string)
 */
IPv4Tools.prototype.getNetworkClass = function(ipv4, callback){
	
	// validating gathered data
	if((typeof(ipv4) === 'undefined') || (ipv4 === null) || (ipv4 === '') || (ipv4.length <= 0) || (ipv4.length > 16)){callback(null, false);}
	else{
		
		// explode gathered ipv4 address
		ipv4 = ipv4.split('.');
		
		/*ipv4 class match*/
		if((ipv4 !== null) && (parseInt(ipv4[0].trim()) > 0) && (parseInt(ipv4[0].trim()) <= 127)){ipv4 = null; callback(null, {IPv4: ipv4, Class: 'A'});} // class A ipv4
		if((ipv4 !== null) && (parseInt(ipv4[0].trim()) > 127) && (parseInt(ipv4[0].trim()) <= 191)){ipv4 = null; callback(null, {IPv4: ipv4, Class: 'B'});} // class B ipv4
		if((ipv4 !== null) && (parseInt(ipv4[0].trim()) > 191) && (parseInt(ipv4[0].trim()) <=  223)){ipv4 = null; callback(null, {IPv4: ipv4, Class: 'C'});} // class C ipv4
		if((ipv4 !== null) && (parseInt(ipv4[0].trim()) > 223) && (parseInt(ipv4[0].trim()) <= 239)){ipv4 = null; callback(null, {IPv4: ipv4, Class: 'D'});} // class D ipv4
		if((ipv4 !== null) && (parseInt(ipv4[0].trim()) > 239) && (parseInt(ipv4[0].trim()) <= 247)){ipv4 = null; callback(null, {IPv4: ipv4, Class: 'E'});} // class E ipv4
		if(ipv4 !== null){callback(null, false);} // fail safe bail out
	}
};






/* 
 * -------------------------
 * Get IPv4 Network Data 
 * -------------------------
 * Currently using Team Cymru service
 * Check their work and services @ https://www.team-cymru.org/
 * 
 * returns object with ipv4 network related data
 */
IPv4Tools.prototype.getNetworkData = function(ipv4, callback){
	
	// validating gathered data
	if((typeof(ipv4) === 'undefined') || (ipv4 === null) || (ipv4.length <= 0) || (ipv4.length > 16)){callback(null, false);}
	else{
		
		// declaring required holders and references!
		var buffer = {ip: ipv4}, cymru = this, ip = ipv4.split(".");
	    var origin = ip[3] + '.' + ip[2] + '.' + ip[1] + '.' + ip[0] + cymru.cymruOrigin;      
	    var peers = ip[3] + '.' + ip[2] + '.' + ip[1] + '.' + ip[0] + cymru.cymruPeers;
	    var provider = buffer['asn'] + cymru.cymruASN;
	    
	    
	    
	    /*
	     * ASYNC WATERFALL SEQUENCE
	     * Sweeping Ipv4 data, step by step...
	     */
	    this.async.waterfall([
  
  
         /*
          * Gather main data
          */
	        function(callback){
	            
	            // gather ip data...
	            cymru.dns.resolveTxt(origin, function(err, dnsresult){
	                if(err){return;}
	       
	                // sweeping dns result
	                dnsresult.forEach(function(dnsres){
	                    
	                    // split gathered result
	                    var data = dnsres.split('|');
	                    buffer['cidr'] = data[1].trim();
	                    buffer['asn'] = data[0].trim();
	                    callback(null, buffer['asn']);
	                });
	            });
	        },
	        
	        
	        /*
	         * Gather asn peers
	         */
	        function(asn, callback){
	        
	            // gather asn peers data
	            cymru.dns.resolveTxt(peers, function(err, dnsresult){
	                if(err){return;}
	                
	                // sweeping result
	                dnsresult.forEach(function(dnsres){
	                    
	                    // extracting data from dns result
	                    var data = dnsres.split('|');
	                    data = data[0].split(' ');
	                    data.pop();
	                    buffer['asnpeers'] = data;
	                    callback(null, asn);
	                });
	            });  
	        },
	        
	        
	        
	        
	        
	        /*
	         * gather provider data
	         */
	        function(asn, callback){
	            
	            // gather asn / provider details
	            cymru.dns.resolveTxt('AS'+ asn + cymru.cymruASN, function(err, dnsresult){
	                if(err){return;}
	                
	                // sweeping result
	                dnsresult.forEach(function(dnsres){
	                    
	                    // extracting data from dns result
	                    var data = dnsres.split('|');
	                    buffer['provider'] = data[4].trim();
	                    buffer['tstamp'] = new Date();
	                    callback(null, true);
	                });
	            });
	        }
	        
	        
	        
	    ], function(error, results){
	    	
	    		// fail safe bail out
	            if(error){return;}
	            
	            // validating result
	            if(!results){callback(null, false);}
	            else{callback(null, buffer);}
	        }
	    );
	}
};







/* 
 * Get IPv4 Geolocation 
 * 
 * returns object with ipv4 geolocation data
 */
IPv4Tools.prototype.getGeoLocation = function(ipv4, callback){
	
	// validating gathered data
	if((typeof(ipv4) === 'undefined') || (ipv4 === null) || (ipv4 === '') || (ipv4.length <= 0) || (ipv4.length > 16)){callback(null, false);}
	else{
		
		// executing http GET request to ip api
		this.http.get(this.ipapi+ipv4, function(res){
			
			// declaring incoming chunks buff and collecting response 
			var data = '';
			res.on('data', function(chunk){data += chunk;});// while gathering response, build up data buff
			res.on('end', function(){data = JSON.parse(data); delete data['isp', 'as', 'query']; callback(null, data);}); // parse, clean and callback data
			
		}).on('error', function(error){callback(error);});// fail safe bail out
	}
};





/* 
 * Get IPv4 DNS related data
 * 
 * returns object with dns related data about given ipv4
 */
IPv4Tools.prototype.getDnsData = function(ipv4, callback){
	
	// validating gathered data
	if(((typeof(ipv4) === 'undefined') || (ipv4 === null) || (ipv4 === "") || (ipv4.length <= 0) || (ipv4.length > 16))){callback(null, false);}
	else{
		
		// declaring data holder and links to upper scope stuff
		var dnsdata = {}, async = this.async, dns = this.dns;
		
		// reverse DNS querying about desired ipv4
		dns.reverse(ipv4, function(error, dnsrev){
			
			// fail safe bail out
			if(error){callback(null, false);}
			else{
				
				// checking gathered array size
				if(dnsrev.length <= 0){callback(null, false);}
				else{
					
					// sweeping gathered array
					async.eachSeries(dnsrev, function(domain, callback){
						
						dns.lookup(domain, function(error, address, family){
							
							// fail safe bail out
							if(error){callback(null, false);}
							else{
								
								// adding data to holder
								dnsdata[domain] = address;
								callback(null, true);
							}
						});
					}, function(error, endres){
						
						// fail safe bail out || return reverse dns data
						if(error){callback(null, false);}
						else{callback(null, dnsdata);}
					});
				}
			}
		});
	}
};










/*
 * -------------------------
 * Check IPv4 Reputation
 * -------------------------
 * Currently supported services:
 * 
 * 		-- SpamHaus (Mostly Spam, has some other reputation badges)
 * 		-- CBL DNSBL (Spam related)
 * 
 * suggest other services to undertuga[at]gmail[dot]com
 * 
 * returns object with gathered ipv4 reputation related data
 */
IPv4Tools.prototype.checkReputation = function(ipv4, callback){
	
	// validating gathered data
	if(((typeof(ipv4) === 'undefined') || (ipv4 === null) || (ipv4 === "") || (ipv4.length <= 0) || (ipv4.length > 16))){callback(null, false);}
	else{
		
		// executing parallel dns querys to supported services
		var scope = this;
		scope.async.parallel([
          
          // invoquing reputation check functions
          function(innercall){scope.SpamHausRep(ipv4, function(error, shrep){innercall(null, shrep);});}, // checking SpamHaus
          function(innercall){scope.CblRep(ipv4, function(error, cblrep){innercall(null, cblrep);});} // checking CBL DNSBL
			
		], function(error, res){
			
			// fail safe bail out || return gathered reputation data
			scope = null;
			if(error){callback(error);}
			if(!res){callback(null, false);}else{callback(null, {ip: ipv4, spamhaus: res[0], cbl: res[1], tstamp: new Date()});}
		});
	}
};









IPv4Tools.prototype.ipv4ToInteger = function(ipv4, callback){
	
	// validating gathered data
	if((typeof(ipv4) === 'undefined') || (ipv4 === null) || (ipv4 === '') || (ipv4.length <= 0) || (ipv4.length > 16)){callback(null, false);}
	else{

		// spliting gathered ipv4
		var ipv4 = ipv4.split('.');
		callback(null, ((((((+ipv4[0])*256)+(+ipv4[1]))*256)+(+ipv4[2]))*256)+(+ipv4[3])); // return merged octets calculation
	}
};






IPv4Tools.prototype.integerToIPv4 = function(number, callback){
	
	// validating gathered data (min & max ipv4 integer representations)
	if((typeof(number) === 'undefined') || (number === null) || (number === '') || (number <= 0) || (number > 4294967295)){callback(null, false);}
	else{
		
		// reconstructing IPv4 from integer
		var base = number%256; // 1st split
		for(var x = 3; x > 0; x--){number = Math.floor(number/256); base = number%256 + '.' + base;} // sweeping remaining octets
		callback(null, base);
	}
};






// exporting prototypes
exports.IPv4Tools = IPv4Tools;