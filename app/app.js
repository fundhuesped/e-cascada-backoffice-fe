'use strict';


  angular.module('turnos.app', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'turnos.turnos',
  'turnos.navbar',
  'turnos.especialidades',
  'turnos.prestaciones',
  'turnos.pacientes',
  'turnos.login'
])
  .config(function ($stateProvider, $urlRouterProvider) {
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('login', {
        url: '/login',
        views: {
          'main':  {
            templateUrl: 'views/login/login.html',
            controller:'LoginCtrl',
            controllerAs: 'LoginCtrl'
          }
        }
      })
      .state('home', {
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
      })
      .state('especialidades', {
        url: '/especialidades?detail=:especialidadId',
        views: {
          'navbar':  {
            templateUrl: 'views/navbar/navbar.html',
          },
          'main':  {
            templateUrl: 'views/especialidades/especialidades.html',
            controller:'EspecialidadesCtrl',
            controllerAs: 'EspecialidadesCtrl'
          },         
        }
      })
      .state('especialidadDetail', {
        url: '/especialidad/:especialidadId',
        views: {
          'navbar':  {
            templateUrl: 'views/navbar/navbar.html',
          },
          'main':  {
            templateUrl: 'views/especialidades/especialidad.html',
            controller:'EspecialidadCtrl',
            controllerAs: 'EspecialidadCtrl'
          }
        }
      })
      .state('prestaciones', {
        url: '/prestaciones?detail=:prestaciondId',
        views: {
          'navbar':  {
            templateUrl: 'views/navbar/navbar.html',
          },
          'main':  {
            templateUrl: 'views/prestaciones/prestaciones.html',
            controller:'PrestacionesCtrl',
            controllerAs: 'PrestacionesCtrl'
          },         
        }
      })
      .state('prestacion', {
        url: '/prestacion/:prestaciondId',
        views: {
          'navbar':  {
            templateUrl: 'views/navbar/navbar.html',
          },
          'main':  {
            templateUrl: 'views/prestaciones/prestacion.html',
            controller:'PrestacionCtrl',
            controllerAs: 'PrestacionCtrl'
          },         
        }
      })
      .state('newpaciente', {
        url: '/newpaciente',
        views: {
          'navbar':  {
            templateUrl: 'views/navbar/navbar.html',
          },
          'main':  {
            templateUrl: 'views/pacientes/newpaciente.html',
            controller:'NewPacienteCtrl',
            controllerAs: 'NewPacienteCtrl'
          },         
        }
      });
  });




