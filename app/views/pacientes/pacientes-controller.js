(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
        .module('turnos.pacientes')
        .controller('PacientesCtrl',pacientesCtrl);

    pacientesCtrl.$inject = ['$uibModal',
                             'toastr',
                             'Paciente'];
    
    function pacientesCtrl ($uibModal,toastr,Paciente) {
        var vm = this;
        vm.detail = detail;
        var modalInstance;        
        vm.modifyPaciente = modifyPaciente;
        vm.newPaciente = newPaciente;
        vm.pacientes = [];
        vm.paciente = null;
        vm.pacientesDataSet = null;
        vm.searchName = searchName;

        activate();
        
        //Controller initialization
        function activate(){
            vm.statusFilter = '1';
            vm.searchName();
        }

        function detail(paciente){
            vm.paciente = paciente;
        }

        function modifyPaciente(selectedPaciente){
            var modalInstance = $uibModal.open({
                templateUrl: '/views/pacientes/paciente.html',
                backdrop:'static',
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
            }.bind(vm), function () {
            });
        }

        function searchName(){
            vm.paciente = null;
            var currentStatusFilter;
            if(vm.statusFilter==1){
                currentStatusFilter = 'Active';
            }else{
                if(vm.statusFilter==3){
                    currentStatusFilter = 'Inactive';
                }
            }
            if(currentStatusFilter){
                vm.pacientes = Paciente.query({name:vm.nameFilter,status:currentStatusFilter});
            }else{
                vm.pacientes = Paciente.query({name:vm.nameFilter});
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
    }
})();