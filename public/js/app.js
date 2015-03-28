+function() {
  var StorepostApp = angular.module('StorepostApp', ['ngResource']);

  StorepostApp.factory('ForepostList', ['$resource', function($resource) {
        return $resource('/api/list', {}, {
            query: {
                method: 'GET',
                params: {},
                isArray: true
            }
        });
    }]);

  StorepostApp.factory('NotiList', ['$resource', function($resource) {
    return $resource('/api/notify', {}, {
      query: {
        method: 'GET',
        params: {},
        isArray: true
      }
    });
  }]);

  StorepostApp.controller('ForepostCtrl', ['$scope', 'ForepostList', 'NotiList', '$http', function($scope, ForepostList, NotiList, $http) {
    $scope.foreposts = [];
    $scope.notifyers = [];
    $scope.newPost = {
      image_uri: "",
      text: "",
      price: ""
    };

    $scope.refreshNoti = function() {
      $scope.loadNoti();
    };

    $scope.save = function() {
      $http.post('/api/forepost', $scope.newPost).
        success(function(data, status, headers, config) {
          $scope.newPost = "";
          $scope.text = "";
          $scope.price = 0;
          $scope.loadForeposts();
        }).
        error(function(data, status, headers, config) {
          console.log("ERROR!!",arguments);
        });
    };

    $scope.remove = function(item) {
      $http.get('/api/remove/' + item._id).success(function() {
        $scope.foreposts.splice($scope.foreposts.indexOf(item), 1);
      });
      return false;
    };

    $scope.loadNoti = function() {
      NotiList.query(function(data) {
        $scope.notifyers = [];
        if(data.length > 0) {
          angular.forEach(data, function(item) {
            $scope.notifyers.push({
              image_uri: item.image_uri,
              user: item.instagram_name,
              create_at: new Date(item.create_at),
              confirm: item.confirm
            });
          });
        }
      });
    };

    $scope.loadForeposts = function() {
      ForepostList.query(function(data) {
        $scope.foreposts = [];
        if(data.length > 0) {
          angular.forEach(data, function(item) {
            var store = item;
            store.create_at = new Date(store.create_at);
            $scope.foreposts.push(item);
          });
        }
      });
    };

    $scope.loadForeposts();
    $scope.loadNoti();
    }]);
}();
