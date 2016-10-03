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
        'turnos.profesionales',
        'turnos.agendas',
        'turnos.login',
        'turnos.resources',
        'darthwade.dwLoading',
        'toastr',
        'date-dropdowns',
        'LocalStorageModule',
        'angularMoment'
    ])
    .config(function ($stateProvider, $urlRouterProvider, $resourceProvider) {
        $resourceProvider.defaults.stripTrailingSlashes = false;

        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('login', {
                url: '/login',
                views: {
                    'main': {
                        templateUrl: 'views/login/login.html',
                        controller: 'LoginCtrl',
                        controllerAs: 'LoginCtrl'
                    }
                }
            })
            .state('home', {
                url: '/',
                views: {
                    'navbar': {
                        templateUrl: 'views/navbar/navbar.html',
                        controller: 'NavbarCtrl',
                        controllerAs: 'NavbarCtrl'
                    },
                    'main': {
                        templateUrl: 'views/turnos/newturno.html',
                        controller: 'NewTurnoCtrl',
                        controllerAs: 'NewTurnoCtrl'
                    },
                }
            })
            .state('turnosCalendar', {
                url: '/turnosCalendar',
                views: {
                    'navbar': {
                        templateUrl: 'views/navbar/navbar.html',
                        controller: 'NavbarCtrl',
                        controllerAs: 'NavbarCtrl'
                    },
                    'main': {
                        templateUrl: 'views/turnos/turnos.html',
                        controller: 'TurnosCtrl',
                        controllerAs: 'TurnosCtrl'
                    }
                }
            })
            .state('newturno', {
                url: '/newturno',
                views: {
                    'navbar': {
                        templateUrl: 'views/navbar/navbar.html',
                        controller: 'NavbarCtrl',
                        controllerAs: 'NavbarCtrl'
                    },
                    'main': {
                        templateUrl: 'views/turnos/newturno.html',
                        controller: 'NewTurnoCtrl',
                        controllerAs: 'NewTurnoCtrl'
                    },
                }
            })
            .state('especialidades', {
                url: '/especialidades?detail=:especialidadId',
                views: {
                    'navbar': {
                        templateUrl: 'views/navbar/navbar.html',
                        controller: 'NavbarCtrl',
                        controllerAs: 'NavbarCtrl'
                    },
                    'main': {
                        templateUrl: 'views/especialidades/especialidades.html',
                        controller: 'EspecialidadesCtrl',
                        controllerAs: 'EspecialidadesCtrl'
                    },
                }
            })
            .state('turnostoinform', {
                url: '/turnostoinform',
                views: {
                    'navbar': {
                        templateUrl: 'views/navbar/navbar.html',
                        controller: 'NavbarCtrl',
                        controllerAs: 'NavbarCtrl'
                    },
                    'main': {
                        templateUrl: 'views/turnos/turnostoinform.html',
                        controller: 'TurnosToInformCtrl',
                        controllerAs: 'TurnosToInformCtrl'
                    },
                }
            })
            .state('newespecialidad', {
                url: '/newespecialidad',
                views: {
                    'navbar': {
                        templateUrl: 'views/navbar/navbar.html',
                        controller: 'NavbarCtrl',
                        controllerAs: 'NavbarCtrl'
                    },
                    'main': {
                        templateUrl: 'views/especialidades/newespecialidad.html',
                        controller: 'NewEspecialidadCtrl',
                        controllerAs: 'NewEspecialidadCtrl'
                    },
                }
            })
            .state('especialidadDetail', {
                url: '/especialidad/:especialidadId',
                views: {
                    'navbar': {
                        templateUrl: 'views/navbar/navbar.html',
                        controller: 'NavbarCtrl',
                        controllerAs: 'NavbarCtrl'
                    },
                    'main': {
                        templateUrl: 'views/especialidades/especialidad.html',
                        controller: 'EspecialidadCtrl',
                        controllerAs: 'EspecialidadCtrl'
                    }
                }
            })
            .state('prestaciones', {
                url: '/prestaciones?detail=:prestaciondId',
                views: {
                    'navbar': {
                        templateUrl: 'views/navbar/navbar.html',
                        controller: 'NavbarCtrl',
                        controllerAs: 'NavbarCtrl'
                    },
                    'main': {
                        templateUrl: 'views/prestaciones/prestaciones.html',
                        controller: 'PrestacionesCtrl',
                        controllerAs: 'PrestacionesCtrl'
                    },
                }
            })
            .state('prestacion', {
                url: '/prestacion/:prestaciondId',
                views: {
                    'navbar': {
                        templateUrl: 'views/navbar/navbar.html',
                        controller: 'NavbarCtrl',
                        controllerAs: 'NavbarCtrl'
                    },
                    'main': {
                        templateUrl: 'views/prestaciones/prestacion.html',
                        controller: 'PrestacionCtrl',
                        controllerAs: 'PrestacionCtrl'
                    },
                }
            })
            .state('pacientes', {
                url: '/pacientes?detail=:pacienteId',
                views: {
                    'navbar': {
                        templateUrl: 'views/navbar/navbar.html',
                        controller: 'NavbarCtrl',
                        controllerAs: 'NavbarCtrl'
                    },
                    'main': {
                        templateUrl: 'views/pacientes/pacientes.html',
                        controller: 'PacientesCtrl',
                        controllerAs: 'PacientesCtrl'
                    },
                }
            })
            .state('newpaciente', {
                url: '/newpaciente',
                views: {
                    'navbar': {
                        templateUrl: 'views/navbar/navbar.html',
                        controller: 'NavbarCtrl',
                        controllerAs: 'NavbarCtrl'
                    },
                    'main': {
                        templateUrl: 'views/pacientes/newpaciente.html',
                        controller: 'NewPacienteCtrl',
                        controllerAs: 'NewPacienteCtrl'
                    },
                }
            })
            .state('paciente', {
                url: '/paciente/:pacienteId',
                views: {
                    'navbar': {
                        templateUrl: 'views/navbar/navbar.html',
                        controller: 'NavbarCtrl',
                        controllerAs: 'NavbarCtrl'
                    },
                    'main': {
                        templateUrl: 'views/pacientes/paciente.html',
                        controller: 'PacienteCtrl',
                        controllerAs: 'PacienteCtrl'
                    },
                }
            })
            .state('profesionales', {
                url: '/profesionales?detail=:profesionalId',
                views: {
                    'navbar': {
                        templateUrl: 'views/navbar/navbar.html',
                        controller: 'NavbarCtrl',
                        controllerAs: 'NavbarCtrl'
                    },
                    'main': {
                        templateUrl: 'views/profesionales/profesionales.html',
                        controller: 'ProfesionalesCtrl',
                        controllerAs: 'ProfesionalesCtrl'
                    },
                }
            })
            .state('newprofesional', {
                url: '/newprofesional',
                views: {
                    'navbar': {
                        templateUrl: 'views/navbar/navbar.html',
                        controller: 'NavbarCtrl',
                        controllerAs: 'NavbarCtrl'
                    },
                    'main': {
                        templateUrl: 'views/profesionales/newprofesional.html',
                        controller: 'NewProfesionalCtrl',
                        controllerAs: 'NewProfesionalCtrl'
                    },
                }
            })
            .state('profesional', {
                url: '/profesional/:profesionalId',
                views: {
                    'navbar': {
                        templateUrl: 'views/navbar/navbar.html',
                        controller: 'NavbarCtrl',
                        controllerAs: 'NavbarCtrl'
                    },
                    'main': {
                        templateUrl: 'views/profesionales/profesional.html',
                        controller: 'ProfesionalCtrl',
                        controllerAs: 'ProfesionalCtrl'
                    },
                }
            })
            .state('agendas', {
                url: '/agendas?detail=:agendaId',
                views: {
                    'navbar': {
                        templateUrl: 'views/navbar/navbar.html',
                        controller: 'NavbarCtrl',
                        controllerAs: 'NavbarCtrl'
                    },
                    'main': {
                        templateUrl: 'views/agendas/agendas.html',
                        controller: 'AgendasCtrl',
                        controllerAs: 'AgendasCtrl'
                    },
                }
            })
            .state('ausencias', {
                url: '/profesional/:profesionalId/ausencias/',
                views: {
                    'navbar': {
                        templateUrl: 'views/navbar/navbar.html',
                        controller: 'NavbarCtrl',
                        controllerAs: 'NavbarCtrl'
                    },

                    'main': {
                        templateUrl: 'views/profesionales/ausencias.html',
                        controller: 'AusenciasCtrl',
                        controllerAs: 'AusenciasCtrl'
                    },
                }
            })
            .state('profesionalTurnos', {
                url: '/profesional/:profesionalId/turnos/',
                views: {
                    'navbar': {
                        templateUrl: 'views/navbar/navbar.html',
                        controller: 'NavbarCtrl',
                        controllerAs: 'NavbarCtrl'
                    },

                    'main': {
                        templateUrl: 'views/profesionales/profesional-turnos.html',
                        controller: 'TurnosProfesionalCtrl',
                        controllerAs: 'TurnosProfesionalCtrl'
                    },
                }
            })
            .state('newagenda', {
              url: '/newagenda',
              views: {
                'navbar': {
                  templateUrl: 'views/navbar/navbar.html',
                },
                'main': {
                  templateUrl: 'views/agendas/newagenda.html',
                  controller: 'NewAgendaCtrl',
                  controllerAs: 'NewAgendaCtrl'
                },
              }
            })
        ;
    });




