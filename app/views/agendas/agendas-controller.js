(function () {
  'use strict';
  /* jshint validthis: true */
  /*jshint latedef: nofunc */

  function agendasCtrl($uibModal, toastr, Agenda, Profesional, $loading) {
    var vm = this;
    vm.agendas = [];
    vm.agenda = null;
    vm.detail = detail;
    vm.getProfesionales = getProfesionales;
    vm.modifyAgenda = modifyAgenda;
    vm.newAgenda = newAgenda;
    vm.searchName = searchName;
    vm.selectedProfesional = null;
    vm.changeSearchParameter = changeSearchParameter;
    vm.currentPage = 1;
    vm.pageSize = 20;
    vm.totalItems = null;

    activate();

    //Controller initialization
    function activate() {
      $loading.start('app');
      vm.statusFilter = '1';
      Agenda.getPaginatedActiveList({page_size:vm.pageSize,ordering:'profesional'}, 
        function(paginatedResult){
        vm.agendas = paginatedResult.results;
        vm.totalItems = paginatedResult.count;
        $loading.finish('app');
      },function(){displayComunicationError('app');});
    }

    function getProfesionales(firstname){
      if(firstname.length>2){
            return Profesional.getActiveList({firstName: firstname}, angular.noop, displayComunicationError).$promise;
      }
    }

    function detail(agenda) {
      vm.agenda = agenda;
      vm.startTime = vm.agenda.start.substr(0, 5);
      vm.endTime = vm.agenda.end.substr(0, 5);
    }

    function modifyAgenda(selectedAgenda) {
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
        if (result === 'modified') {
          $uibModal.open({
            templateUrl: '/views/turnos/turnos-cancelados.html',
            backdrop:'static',
            controller: 'TurnosCanceladosCtrl',
            controllerAs: 'TurnosCanceladosCtrl',
            resolve: {
                agenda: function () {
                    return vm.agenda;
                },
                ausencia: null
            }
          }).result.then(function (result) {
            toastr.success('Agenda modificada');
          });
        } else if (result === 'deleted') {
          toastr.success('Agenda eliminada');
        } else if (result === 'reactivated') {
          toastr.success('Agenda reactivada');
        }
        vm.changeSearchParameter();
      }, function () {
      });
    }

    function searchName() {
      vm.agenda = null;
      var currentStatusFilter;
      var searchObject = {
          page_size:vm.pageSize,
          page:vm.currentPage,
          order_field:'profesional',
          order_by:'asc'
      };

      if(vm.selectedProfesional){
        searchObject.profesional = vm.selectedProfesional.id;
      }

      if (vm.statusFilter == 1) {
        currentStatusFilter = 'Active';
      } else {
        if (vm.statusFilter == 3) {
          currentStatusFilter = 'Inactive';
        }
      }
      if(currentStatusFilter){
          searchObject.status = currentStatusFilter;
      }
      Agenda.queryPaginated(searchObject,
          function (paginatedResult){
              vm.agendas = paginatedResult.results;
              vm.totalItems = paginatedResult.count;
      },function(){displayComunicationError('app');});
    }

    function changeSearchParameter(){
      vm.currentPage = 1;
      vm.searchName();
    }

    function newAgenda() {
      var modalInstance = $uibModal.open({
        templateUrl: '/views/agendas/newagenda.html',
        backdrop: 'static',
        size: 'lg',
        controller: 'NewAgendaCtrl',
        controllerAs: 'NewAgendaCtrl'
      });
      modalInstance.result.then(function () {
        toastr.success('Agenda creada');
        vm.changeSearchParameter();
      }, function () {

      });
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

  angular.module('turnos.agendas').controller('AgendasCtrl', ['$uibModal', 'toastr', 'Agenda', 'Profesional', '$loading', agendasCtrl]);
})();
