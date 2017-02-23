(function () {
  'use strict';
  /* jshint validthis: true */
  /*jshint latedef: nofunc */

  function agendaCtrl($loading, $uibModalInstance, $filter, Agenda, agenda, toastr) {
    var vm = this;

    vm.cancel = cancel;
    vm.editing = true;
    vm.errorMessage = null;
    vm.openFromDateCalendar = openFromDateCalendar;
    vm.openToDateCalendar = openToDateCalendar;
    vm.disabledForm = false;
    vm.originalAgenda = {};
    vm.fromDateCalendarPopup = {
      opened: false,
      options: {
      }
    };
    vm.toDateCalendarPopup = {
      opened: false,
      options: {
      }
    };


    vm.daysStr = [
      {
        'id': 0,
        'name': 'Lu',
        'selected': false
      },
      {
        'id': 1,
        'name': 'Ma',
        'selected': false
      },
      {
        'id': 2,
        'name': 'Mie',
        'selected': false
      },
      {
        'id': 3,
        'name': 'Jue',
        'selected': false
      },
      {
        'id': 4,
        'name': 'Vi',
        'selected': false
      },
      {
        'id': 5,
        'name': 'Sa',
        'selected': false
      },
      {
        'id': 6,
        'name': 'Do',
        'selected': false
      }
    ];

    activate();

    function activate() {
      Agenda.get({id:agenda.id}, function(returnedObject){
        vm.originalAgenda = angular.copy(returnedObject);
        vm.agenda = returnedObject;
        vm.agenda.validFrom = new Date(vm.agenda.validFrom + 'T03:00:00');
        vm.agenda.validTo = new Date(vm.agenda.validTo + 'T03:00:00');
        vm.selectedProfesionalName = vm.agenda.profesional.fatherSurname + ', ' + vm.agenda.profesional.firstName;
        vm.selectedEspecialidadName = vm.agenda.prestacion.especialidad.name;
        vm.selectedPrestacionName = vm.agenda.prestacion.name;
        vm.hoursFrom = parseInt(vm.agenda.start.substr(0, 2), 10);
        vm.minutesFrom = parseInt(vm.agenda.start.substr(3, 2), 10);
        vm.hoursTo = parseInt(vm.agenda.end.substr(0, 2), 10);
        vm.minutesTo = parseInt(vm.agenda.end.substr(3, 2), 10);
      },displayComunicationError);
    }

    vm.confirm = function confirm() {
      if (vm.agendaForm.$valid) {
        vm.hideErrorMessage();
        $loading.start('app');
          vm.agenda.validFrom = $filter('date')(vm.agenda.validFrom, 'yyyy-MM-dd');
          vm.agenda.validTo = $filter('date')(vm.agenda.validTo, 'yyyy-MM-dd');
          vm.agenda.$update(function () {
          $loading.finish('app');
          $uibModalInstance.close('modified');
        }, function(){displayComunicationError('app');}
        );
      } else {
        vm.errorMessage = 'Por favor revise el formulario';
      }
    };

    //Confirm delete modal
    vm.showModal = function showModal() {
      vm.modalStyle = {display: 'block'};
    };

    vm.confirmModal = function confirmModal() {
      vm.confirmStatusChange();
    };

    vm.dismissModal = function showModal() {
      vm.modalStyle = {};
    };
    vm.showErrorMessage = function showErrorMessage() {
      vm.errorMessage = 'Ocurio un error en la comunicación';
    };
    vm.hideErrorMessage = function hideErrorMessage() {
      vm.errorMessage = null;
    };

    vm.confirmDelete = function confirmDelete(agendaInstance) {
      agendaInstance.status = 'Inactive';
      agendaInstance.$update(function () {
        $loading.finish('app');
        $uibModalInstance.close('deleted');
      },function(){displayComunicationError('app');});
    };

    vm.confirmReactivate = function confirmReactivate(agendaInstance) {
      agendaInstance.status = 'Active';
      agendaInstance.$update(function () {
        $loading.finish('app');
        $uibModalInstance.close('reactivated');
      },function(){displayComunicationError('app');});
    };

    vm.confirmStatusChange = function confirmDelete() {
      var agendaInstance = angular.copy(vm.originalAgenda);
      agendaInstance.validFrom = $filter('date')(agendaInstance.validFrom, 'yyyy-MM-dd');
      agendaInstance.validTo = $filter('date')(agendaInstance.validTo, 'yyyy-MM-dd');
      $loading.start('app');
      if (agendaInstance.status === 'Active') {
        vm.confirmDelete(agendaInstance);
      } else {
        if (agendaInstance.status === 'Inactive') {
          vm.confirmReactivate(agendaInstance);
        }
      }
    };

    vm.changeStatus = function changeStatus() {
      vm.showModal();
    };

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

    vm.checkAllRow = function checkAllRow(period) {
      var i, j, selection;
      for (i = 0; i < vm.agenda.periods.length; i++) {
        selection = vm.agenda.periods[i];
        if (selection.id === period.id) {
          for (j = 0; j < vm.agenda.periods[i].daysOfWeek.length; j++) {
            vm.agenda.periods[i].daysOfWeek[j].selected = vm.agenda.periods[i].selected;
          }
        }
      }
    };

    vm.checkAllColumn = function checkAllColumn(day) {
      var i, j, selection;
      for (i = 0; i < vm.agenda.periods.length; i++) {
        for (j = 0; j < vm.agenda.periods[i].daysOfWeek.length; j++) {
          selection = vm.agenda.periods[i].daysOfWeek[j];
          if (selection.name.indexOf(day.name) === 0) {
            selection.selected = day.selected;
          }
        }
      }
    };

    function openFromDateCalendar() {
      vm.fromDateCalendarPopup.opened = true;
    }

    function openToDateCalendar() {
      vm.toDateCalendarPopup.opened = true;
    }

    vm.changeState = function changeState(day, period) {
      period.selected = false;
      var i, selection;
      for (i = 0; i < vm.daysStr.length; i++) {
        selection = vm.daysStr[i];
        if (selection.name.indexOf(day.day) === 0) {
          selection.selected = false;
          break;
        }
      }
    };

    function displayComunicationError(loading){
      if(!toastr.active()){
        toastr.warning('Ocurrió un error en la comunicación, por favor intente nuevamente.');
      }
      if(loading){
        $loading.finish(loading);
      }
    }
  }

  angular.module('turnos.agendas').controller('AgendaCtrl', ['$loading', '$uibModalInstance', '$filter', 'Agenda',  'agenda', 'toastr', agendaCtrl]);
})();
