(function () {
  'use strict';
  /* jshint validthis: true */
  /*jshint latedef: nofunc */

  function agendasCtrl($uibModal, toastr, Agenda) {
    var vm = this;
    vm.agendas = [];
    vm.agenda = null;

    activate();

    //Controller initialization
    function activate() {
      vm.statusFilter = '1';
      vm.agendas = Agenda.getActiveList();
    }

    vm.detail = function detail(agenda) {
      vm.agenda = agenda;
      vm.startTime = vm.agenda.start.substr(0, 5);
      vm.endTime = vm.agenda.end.substr(0, 5);
    };

    vm.modifyAgenda = function modifyAgenda(selectedAgenda) {
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
        vm.searchName();
      }.bind(vm), function () {
      });
    };

    vm.searchName = function searchName() {
      vm.agenda = null;
      var currentStatusFilter;
      if (vm.statusFilter == 1) {
        currentStatusFilter = 'Active';
      } else {
        if (vm.statusFilter == 3) {
          currentStatusFilter = 'Inactive';
        }
      }
      if (currentStatusFilter) {
        vm.agendas = Agenda.query({name: vm.nameFilter, status: currentStatusFilter});
      } else {
        vm.agendas = Agenda.query({name: vm.nameFilter});
      }

    };

    vm.newAgenda = function newAgenda() {
      var modalInstance = $uibModal.open({
        templateUrl: '/views/agendas/newagenda.html',
        backdrop: 'static',
        size: 'lg',
        controller: 'NewAgendaCtrl',
        controllerAs: 'NewAgendaCtrl'
      });
      modalInstance.result.then(function () {
        toastr.success('Agenda creada');
        vm.searchName();
      }, function () {

      });
    };



  }

  angular.module('turnos.agendas').controller('AgendasCtrl', ['$uibModal', 'toastr', 'Agenda', agendasCtrl]);
})();
