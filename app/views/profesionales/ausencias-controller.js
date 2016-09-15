(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */

    angular
        .module('turnos.profesionales')
        .controller('AusenciasCtrl',ausenciasCtrl);

    ausenciasCtrl.$inject = ['$uibModal',
                                 'toastr',
                                 'Leave',
                                 '$stateParams',
                                 'Profesional'];

    function ausenciasCtrl ($uibModal, toastr, Leave, $stateParams, Profesional) {
        var vm = this;
        vm.addLeave = addLeave;
        vm.ausencias = [];
        vm.changeSearchParameter = changeSearchParameter;
        vm.pageSize = 20;
        vm.profesional = {};
        vm.searchAusencias = searchAusencias;
        vm.totalItems = null;
        vm.currentPage = 1;

        activate();

        //Controller initialization
        function activate(){
            searchAusencias();
            if($stateParams.profesional){
              vm.profesional= $stateParams.profesional;
            }else{
              vm.profesional = Profesional.get({id:$stateParams.profesionalId});
            }
        }

        function searchAusencias(){
            Leave.getPaginatedActiveList({page_size:vm.pageSize,ordering:'-start_day', profesional:$stateParams.profesionalId, page:vm.currentPage}, function(paginatedResult){
                vm.ausencias = paginatedResult.results;
                vm.totalItems = paginatedResult.count;
            });
        }

        function changeSearchParameter() {
            vm.currentPage = 1;
            vm.searchAusencias();
        }

        function addLeave(){
            var modalInstance = $uibModal.open({
                templateUrl: '/views/profesionales/addleave.html',
                backdrop:'static',
                controller: 'AddLeaveCtrl',
                controllerAs: 'AddLeaveCtrl',
                resolve: {
                    profesional: function () {
                        return vm.profesional;
                    }
                }
            });
            var ctrl = vm;
            modalInstance.result.then(function (result) {
                if(result){
                    $uibModal.open({
                      templateUrl: '/views/turnos/turnos-cancelados.html',
                      backdrop:'static',
                      controller: 'TurnosCanceladosCtrl',
                      controllerAs: 'TurnosCanceladosCtrl',
                      resolve: {
                          ausencia: function () {
                              return result;
                          },
                          agenda: null
                      }
                    }).result.then(function (result) {
                      toastr.success('Ausencia cargada');
                      ctrl.changeSearchParameter();
                    });
                }
            }, function () {
            });
        }
    }
})();