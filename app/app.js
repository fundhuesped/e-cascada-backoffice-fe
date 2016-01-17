'use strict';


  angular.module('turnos.app', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'turnos.turnos',
  'turnos.navbar'
])
  .config(function ($stateProvider, $urlRouterProvider) {
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('index', {
        url: '/',
        views: {
          'navbar':  {
            templateUrl: 'views/navbar/navbar.html',
          },
          'main':  {
            templateUrl: 'views/turnos/turnos.html',
            controller:'TurnosCtrl',
            controllerAs: 'TurnosCtrl'
          }
        }
      });
  });




