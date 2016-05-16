(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */
    
    function especialidadesCtrl ($uibModal,toastr,Especialidad) {
    	var vm = this;
        vm.especialidades = [];
        vm.especialidad = null;
    	

        activate();

        //Controller initialization
        function activate(){
            vm.statusFilter = '1'; 
            vm.especialidades = Especialidad.getActiveList();
        }


        vm.detail = function detail(especialidad){
    		vm.especialidad = especialidad;
    	};
    	
        vm.modifyEspecialidad = function modifyEspecialidad(selectedEspecialidad){
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
               vm.searchName();                  
            }.bind(vm), function () {
            });
        };

        vm.searchName = function searchName(){
            vm.especialidad = null;
            var currentStatusFilter;
            if(vm.statusFilter==1){
                currentStatusFilter = 'Active';
            }else{
                if(vm.statusFilter==3){
                    currentStatusFilter = 'Inactive';
                }
            }
            if(currentStatusFilter){
                vm.especialidades = Especialidad.query({name:vm.nameFilter,status:currentStatusFilter});

           }else{
               vm.especialidades = Especialidad.query({name:vm.nameFilter});
           }

        };

        vm.newEspecialidad = function newEspecialidad(){
            var modalInstance = $uibModal.open({
                templateUrl: '/views/especialidades/newespecialidad.html',
                backdrop:'static',
                controller: 'NewEspecialidadCtrl',
                controllerAs: 'NewEspecialidadCtrl'
            });
            modalInstance.result.then(function () {
               toastr.success('Especialidad creada');
               vm.searchName();
            }.bind(vm), function () {
              
            });
        };
        

                        
    }
    angular.module('turnos.especialidades').controller('EspecialidadesCtrl',['$uibModal','toastr','Especialidad',especialidadesCtrl]);
})();