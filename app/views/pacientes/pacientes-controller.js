(function(){
    'use strict';

    function pacientesCtrl ($uibModal,toastr,Paciente) {
        this.pacientes = [];
        this.paciente = null;
        this.pacientesDataSet = null;
        
        this.detail = function detail(paciente){
            this.paciente = paciente;
        };

        this.modifyPaciente = function modifyPaciente(selectedPaciente){
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
                if(result=='modified'){
                    toastr.success('Paciente modificado');
                }else if(result=='deleted'){
                    toastr.success('Paciente eliminado');
                }else if(result=='reactivated'){
                    toastr.success('Paciente reactivado');
                }
                this.searchName();
            }.bind(this), function () {
            });
        };

        this.searchName = function searchName(){
            this.paciente = null;
            var currentStatusFilter;
            if(this.statusFilter==1){
                currentStatusFilter = 'Active';
            }else{
                if(this.statusFilter==3){
                    currentStatusFilter = 'Inactive';
                }
            }
            if(currentStatusFilter){
                this.pacientesDataSet = Paciente.query({name:this.nameFilter,status:currentStatusFilter},function(result){
                    this.pacientes = result.results;
                }.bind(this));
            }else{
                this.pacientesDataSet = Paciente.query({name:this.nameFilter},function(result){
                    this.pacientes = result.results;
                }.bind(this));
            }
        };

        this.newPaciente = function newPaciente(){
            var modalInstance = $uibModal.open({
                templateUrl: '/views/pacientes/newpaciente.html',
                backdrop:'static',
                controller: 'NewPacienteCtrl',
                controllerAs: 'NewPacienteCtrl'
            });
            modalInstance.result.then(function () {
                toastr.success('Paciente creado');
                this.searchName();
            }.bind(this), function () {

            });
        };

        //Controller initialization
        this.init = function init(){
            this.statusFilter = "1";
            this.searchName();
        };
        this.init();
    }
    angular.module('turnos.pacientes').controller('PacientesCtrl',['$uibModal','toastr','Paciente',pacientesCtrl]);
})();