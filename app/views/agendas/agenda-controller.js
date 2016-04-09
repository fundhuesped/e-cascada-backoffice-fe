(function () {
  'use strict';

  function agendaCtrl($loading, $uibModalInstance, $filter, agenda) {
    this.agenda = angular.copy(agenda);
    this.editing = true;
    this.errorMessage = null;

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

    this.init = function init() {
    };
    this.init();

  }

  angular.module('turnos.agendas').controller('AgendaCtrl', ['$loading', '$uibModalInstance', '$filter', 'agenda', agendaCtrl]);
})();
