(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */

    function especialidadCtrl ( $loading, $uibModalInstance, especialidad, Especialidad, toastr) {
    	var vm = this;
        vm.confirm = confirm;
        vm.confirmDelete = confirmDelete;
        vm.confirmReactivate = confirmReactivate;
        vm.confirmStatusChange = confirmStatusChange; 
        vm.errorMessage = null;
        vm.especialidad = {};
        vm.originalEspecialidad = {};
        activate();

        function activate(){
            Especialidad.get({id:especialidad.id}, function(returnedObject){
                vm.originalEspecialidad = angular.copy(returnedObject);
                vm.especialidad = returnedObject;
            }, displayComunicationError);
        }

        function confirm () {
            if(vm.especialidadForm.$valid){
                vm.hideErrorMessage();
                $loading.start('app');
                vm.especialidad.$update(function(){
                    $loading.finish('app');
                    $uibModalInstance.close('modified'); 
                },function(){
                    displayComunicationError('app');
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

        vm.hideErrorMessage = function hideErrorMessage(){
            vm.errorMessage = null;
        };

        function confirmDelete(especialidadInstance){
            especialidadInstance.status = 'Inactive';
            especialidadInstance.$update(function(){
                $loading.finish('app');
                $uibModalInstance.close('deleted');
            },function(){
                displayComunicationError('app');
            });
        }
        function confirmReactivate(especialidadInstance){
            especialidadInstance.status = 'Active';
            especialidadInstance.$update(function(){
                $loading.finish('app');
                $uibModalInstance.close('reactivated');
            },function(){
                displayComunicationError('app');
            });
        }

        function confirmStatusChange(){
            var especialidadInstance = angular.copy(vm.originalEspecialidad);
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

        function displayComunicationError(loading){
            if(!toastr.active()){
                toastr.warning('Ocurrió un error en la comunicación, por favor intente nuevamente.');
            }
            if(loading){
                $loading.finish(loading);
            }
        }

    }
    angular.module('turnos.especialidades').controller('EspecialidadCtrl',['$loading','$uibModalInstance','especialidad', 'Especialidad', 'toastr',especialidadCtrl]);
})();