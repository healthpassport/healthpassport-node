google.load('visualization', '1.1', {packages: ['corechart', 'controls']});
google.setOnLoadCallback(function () {
  angular.bootstrap(document.body, ['chartApp']);
  console.log("LOADING");
});

var chartApp=angular.module('chartApp',['ngRoute', 'healthpass.factories']);

chartApp.config(function($routeProvider) {
  $routeProvider
  .when('/', { templateUrl: '/app/healthdash/views/dashboard.html', controller:"DashboardController" })
  .when('/patients/:patientId',{templateUrl:'/app/healthdash/views/patientDetails.html', controller: "PatientController"})
  .when('/admin',{templateUrl: '/app/healthdash/views/admin.html', controller: "AdminController"})

});
chartApp.controller('DashboardController', function($scope, $location, User) {
  console.log("DASHBOARD IS HERE");
  $scope.user=null;
  $scope.users=null;

  User.getUsers().then(function(users){
    console.log("users",users[0].name);
    $scope.users=users;
  });
  
  $scope.showTabs=false;
  
  $scope.showPatientDetails=function(id){
    console.log("SHOWING INFO ABOUT PATIENT "+id);
    $scope.showTabs=true;
    $scope.user=$scope.users[0];// USER SHOULD BE EQUAL TO THE SELECTED USER FROM MENU
    //$location.path('/patients/'+id);
  };

  $scope.showHealthData=function(id){
    console.log("SHOWING HealthData FOR USER "+id);
    //$location.path(/passport/);
  };

  $scope.showLikesDislikes=function(id){
    console.log("SHOWING Likes/Dislikes FOR USER "+id);
  };

  $scope.showEmotions=function(id){
    console.log("SHOWING Emotions FOR USER "+id);
  };
});

chartApp.controller('PatientController', function($scope, $routeParams, User){
  console.log($routeParams.patientId);
  User.get($routeParams.patientId).then(function(user){
    console.log("user",user.name);
  });
});

chartApp.controller('AdminController', function($scope){
  console.log("HELLO Admin");
});
chartApp.controller('ChartController',function($scope,$http) {
  $scope.emotionData=[{type:1,location:'1,1', date: new Date(2014,2,3,13,49,24)}];
 
  var dashboard = new google.visualization.Dashboard(
    document.getElementById('dashboard')
  );
    
  var control = new google.visualization.ControlWrapper({
    'controlType': 'ChartRangeFilter',
    'containerId': 'control',
    'options': {
      // Filter by the date axis.
      'filterColumnIndex': 0,
      'ui': {
        'chartType': 'ComboChart',
        'chartOptions': {
          'chartArea': {'width': '75 %'},
          'hAxis': {'baselineColor': 'none'}
        },
        // Display a single series that shows the emotions.
        // Thus, this view has two columns: the date (axis) and the emotion value (line series).
        'chartView': {
          'columns': [0,1]
        },
        // 1 day in milliseconds = 24 * 60 * 60 * 1000 = 86,400,000
        'minRangeSize': 3600000
      }
    },
    // Initial range: 2012-02-09 to 2012-03-20.
    'state': {'range': {'start': new Date(2011, 1, 9), 'end': new Date(2015, 2, 20)}}
  });
    
  var chart = new google.visualization.ChartWrapper({
    'chartType': 'LineChart',
    'containerId': 'chart_div',
    'options': {
      // Use the same chart area width as the control for axis alignment.
      'chartArea': {'height': '75%', 'width': '75%'},
      'hAxis': {'slantedText': false},
      'vAxis': {'viewWindow': {'min': 0, 'max': 3}, 'gridlines': {'count': 4,'color' : 'none'}, 'format':'#'},
      'legend': {'position': 'right'}
    }
  });
  readData($scope.emotionData);
  var data = new google.visualization.DataTable();
  data.addColumn('datetime', 'Date');
  data.addColumn('number', 'Emotion');
  data.addColumn({type:'string', role:'tooltip'});
  for(var i=0;i<$scope.emotionData.length;i++)
  {
    var date=$scope.emotionData[i].date;
    var emotion=$scope.emotionData[i].type;
    var location=$scope.emotionData[i].location;
    var tooltip=$scope.emotionData[i].date.toUTCString().replace(" GMT",";")+" Location: "+location;
    data.addRow([date,emotion,tooltip]);
  }
  // var emotion=1;
  // for (var day = 1; day < 12; day++) {
    //   emotion=day%4;
    //   var date = new Date(2012, 1 ,day,13,40,24);
    //   data.addRow([date, emotion, "Emotion/Location"]);
    //}
    
  dashboard.bind(control, chart);

  dashboard.draw(data);
  google.visualization.events.addListener(dashboard, 'ready', onReady);
  function onReady() {
    changeLabels();
  }
  function readData(emotionData){//random data - similar from database
    for(var i=0;i<30;i++){
      var data={};
      if(i%3==0){
        data.type=3;
      }
      if(i%3==1){
        data.type=2;
      }
      if(i%3==2){
        data.type=1;
      }
      data.location=''+i+' ,'+i;
      data.date=new Date(2014,3,3,i,0,0);
      emotionData.push(data);
    }
  }
   
  function changeLabels(){
    $('#chart_div svg text[text-anchor="end"]:contains("3")').text("Happy");
    $('#chart_div svg text[text-anchor="end"]:contains("2")').text("Sad");
    $('#chart_div svg text[text-anchor="end"]:contains("1")').text("Pain");
    $('#chart_div svg text[text-anchor="end"]:contains("0")').text("No Emotion");

  }
  $scope.testData= function(){
    readData($scope.emotionData);
    displayArray($scope.emotionData);
  }
  function displayArray(emotionData){
    for (var i = 0; i < emotionData.length; i++) {
      console.log(emotionData[i].type+" ;"+ emotionData[i].location+ "; "+emotionData[i].date.toUTCString());
    }
  }
  $scope.displayDate=function(date){
    var desiredDate=new Date(date);
    console.log(desiredDate.getYear());
    console.log(desiredDate.getMonth());
    console.log("Here" + desiredDate);
  };
});
chartApp.controller('MainController', function($scope, $http){
  $scope.message="MAIN CONTROLLER";
  $scope.bigArray=new Array([]);
  // $scope.url="test.json";
  // $scope.dataG=new Array([]);
  // $http.get($scope.url)
  // .success(function(data){
    //   console.log(JSON.stringify(data));
    // }).
    // error(function(data){
      //   console.log("Error" + JSON.stringify(data));
      // });
      // var record=[1,23,3];
      // $scope.bigArray.push(record);
      // console.log($scope.bigArray);
});