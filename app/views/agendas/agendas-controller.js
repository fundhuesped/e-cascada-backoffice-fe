(function () {
  'use strict';
  /* jshint validthis: true */
  /*jshint latedef: nofunc */

  function agendasCtrl($uibModal, toastr, Agenda) {
    this.agendas = [];
    this.agenda = null;

    this.detail = function detail(agenda) {
      this.agenda = agenda;
      this.startTime = this.agenda.start.substr(0, 5);
      this.endTime = this.agenda.end.substr(0, 5);
    };

    this.modifyAgenda = function modifyAgenda(selectedAgenda) {
      var modalInstance = $uibModal.open({
        templateUrl: '/views/agendas/agenda.html',
        backdrop: 'static',
        controller: 'AgendaCtrl',
        controllerAs: 'AgendaCtrl',
        size: 'lg',
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
        this.agendasDataSet = Agenda.query({name: this.nameFilter, status: currentStatusFilter});
      } else {
        this.agendasDataSet = Agenda.query({name: this.nameFilter},function(result){
          this.agendas = result.results;
          }.bind(this));
      }

    };

    this.newAgenda = function newAgenda() {
      var modalInstance = $uibModal.open({
        templateUrl: '/views/agendas/newagenda.html',
        backdrop: 'static',
        size: 'lg',
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

  angular.module('turnos.agendas').controller('AgendasCtrl', ['$uibModal', 'toastr', 'Agenda', agendasCtrl]);
})();
