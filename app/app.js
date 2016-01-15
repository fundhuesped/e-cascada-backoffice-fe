'use strict';


  angular.module('turnos.app', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'turnos.main',
  'turnos.navbar'
])
  .config(function ($stateProvider, $urlRouterProvider) {
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('index', {
        url: '/',
        templateUrl: 'views/main.html',
        controller:'MainCtrl',
        views: {
          'navbar':  {
            templateUrl: 'views/navbar/navbar.html',
          },
          'main':  {
            templateUrl: 'views/main/main.html',
          }
        }
      });
  });




