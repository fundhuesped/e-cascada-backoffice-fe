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
      if (!ausencia && !agenda) {
        throw Error('No existe ausencia o agenda');
      }

      var vm = this;
      vm.template = '';
      vm.agenda = agenda;
      vm.ausencia = ausencia;
      vm.turnosCancelados = [];

      $loading.start('app');
      Turno.getCancelados({ausencia: ausencia.id, page_size:100, ordering:'day,start'}, function(turnosCancelados) {
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
