angular.module('MyApp', [
  'btford.socket-io'
]).controller('MasterCtrl', function($scope, mySocket, $http) {
  var token = null;
  $scope.messages = [];
  var count = 0;

  $scope.connect = function (name) {
    var data = {
      name: name
    };
    $http.post('/login', data).then(function (result) {
      $scope.token = result.data;
      console.log($scope.token);
      $scope.socket = io('', {'query': 'token=' + $scope.token.token});
      $scope.socket.on('connect', function () {
        console.log('Connected to server');
        $scope.$emit('connect');
      }).on('error', function (mes) {
        console.log('Error:', mes);
      }).on('chat message', function(mes) {
        $scope.messages.push({name: mes.name, data: mes.mes});
        $scope.$apply();
      });
    }, function (result) {
      console.log(result);
    });
  };
  $scope.sendMessage = function(mes) {
    $scope.socket.emit('chat message', mes);
  };
  $scope.$on('connect', function() {
    $scope.connected = true;
    $scope.$apply();
  });
});
