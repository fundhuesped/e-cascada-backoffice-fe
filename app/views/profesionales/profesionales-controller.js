(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */

    angular
        .module('turnos.profesionales')
        .controller('ProfesionalesCtrl',profesionalesCtrl);
        
    profesionalesCtrl.$inject = ['$uibModal',
                                 'toastr',
                                 'Profesional', 
                                 '$state',
                                 '$loading'];

    function profesionalesCtrl ($uibModal,toastr,Profesional, $state, $loading) {
        var vm = this;
        vm.profesionales = [];
        vm.profesional = null;
        vm.detail = detail;
        vm.goToAusencias = goToAusencias;
        vm.modifyProfesional = modifyProfesional;
        vm.newProfesional = newProfesional;
        vm.searchName = searchName;
        vm.pageSize = 20;
        vm.totalItems = null;
        vm.currentPage = 1;
        vm.changeSearchParameter = changeSearchParameter;
        
        activate();
        
        //Controller initialization
        function activate(){
            $loading('app');
            vm.statusFilter = '1';
            Profesional.getPaginatedActiveList({page_size:vm.pageSize,ordering:'firstName'}, function(paginatedResult){
                vm.profesionales = paginatedResult.results;
                vm.totalItems = paginatedResult.count;
                $loading.finish('app');
            },displayComunicationError('app'));
        }

        function detail(profesional){
            vm.profesional = profesional;
        }

        function goToAusencias(){
            $state.go('ausencias',{profesionalId: vm.profesional.id, profesinoal: vm.profesiona});
        }

        function modifyProfesional(selectedProfesional){
            var modalInstance = $uibModal.open({
                templateUrl: '/views/profesionales/profesional.html',
                backdrop:'static',
                controller: 'ProfesionalCtrl',
                controllerAs: 'ProfesionalCtrl',
                resolve: {
                    profesional: function () {
                        return selectedProfesional;
                    }
                }
            });
            modalInstance.result.then(function (result) {
                if(result==='modified'){
                    toastr.success('Profesional modificado');
                }else if(result==='deleted'){
                    toastr.success('Profesional eliminado');
                }else if(result==='reactivated'){
                    toastr.success('Profesional reactivado');
                }
                vm.searchName();
            }, function () {
            });
        }

        function newProfesional(){
            var modalInstance = $uibModal.open({
                templateUrl: '/views/profesionales/newprofesional.html',
                backdrop:'static',
                controller: 'NewProfesionalCtrl',
                controllerAs: 'NewProfesionalCtrl'
            });
            modalInstance.result.then(function () {
                toastr.success('Profesional creado');
                vm.searchName();
            }, function () {

            });
        }

        function changeSearchParameter() {
            vm.currentPage = 1;
            vm.searchName();
        }
        
        function searchName(){
            vm.profesional = null;
            var currentStatusFilter;
            if(vm.statusFilter==1){
                currentStatusFilter = 'Active';
            }else{
                if(vm.statusFilter==3){
                    currentStatusFilter = 'Inactive';
                }
            }

            var searchObject = {
                page_size:vm.pageSize,
                page:vm.currentPage,
                ordering:'firstName',
                firstName:vm.nameFilter
            };
            if(currentStatusFilter){
                searchObject.status = currentStatusFilter;
            }
            $loading.start('app');
            Profesional.queryPaginated(searchObject,
                function (paginatedResult){
                    vm.profesionales = paginatedResult.results;
                    vm.totalItems = paginatedResult.count;
                    $loading.finish('app');
            },displayComunicationError('app'));
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