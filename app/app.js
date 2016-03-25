'use strict';


  angular.module('turnos.app', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'turnos.turnos',
  'turnos.navbar',
  'turnos.especialidades',
  'turnos.prestaciones',
  'turnos.pacientes',
  'turnos.login',
  'turnos.resources',
  'darthwade.dwLoading',
  'toastr'
])
  .config(function ($stateProvider, $urlRouterProvider,$resourceProvider) {
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $resourceProvider.defaults.stripTrailingSlashes = false;
    
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
      .state('newturno', {
        url: '/newturno',
        views: {
          'navbar':  {
            templateUrl: 'views/navbar/navbar.html',
          },
          'main':  {
            templateUrl: 'views/turnos/newturno.html',
            controller:'NewTurnoController',
            controllerAs: 'NewTurnoCtrl'
          },         
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
      .state('newespecialidad', {
        url: '/newespecialidad',
        views: {
          'navbar':  {
            templateUrl: 'views/navbar/navbar.html',
          },
          'main':  {
            templateUrl: 'views/especialidades/newespecialidad.html',
            controller:'NewEspecialidadCtrl',
            controllerAs: 'NewEspecialidadCtrl'
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
      .state('pacientes', {
        url: '/pacientes?detail=:pacienteId',
        views: {
          'navbar':  {
            templateUrl: 'views/navbar/navbar.html',
          },
          'main':  {
            templateUrl: 'views/pacientes/pacientes.html',
            controller:'PacientesCtrl',
            controllerAs: 'PacientesCtrl'
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
      })
      .state('paciente', {
        url: '/paciente/:pacienteId',
        views: {
          'navbar':  {
            templateUrl: 'views/navbar/navbar.html',
          },
          'main':  {
            templateUrl: 'views/pacientes/paciente.html',
            controller:'PacienteCtrl',
            controllerAs: 'PacienteCtrl'
          },         
        }
      });
  });




