(function () {
  'use strict';

  function agendasCtrl($uibModal, toastr) {
    this.newAgenda = function newAgenda() {
      var modalInstance = $uibModal.open({
        templateUrl: '/views/agendas/newagenda.html',
        backdrop: 'static',
        controller: 'NewAgendaCtrl',
        controllerAs: 'NewAgendaCtrl'
      });
      modalInstance.result.then(function () {
        toastr.success('Agenda creada');
        this.searchName();
      }.bind(this), function () {
      });
    };
  }

  angular.module('turnos.agendas').controller('AgendasCtrl', ['$uibModal', 'toastr', agendasCtrl]);
})();
