(function () {
  'use strict';

  function agendasCtrl($uibModal, Agenda) {
    this.agendas = [];
    this.agenda = null;

    this.detail = function detail(agenda) {
      this.agenda = agenda;
      this.startTime = '19000101T' + this.agenda.start;
      this.endTime = '19000101T' + this.agenda.end;
    };

    this.modifyAgenda = function modifyAgenda(selectedAgenda) {
      var modalInstance = $uibModal.open({
        templateUrl: '/views/agendas/agenda.html',
        backdrop: 'static',
        controller: 'AgendaCtrl',
        controllerAs: 'AgendaCtrl',
        resolve: {
          agenda: function () {
            return selectedAgenda;
          }
        }
      });
      modalInstance.result.then(function (result) {
        if (result == 'modified') {
          toastr.success('Agenda modificada');
        } else if (result == 'deleted') {
          toastr.success('Agenda eliminada');
        } else if (result == 'reactivated') {
          toastr.success('Agenda reactivada');
        }
        this.searchName();
      }.bind(this), function () {
      });
    };

    this.searchName = function searchName() {
      this.agenda = null;
      var currentStatusFilter;
      if (this.statusFilter == 1) {
        currentStatusFilter = 'Active';
      } else {
        if (this.statusFilter == 3) {
          currentStatusFilter = 'Inactive';
        }
      }
      if (currentStatusFilter) {
        this.agendas = Agenda.query({name: this.nameFilter, status: currentStatusFilter});

      } else {
        this.agendas = Agenda.query({name: this.nameFilter});
      }

    };

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

    //Controller initialization
    this.init = function init() {
      this.statusFilter = "1";
      this.searchName();
    };
    this.init();

  }

  angular.module('turnos.agendas').controller('AgendasCtrl', ['$uibModal', 'Agenda', agendasCtrl]);
})();
