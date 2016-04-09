(function () {
  'use strict';

  function agendaCtrl($loading, $uibModalInstance, $filter, agenda) {
    this.agenda = angular.copy(agenda);
    this.editing = true;
    this.errorMessage = null;
    this.daysStr = [{
      "id": 1,
      "name": "Lu",
      "selected": false
    },
      {
        "id": 2,
        "name": "Ma",
        "selected": false
      },
      {
        "id": 3,
        "name": "Mie",
        "selected": false
      },
      {
        "id": 4,
        "name": "Jue",
        "selected": false
      },
      {
        "id": 5,
        "name": "Vi",
        "selected": false
      },
      {
        "id": 6,
        "name": "Sa",
        "selected": false
      },
      {
        "id": 7,
        "name": "Do",
        "selected": false
      }
    ];

    this.confirm = function confirm() {
      if (this.agendaForm.$valid) {
        this.hideErrorMessage();
        $loading.start('app');
        this.agenda.birthDate = $filter('date')(this.agenda.birthDate, "yyyy-MM-dd");
        this.agenda.$update(function () {
          $loading.finish('app');
          $uibModalInstance.close('modified');
        }, function () {
          this.showErrorMessage();
        });
      } else {
        this.errorMessage = 'Por favor revise el formulario';
      }
    };

    //Confirm delete modal
    this.showModal = function showModal() {
      this.modalStyle = {display: 'block'};
    };

    this.confirmModal = function confirmModal() {
      this.confirmStatusChange();
    };

    this.dismissModal = function showModal() {
      this.modalStyle = {};
    };
    this.showErrorMessage = function showErrorMessage() {
      this.errorMessage = 'Ocurio un error en la comunicación';
    };
    this.hideErrorMessage = function hideErrorMessage() {
      this.errorMessage = null;
    };

    this.confirmDelete = function confirmDelete(agendaInstance) {
      agendaInstance.status = 'Inactive';
      agendaInstance.$update(function () {
        $loading.finish('app');
        $uibModalInstance.close('deleted');
      }, function () {
        $loading.finish('app');
        $uibModalInstance.close('deleted');
      });
    }

    this.confirmReactivate = function confirmReactivate(agendaInstance) {
      agendaInstance.status = 'Active';
      agendaInstance.$update(function () {
        $loading.finish('app');
        $uibModalInstance.close('reactivated');
      }, function () {
        $loading.finish('app');
        $uibModalInstance.close('reactivated');
      });
    }

    this.confirmStatusChange = function confirmDelete() {
      var agendaInstance = angular.copy(agenda);
      $loading.start('app');
      if (agendaInstance.status == 'Active') {
        this.confirmDelete(agendaInstance);
      } else {
        if (agendaInstance.status == 'Inactive') {
          this.confirmReactivate(agendaInstance);
        }
      }
    };

    this.changeStatus = function changeStatus() {
      this.showModal();
    };

    this.cancel = function cancel() {
      $uibModalInstance.dismiss('cancel');
    };

    this.checkAllRow = function checkAllRow(period) {
      var i, j, selection;
      for (i = 0; i < this.agenda.periods.length; i++) {
        selection = this.agenda.periods[i];
        if (selection.id === period.id) {
          for (j = 0; j < this.agenda.periods[i].daysOfWeek.length; j++) {
            this.agenda.periods[i].daysOfWeek[j].selected = this.agenda.periods[i].selected;
          }
        }
      }
    };

    this.checkAllColumn = function checkAllColumn(day) {
      var i, j, selection;
      for (i = 0; i < this.agenda.periods.length; i++) {
        for (j = 0; j < this.agenda.periods[i].daysOfWeek.length; j++) {
          selection = this.agenda.periods[i].daysOfWeek[j];
          if (selection.name.indexOf(day.name) == 0) {
            selection.selected = day.selected;
          }
        }
      }
    };

    this.changeState = function changeState(day, period) {
      period.selected = false;
      var i, selection;
      for (i = 0; i < this.daysStr.length; i++) {
        selection = this.daysStr[i];
        if (selection.name.indexOf(day.day) == 0) {
          selection.selected = false;
          break;
        }
      }
    };

    this.init = function init() {
      this.selectedProfesionalName = this.agenda.profesional.fatherSurname + ', ' + this.agenda.profesional.firstName;
      this.selectedEspecialidadName = this.agenda.prestacion.especialidad.name;
      this.selectedPrestacionName = this.agenda.prestacion.name;
      this.hoursFrom = parseInt(this.agenda.start.substr(0, 2), 10);
      this.minutesFrom = parseInt(this.agenda.start.substr(3, 2), 10);
      this.hoursTo = parseInt(this.agenda.end.substr(0, 2), 10);
      this.minutesTo = parseInt(this.agenda.end.substr(3, 2), 10);
    };

    this.init();
  }

  angular.module('turnos.agendas').controller('AgendaCtrl', ['$loading', '$uibModalInstance', '$filter', 'agenda', agendaCtrl]);
})();
