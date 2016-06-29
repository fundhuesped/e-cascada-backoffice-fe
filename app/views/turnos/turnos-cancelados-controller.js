(function () {
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */
    angular
        .module('turnos.turnos')
        .controller('TurnosCanceladosCtrl',addTurnosCanceladosController);

    addTurnosCanceladosController.$inject = ['$loading',
                                  '$uibModalInstance',
                                  '$window',
                                  'Turno',
                                  'ausencia',
                                  'agenda'];

    function addTurnosCanceladosController($loading, $uibModalInstance, $window, Turno, ausencia, agenda) {
      var getTurnosCanceladoParams = {
        page_size:100,
        ordering:'day,start'
      }

      if (ausencia) {
        getTurnosCanceladoParams.ausencia = ausencia.id
      } else if (agenda) {
        getTurnosCanceladoParams.agenda = agenda.id
      } else {
        throw Error('No existe ausencia o agenda');
      }

      var vm = this;
      vm.template = '';
      vm.agenda = agenda;
      vm.ausencia = ausencia;
      vm.turnosCancelados = [];

      $loading.start('app');
      Turno.getCancelados(getTurnosCanceladoParams, function(turnosCancelados) {
        vm.turnosCancelados = turnosCancelados;
        vm.template = determineTemplateToUse();
        $loading.finish('app');
      });

      vm.print = function() {
        $window.print();
      }

      vm.dismiss = function dismiss (){
          $uibModalInstance.close('dismiss');
      }

      function determineTemplateToUse() {
        var template = 'turnos-cancelados-' +
          (vm.ausencia ? 'ausencia-' : 'agenda-') +
          (vm.turnosCancelados.length == 0 ? 'sin-turnos' : 'con-turnos') +
          '.html';

        return template;
      }
    }
  })();
