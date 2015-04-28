angular.module('MyApp', [
  'btford.socket-io'
]).controller('MasterCtrl', function($scope, mySocket) {
  var socket = mySocket;
  $scope.sendMessage = function(mes) {
    socket.emit('chat message', mes);
  };
  $scope.messages = [];
  var count = 0;
  socket.on('chat message', function(mes) {
    $scope.messages.push({id: ++count, data: mes});
    $scope.$apply();
  });
});
