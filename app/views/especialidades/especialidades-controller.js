(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */
    
    function especialidadesCtrl ($uibModal, toastr, Especialidad, $loading, SessionService) {
    	var vm = this;
        vm.especialidades = [];
        vm.especialidad = null;
    	vm.pageSize = 20;
        vm.totalItems = null;
        vm.currentPage = 1;
        vm.changeSearchParameter = changeSearchParameter;
        activate();
        vm.currentUserCan = SessionService.currentUserCan;

        //Controller initialization
        function activate(){
            $loading.start('app');
            vm.statusFilter = '1'; 
            Especialidad.getPaginatedActiveList({page_size:vm.pageSize,ordering:'name'}, function(paginatedResult){
                vm.especialidades = paginatedResult.results;
                vm.totalItems = paginatedResult.count;
                $loading.finish('app');
            },
                function(){displayComunicationError('app');}
            );
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
                if(result==='modified'){
                   toastr.success('Especialidad modificada');  
                }else if(result==='deleted'){
                   toastr.success('Especialidad eliminada');  
                }else if(result==='reactivated'){
                   toastr.success('Especialidad reactivada');                      
                }
               vm.searchName();                  
            }, function () {
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
                ordering:'name',
                name: vm.nameFilter
            };

            if(currentStatusFilter){
                searchObject.status = currentStatusFilter;
            }
            $loading.start('app');

            Especialidad.queryPaginated(searchObject,
                    function (paginatedResult){
                        $loading.finish('app');
                        vm.especialidades = paginatedResult.results;
                        vm.totalItems = paginatedResult.count;
                },
                function(){
                    displayComunicationError('app');
                });
        };

        function changeSearchParameter(){
            vm.currentPage = 1;
            vm.searchName();
        }

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
            }, function () {
            });
        };
        
        function displayComunicationError(loading){
            if(!toastr.active()){
                toastr.warning('Ocurrió un error en la comunicación, por favor intente nuevamente.');
            }
            if(loading){
                $loading.finish(loading);
            }
        }
                        
    }
    angular.module('turnos.especialidades').controller('EspecialidadesCtrl',['$uibModal','toastr','Especialidad', '$loading', 'SessionService',especialidadesCtrl]);
})();