(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
        .module('turnos.pacientes')
        .controller('PacientesCtrl',pacientesCtrl);

    pacientesCtrl.$inject = ['$uibModal',
                             'toastr',
                             'Paciente',
                             '$loading'];
    
    function pacientesCtrl ($uibModal, toastr, Paciente, $loading) {
        var vm = this;
        vm.detail = detail;
        var modalInstance;        
        vm.modifyPaciente = modifyPaciente;
        vm.newPaciente = newPaciente;
        vm.pacientes = [];
        vm.paciente = null;
        vm.pacientesDataSet = null;
        vm.pageSize = 20;
        vm.totalItems = null;
        vm.currentPage = 1;
        vm.searchName = searchName;
        vm.changeSearchParameter = changeSearchParameter;
        
        activate();
        
        //Controller initialization
        function activate(){
            $loading.start('app');    
            vm.statusFilter = '1';
            Paciente.getPaginatedActiveList({page_size:vm.pageSize,ordering:'firstName'}, function(paginatedResult){
                vm.pacientes = paginatedResult.results;
                vm.totalItems = paginatedResult.count;
                $loading.finish('app');
            }, function(){ displayComunicationError('app');});
        }

        function detail(paciente){
            vm.paciente = paciente;
        }

        function modifyPaciente(selectedPaciente){
            var modalInstance = $uibModal.open({
                templateUrl: '/views/pacientes/paciente.html',
                backdrop:'static',
                size: 'lg',
                controller: 'PacienteCtrl',
                controllerAs: 'PacienteCtrl',
                resolve: {
                    paciente: function () {
                        return selectedPaciente;
                    }
                }
            });
            modalInstance.result.then(function (result) {
                if(result==='modified'){
                    toastr.success('Paciente modificado');
                }else if(result==='deleted'){
                    toastr.success('Paciente eliminado');
                }else if(result==='reactivated'){
                    toastr.success('Paciente reactivado');
                }
                vm.searchName();
            }, function () {
            });
        }

        function searchName(){
            vm.paciente = null;
            var currentStatusFilter;
            if(vm.searchPreferencesForm.searchName && vm.searchPreferencesForm.$valid){
                $loading.start('app');
                var searchObject = {
                    page_size:vm.pageSize,
                    page:vm.currentPage,
                    ordering:'firstName',
                    firstName:vm.nameFilter
                };
                currentStatusFilter = getStatusFilter();
                if(currentStatusFilter){
                    searchObject.status = currentStatusFilter;
                }
                Paciente.queryPaginated(searchObject,
                    function (paginatedResult){
                        vm.pacientes = paginatedResult.results;
                        vm.totalItems = paginatedResult.count;
                },function(){displayComunicationError('app');});
            }else{
                toastr.warning('Ingrese almenos 3 caracteres para buscar');
            }
        }


        function changeSearchParameter(){
            vm.currentPage = 1;
            vm.searchName();
        }

        function getStatusFilter(){
            if(vm.statusFilter==1){
                    return 'Active';
            }else{
                if(vm.statusFilter==3){
                    return 'Inactive';
                }
            }
        }

        function newPaciente(){
            modalInstance = $uibModal.open({
                templateUrl: '/views/pacientes/newpaciente.html',
                backdrop:'static',
                controller: 'NewPacienteCtrl',
                controllerAs: 'NewPacienteCtrl'
            });
            modalInstance.result.then(function () {
                toastr.success('Paciente creado');
                vm.searchName();
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
})();