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
                                  'agenda',
                                  'toastr'];

    function addTurnosCanceladosController($loading, $uibModalInstance, $window, Turno, ausencia, agenda, toastr) {
      var vm = this;
      vm.template = '';
      vm.agenda = agenda;
      vm.ausencia = ausencia;
      vm.turnosCancelados = [];
      vm.dismiss = dismiss;
      vm.print = printReport;
      var getTurnosCanceladoParams = {
        page_size: 100,
        ordering: 'day,start'
      };

      activate();

      function activate(){
        if (ausencia) {
          getTurnosCanceladoParams.ausencia = ausencia.id;
        } else if (agenda) {
          getTurnosCanceladoParams.agenda = agenda.id;
        } else {
          throw Error('No existe ausencia o agenda');
        }

        $loading.start('app');
        Turno.getCancelados(getTurnosCanceladoParams, function(turnosCancelados) {
          vm.turnosCancelados = turnosCancelados;
          vm.template = determineTemplateToUse();
          $loading.finish('app');
        }, function(){displayComunicationError('app');});
      }

      function printReport () {
        $window.print();
      }

      function dismiss (){
        $uibModalInstance.close('dismiss');
      }

      function determineTemplateToUse() {
        var template = 'turnos-cancelados-' +
          (vm.ausencia ? 'ausencia-' : 'agenda-') +
          (vm.turnosCancelados.length === 0 ? 'sin-turnos' : 'con-turnos') +
          '.html';
        return template;
      }

      function displayComunicationError(loading){
        if(!toastr.active()){
          toastr.warning('Ocurrió un error en la comunicación, por favor intente nuevamente.');
        }
        if(loading){
          $loading.finish(loading);
        }
      }
    }
  })();
