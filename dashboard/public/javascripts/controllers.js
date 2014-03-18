var dashboardApp=angular.module('dashboardApp');
dashboardApp.controller('HomeController', function($scope,$http){
	$scope.message="Ehh, What's up, Doc";
	$scope.users=null;
	$http.get('/home')
	.success(function(data){
		$scope.users=data;
		console.log($scope.users.length)
		console.log(JSON.stringify(data));
	})
	.error(function(data){
		console.log("Error reading data");
	});
});

dashboardApp.controller('LoginController', function($scope,$http,$location){
	$scope.message="Log in";
	$scope.user=null;
	$http.get('/patient')
	$scope.checkDetails=function(username){
		$http.get('login/'+username)
		.success(function(data){
			user=data;
			console.log(JSON.stringify(data));
			console.log(user[0].password)
			if(user[0].password==$scope.password)
			{
				console.log("THEY MATCH");
				$location.path('/home');
			}
			else
			{
				console.log("NO MATCH");
				$location.path('/login');
			}
				
		})
		.error(function(data){
			console.log('Error getting user');
		});
	};


	//find user by the username , compare their passwords and display the appropriate page 
	//according to the type of user.
});
dashboardApp.controller('PatientController', function($scope){
	$scope.message="View data for a patient";
});
dashboardApp.controller('CreateUserController',function($scope, $http){
	$scope.message="Create a user";
	$scope.userData={};
	$scope.createUser=function(){
		console.log("Creating...");
		$http.post('/createUser', $scope.userData)
		.success(function(data){
			$scope.userData={};
			console.log("USER CREATED SUCCESSFULLY");
		})
		.error(function(data){
			console.log("Error in creating user");
		});
	};
});
dashboardApp.controller('MainController', function($scope){
	$scope.message="MAIN CONTROLLER";
});
