angular.module('app', ['ngRoute', 'btford.socket-io'])
  .config(['$routeProvider', function($routeProvider) {
     $routeProvider
       .when('/', {
       	    templateUrl: '/html/home.html',
       	    controller: 'AppController'
       })
       .when('/logs', {
            templateUrl: '/html/logs.html',
            controller: 'AppController'
       });
  }])

angular.module('app').factory('socketService', function (socketFactory) {
  var socket = io.connect('http://localhost:8080');
  var socketObject =  socketFactory({
    ioSocket: socket
  });
  socketObject.forward(['fileChanged', 'fileRenamed', 'error']);
  return socketObject;
});

angular.module('app').controller('AppController', ['$scope', 'socketService', function($scope, socketService){
    $scope.data = [];

    $scope.$on('socket:error', function (event, data) {
       $scope.data.push(data.matter);
       console.log("error data => ", data);
    });

    $scope.$on('socket:fileChanged', function (event, data) {
       $scope.data.push(data.matter);
       console.log("fileChanged data => ", data);
    });
}]);