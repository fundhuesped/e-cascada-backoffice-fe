(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */

    function especialidadCtrl ( $loading, $uibModalInstance, especialidad, Especialidad) {
    	var vm = this;
        vm.confirm = confirm;
        vm.confirmDelete = confirmDelete;
        vm.confirmReactivate = confirmReactivate;
        vm.confirmStatusChange = confirmStatusChange; 
        vm.editing = true;
        vm.errorMessage = null;
        vm.especialidad = {};
        
        activate();

        function activate(){
            Especialidad.get({id:especialidad.id}, function(returnedObject){
                vm.especialidad = returnedObject;
            });
        }

        function confirm () {
            if(vm.especialidadForm.$valid){
                vm.hideErrorMessage();
                $loading.start('app');
                vm.especialidad.$update(function(){
                    $loading.finish('app');
                    $uibModalInstance.close('modified'); 
                },function(){
                    $loading.finish('app');
                    vm.showErrorMessage();
                }.bind(vm));
            }else{
                vm.errorMessage = 'Por favor revise el formulario';                
            }
        }

        //Confirm delete modal
        vm.showModal = function showModal(){
            vm.modalStyle = {display:'block'};
        };

        vm.confirmModal = function confirmModal(){
            vm.confirmStatusChange();
        };
                
        vm.dismissModal = function showModal(){
            vm.modalStyle = {};
        };
        vm.showErrorMessage = function showErrorMessage(){
            vm.errorMessage = 'Ocurio un error en la comunicación';
        };
        vm.hideErrorMessage = function hideErrorMessage(){
            vm.errorMessage = null;
        };

        function confirmDelete(especialidadInstance){
            especialidadInstance.status = 'Inactive';
            especialidadInstance.$update(function(){
                $loading.finish('app');
                $uibModalInstance.close('deleted');
            },function(){
                $loading.finish('app');
                $uibModalInstance.close('deleted');                    
            });
        }
        function confirmReactivate(especialidadInstance){
            especialidadInstance.status = 'Active';
            especialidadInstance.$update(function(){
                $loading.finish('app');
                $uibModalInstance.close('reactivated');
            },function(){
                $loading.finish('app');
                $uibModalInstance.close('reactivated');                    
            });
        }

        function confirmStatusChange(){
            var especialidadInstance = angular.copy(vm.especialidad);
            $loading.start('app');
            if(especialidadInstance.status==='Active'){
                vm.confirmDelete(especialidadInstance);
            }else{
                if(especialidadInstance.status==='Inactive'){
                    vm.confirmReactivate(especialidadInstance);
                }
            }
        }

        vm.changeStatus = function changeStatus() {
            vm.showModal();
        }; 

        vm.cancel = function cancel (){
            $uibModalInstance.dismiss('cancel');
        };

    }
    angular.module('turnos.especialidades').controller('EspecialidadCtrl',['$loading','$uibModalInstance','especialidad', 'Especialidad',especialidadCtrl]);
})();