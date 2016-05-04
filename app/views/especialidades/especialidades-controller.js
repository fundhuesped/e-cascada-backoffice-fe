(function(){
    'use strict';
    
    function especialidadesCtrl ($uibModal,toastr,Especialidad) {
    	this.especialidades = [];
        this.especialidad = null;
    	
        this.detail = function detail(especialidad){
    		this.especialidad = especialidad;
    	};
    	
        this.modifyEspecialidad = function modifyEspecialidad(selectedEspecialidad){
            var modalInstance = $uibModal.open({
                templateUrl: '/views/especialidades/especialidad.html',
                backdrop:'static',
                controller: 'EspecialidadCtrl',
                controllerAs: 'EspecialidadCtrl',
                resolve: {
                    especialidad: function () {
                      return selectedEspecialidad;
                    }
                }
            });
            modalInstance.result.then(function (result) {
                if(result=='modified'){
                   toastr.success('Especialidad modificada');  
                }else if(result=='deleted'){
                   toastr.success('Especialidad eliminada');  
                }else if(result=='reactivated'){
                   toastr.success('Especialidad reactivada');                      
                }
               this.searchName();                  
            }.bind(this), function () {
            });
        };

        this.searchName = function searchName(){
            this.especialidad = null;
            var currentStatusFilter;
            if(this.statusFilter==1){
                currentStatusFilter = 'Active';
            }else{
                if(this.statusFilter==3){
                    currentStatusFilter = 'Inactive';
                }
            }
            if(currentStatusFilter){
                this.especialidadesDataSet = Especialidad.query({name:this.nameFilter,status:currentStatusFilter},function(result){
                    this.especialidades = result.results;
                }.bind(this));

           }else{
               this.especialidadesDataSet = Especialidad.query({name:this.nameFilter},function(result){
                    this.especialidades = result.results;
                }.bind(this));
           }

        };

        this.newEspecialidad = function newEspecialidad(){
            var modalInstance = $uibModal.open({
                templateUrl: '/views/especialidades/newespecialidad.html',
                backdrop:'static',
                controller: 'NewEspecialidadCtrl',
                controllerAs: 'NewEspecialidadCtrl'
            });
            modalInstance.result.then(function () {
               toastr.success('Especialidad creada');
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
    angular.module('turnos.especialidades').controller('EspecialidadesCtrl',['$uibModal','toastr','Especialidad',especialidadesCtrl]);
})();