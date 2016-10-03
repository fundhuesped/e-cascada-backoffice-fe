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
                                  'toastr',
                                  '$state'];

    function addTurnosCanceladosController($loading, $uibModalInstance, $window, Turno, ausencia, agenda, toastr, $state) {
      var vm = this;
      vm.template = '';
      vm.agenda = agenda;
      vm.ausencia = ausencia;
      vm.count = null;
      vm.turnosCancelados = [];
      vm.dismiss = dismiss;
      vm.print = printReport;
      vm.goToTurnosToInform = goToTurnosToInform;

      activate();

      function activate(){
        var searchObject = {
            state: Turno.state.canceled,
            page_size: 1,
            page: 1,
            informed: false
        };
        if (ausencia) {
          searchObject.cancelation_reason = Turno.cancelationReason.absent;
          searchObject.day__range_start = ausencia.start_day;
          searchObject.day__range_end = ausencia.end_day;
          searchObject.profesional = ausencia.profesional.id;
        } else if (agenda) {
          searchObject.cancelation_reason = Turno.cancelationReason.agendaChanged;
          searchObject.agenda = agenda.id;
        } else {
          throw Error('No existe ausencia o agenda');
        }

        $loading.start('app');
        Turno.getPaginatedActiveList(searchObject, function(paginatedResult) {
          vm.turnosCancelados = paginatedResult.results;
          vm.turnosCount = paginatedResult.count;
          vm.template = determineTemplateToUse();
          $loading.finish('app');
        }, function(){displayComunicationError('app');});
      }


      function goToTurnosToInform(){
        dismiss();
        $state.go('turnostoinform');
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
