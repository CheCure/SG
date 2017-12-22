var app = angular.module('myApp', []);


app.controller("MainController", function($scope,$http){

	     
 
   $scope.data = [ ];


	$scope.steps = angular.copy( $scope.data);
	$scope.enabledEdit =[];
	 
	 
	$scope.setupSteps = function() {		 
		var previous_data = JSON.parse($scope.previous_data);	
		$scope.myurl = previous_data.myurl;
		$scope.simjs = previous_data.simjs;
		$scope.logproc = previous_data.logproc;
		$scope.steps = previous_data.steps;		
	}
	 	 
    $scope.addStep = function(){
	    var step ={ actiontxt:"",cmd:"",stepaction:"",steplisten:"",listentxt:"",stepnum:"",disableEdit:false};
		
		$scope.steps.push(step);
		$scope.enabledEdit[$scope.steps.length-1]=true;
	}
	$scope.editStep = function(index){
		console.log("edit index"+index);
		$scope.enabledEdit[index] = true;
	}
	$scope.deleteStep = function(index) {
		  $scope.steps.splice(index,1);
	}
	
	$scope.createScript = function(){
		console.log("Script Steps: "+angular.toJson($scope.steps ));
		
		//$scope.previous_data = $scope.myurl + "~" + $scope.simjs + "~" + $scope.logproc + "~" + angular.toJson($scope.steps);
		
		$scope.previous_data = '{"myurl":"'+$scope.myurl+'","simjs":"'+$scope.simjs+'","logproc":"'+$scope.logproc+'","steps":' + angular.toJson($scope.steps) + '}';
		
		var arrayLength = $scope.steps.length;
		console.log("Length: "+arrayLength);
		for (var i=0; i < arrayLength; i++) {
				
				var stepaction = $scope.steps[i].stepaction;
				var actiontxt = $scope.steps[i].actiontxt;
				var steplisten = $scope.steps[i].steplisten;
				var listentxt = $scope.steps[i].listentxt;
				
				//replace quotes if found in xpath ... escape with a \
				listentxt = listentxt.replace(/"/g, '\\"');
				
				var this_step = '';		
				var j = i+1;			 		
				
				if (stepaction == "Click") {								
					this_step = '.then(function() { return $browser.waitForAndFindElement('+steplisten+'("'+listentxt+'"), DefaultTimeout); })';
					this_step = this_step + "\n";
					this_step = this_step + '.then(function (el) { el.click(); })';	
					this_step = this_step + "\n";
				}
				if (stepaction == "Enter") {					
					this_step = '.then(function() { return $browser.waitForAndFindElement('+steplisten+'("'+listentxt+'"), DefaultTimeout); })';	
					this_step = this_step + "\n";
					this_step = this_step + '.then(function (el) { el.clear(); el.sendKeys("' + actiontxt + '"); el.sendKeys($driver.Key.ENTER); })';
					this_step = this_step + "\n";
				}
				if (stepaction == "Validate") {					
					this_step = '.then(function() { return $browser.findElement('+steplisten+'("'+listentxt+'")).getText(); })';	
					this_step = this_step + "\n";
					this_step = this_step + '.then(function (wholetext) { return wholetext.indexOf("' + actiontxt + '") != -1; })';
					this_step = this_step + "\n";
					this_step = this_step + '.then(function(result){    if (!result) { console.log("verifyTextPresent FAILED."); '
					this_step = this_step + "\n";
					this_step = this_step + 'throw new Error ("Text failed validation"); $browser.takeScreenshot(); } else { console.log("verifyTextPresent SUCCEEDED."); }})'
					this_step = this_step + "\n";
				}
				if (stepaction == "sleep") { 
						this_step = '.then(function(){return $browser.sleep(' + actiontxt +  ' ); })})';					
				} 
				if (stepaction == "log") {
					    this_step = ' console.log ("' + j + ') ' + actiontxt + '");';					
				}	
				
				if ($scope.logproc == "Y") {
						this_step= this_step + '.then(function(){logProc("Step:' + j + ' ... ' + stepaction + '");})';
				}
				
				$scope.steps[i].cmd=this_step;
				$scope.steps[i].stepnum=i+1;				
							
				console.log("Step: "+$scope.steps[i].cmd+":"+this_step);				
							
			
		}
				
		$scope.gotfiles = $scope.gotfiles || false;				 
		
		console.log("simjs="+$scope.simjs+" logfile="+$scope.logfile+" Got Files:"+$scope.gotfiles);
		
		$scope.geturl = '.then(function() {   return $browser.get("' +   $scope.myurl + '"); }).then(function(){logProc("initialPageload");})';
	
		 //ONLY get fixed files once ...
		  
			 	if (! $scope.files) {	 
		 
					console.log("Get files ...");
					$http.get("top.txt").then(function(response) {
							$scope.top = response.data;			
					})
								
					$http.get("bottom.txt").then(function(response) {
							$scope.bottom = response.data;
					})
				}

				
				if ($scope.simjs == "Y") {
					$http.get("simon.txt").then(function(response) {
						//$scope.simon = response.data;
						$scope.simulator = response.data;	
				})
				} else {	
					$http.get("simoff.txt").then(function(response) {
						//$scope.simoff = response.data;
						$scope.simulator = response.data;	
				})
				}
				
				 		  
				$scope.gotfiles = true;			 	
			  		 		 		              
	}

});

 
