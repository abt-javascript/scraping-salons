(function () {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$state', 'Authentication', 'menuService', '$mdSidenav'];

  function HeaderController($scope, $state, Authentication, menuService, $mdSidenav) {
    var vm = this;

    $scope.toggleSidenav = function(menuId) {
      console.log(menuId);
      $mdSidenav(menuId).toggle();
    };

    var list = [];
    for (var i = 0; i < 100; i++) {
      list.push({
        name: 'List Item ' + i,
        idx: i
      });
    }

    $scope.list = list;

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = Authentication;
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeSuccess() {
      // Collapsing the menu after navigation
      vm.isCollapsed = false;
    }
  }
}());
