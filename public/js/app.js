//This file contains all of the anugular code required for the app

//Bootstrapping the angular app
angular.module('app', ['ngRoute', 'ui-notification', 'btford.socket-io', 'luegg.directives'])
  .config(['$routeProvider', 'NotificationProvider', function($routeProvider, NotificationProvider) {
     NotificationProvider.setOptions({
        delay: 10000,
        // startTop: 20,
        // startRight: 300,
        verticalSpacing: 20,
        horizontalSpacing: 20,
        positionX: 'center',
        positionY: 'top'
     });

     $routeProvider
       .when('/', {
       	    templateUrl: '/html/home.html',
       	    controller: 'AppController'
       })
       .when('/logs', {
            templateUrl: '/html/logs.html',
            controller: 'AppController'
       });
  }]);


//Create a service for socket handling with angular
angular.module('app').factory('socketService', function (socketFactory) {
  var socket = io.connect('http://localhost:8080');
  var socketObject =  socketFactory({
    ioSocket: socket
  });
  //list out the events which you want to delegate to the $scope of angular
  socketObject.forward(['fileChanged', 'watchBegins', 'watchEnds', 'fileNotFound', 'error']);
  return socketObject;
});


//Create a controller for our app
angular.module('app').controller('AppController', ['$scope', '$location', 'socketService', 'Notification', function($scope, $location, socketService, Notification){
    $scope.data = [];

    var qparams = $location.search();
    if(qparams && qparams.file){
      $scope.fileName = decodeURIComponent(qparams.file);
    }

    //Will get invoked whenever some error occurs on backend
    $scope.$on('socket:error', function (event, data) {
       Notification.error('Some unexpected error occurred. Try reloading the page.');
       //$scope.data.push(data);
    });

    //Will get invoked when specified file is not found on path
    $scope.$on('socket:fileNotFound', function (event, data) {
       Notification.error(data.matter);
    });

    //Will get invoked whenever some changes occurs on the file being watched 
    $scope.$on('socket:fileChanged', function (event, data) {
       $scope.data.push(data);
    });

    //Will get invoked when the watching starts for a file
    $scope.$on('socket:watchBegins', function (event, data){
       $location.search('file', encodeURIComponent($scope.fileName));
       $location.path('/logs');
    });

    //Will get invoked when the watch ends for a file
    $scope.$on('socket:watchEnds', function (event, data){
       $location.url('/')
    });

    //Function to let the server know that user wants to start watching a particular file
    $scope.startWatching = function() {
      if($scope.fileName && $scope.fileName!=='') {
        socketService.emit('watchFile', $scope.fileName)
      }
      else {
        Notification.error("Please enter a file name first");
      }
    }

    //Function to let the server know that user wants to stop watching a particular file
    $scope.stopWatching = function() {
      socketService.emit('unWatchFile', $scope.fileName)
    }
}]);