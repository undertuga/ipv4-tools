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




IPv4Tools = function(){
	
	// importing required external dependencies
	this.async = require('async');
	this.dns = require('dns');
	this.satelize = require('satelize');
};






/*
 * Name: generateIPv4
 * Detail: Generates random IPv4 address according to desired class!
 * Receives: IPv4 class(string) | class A to E; R to random
 * Returns: false(bool) on failure / error | IPv4 address (string)
 */
IPv4Tools.prototype.generateIPv4 = function(ipclass, callback){
	
	// validating gathered ip class
	if(((typeof(ipclass) === 'undefined') || (ipclass === null) || (ipclass === "") || (ipclass.lenght <= 0))){callback(null, false);}
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










IPv4Tools.prototype.validateIPv4 = function(ipv4, callback){
	
	// validating gathered data
	if(((typeof(ipv4) === 'undefined') || (ipv4 === null) || (ipv4 === "") || (ipv4.lenght <= 0))){callback(null, false);}
	else{
		
		// check for valid ipv4 address
		ipv4 = ipv4.split(".");
		for(var x = 0; x <= ipv4.length-1; x++){if((typeof(ipv4[x]) === 'undefined') || (ipv4[x] === null) || (ipv4[x] === '') || ((ipv4[x] < 0) || (ipv4[x] > 255))){
			callback(null, false);
		}}
		
		// ipv4 seems valid
		callback(null, true);
	}
};








IPv4Tools.prototype.getNetworkData = function(ipv4, callback){
	
	// validate gathered data
	if(((typeof(ipv4) === 'undefined') || (ipv4 === null) || (ipv4 === "") || (ipv4.lenght <= 0))){callback(null, false);}
	else{
		
		var buffer = {ip: ipv4}, ip = ipv4.split(".");
	    var origin = ip[3] + '.' + ip[2] + '.' + ip[1] + '.' + ip[0] + '.origin.asn.cymru.com';      
	    var peers = ip[3] + '.' + ip[2] + '.' + ip[1] + '.' + ip[0] + '.peer.asn.cymru.com';
	    var provider = buffer['asn'] + '.asn.cymru.com';
	    
	    
	    /*
	     * ASYNC WATERFALL SEQUENCE
	     * Sweeping Ipv4 network data, step by step 
	     * (less bully activity @ the dns's, less red flags... parallel it or whatever you want, not my problem.)
	     */
	    this.async.waterfall([
	                     
	                     
         /*
          * Gather main data
          */
	        function(callback){
	            
	            // gather ip data...
	            this.dns.resolveTxt(origin, function(err, dnsresult){
	                if(err) return;
	                
	                // sweeping dns result
	                dnsresult.forEach(function(dnsres){
	                    
	                    // split gathered result
	                    var data = dnsres.split('|');
	                    buffer['cidr'] = data[1].trim();
	                    buffer['asn'] = data[0].trim();
	                    callback(null, data[0].trim());
	                });
	            });
	        },
	        
	        
	        
	        
	        
	        /*
	         * Gather ASN peers
	         */
	        function(asn, callback){
	        
	            // gather asn peers data
	            this.dns.resolveTxt(peers, function(err, dnsresult){
	                if(err) return;
	                
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
	            this.dns.resolveTxt('AS'+ asn + '.asn.cymru.com', function(err, dnsresult){
	                if(err) return;
	                
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
	            if(error){callback(error);}
	            
	            // validating result
	            if(!results){callback(null, false);}
	            else{callback(null, buffer);}
	        }
	    );
	}
};






IPv4Tools.prototype.getGeoLocation = function(ipv4, callback){
	
	// validating gathered data
	
};