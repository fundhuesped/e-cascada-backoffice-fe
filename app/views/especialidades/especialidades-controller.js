(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */
    
    function especialidadesCtrl ($uibModal,toastr,Especialidad) {
    	var vm = this;
        vm.especialidades = [];
        vm.especialidad = null;
    	vm.pageSize = 20;
        vm.totalItems = null;
        vm.currentPage = 1;

        activate();

        //Controller initialization
        function activate(){
            vm.statusFilter = '1'; 
            Especialidad.getPaginatedActiveList({page_size:vm.pageSize,order_field:'name',
                order_by:'asc'}, function(paginatedResult){
                vm.especialidades = paginatedResult.results;
                vm.totalItems = paginatedResult.count;
            });
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
            var searchObject = {
                page_size:vm.pageSize,
                page:vm.currentPage,
                order_field:'name',
                order_by:'asc',
                name: vm.nameFilter
            };

            if(currentStatusFilter){
                searchObject.status = currentStatusFilter;
            }

            Especialidad.queryPaginated(searchObject,
                    function (paginatedResult){
                        vm.especialidades = paginatedResult.results;
                        vm.totalItems = paginatedResult.count;
                });

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