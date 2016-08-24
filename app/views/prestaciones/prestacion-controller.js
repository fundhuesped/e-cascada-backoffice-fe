(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */

    function prestacionCtrl ($loading, $uibModalInstance, Especialidad, prestacion, Prestacion, toastr) {
        var vm = this;
        vm.prestacion = {};
        vm.errorMessage = null;
        vm.originalPrestacion = {};

        activate();
        function activate(){
            $loading.start('app');
            Prestacion.get({id:prestacion.id}, function(returnedObject){
                vm.originalPrestacion = angular.copy(returnedObject);
                vm.prestacion = returnedObject;
                $loading.finish('app');
            });
            Especialidad.getActiveList(function(especialidades){
                vm.especialidades = especialidades;
            }, function(){displayComunicationError('app');} );
        }

        vm.confirm = function confirm () {
            if(vm.prestacionForm.$valid){
                vm.hideErrorMessage();
                $loading.start('app');
                vm.prestacion.$update(function(){
                    $loading.finish('app');
                    $uibModalInstance.close('modified'); 
                },function(){
                    displayComunicationError('app');
                });
            }else{
                vm.errorMessage = 'Por favor revise el formulario';
            }
        };

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

        vm.confirmDelete = function confirmDelete(prestacionInstance){
            prestacionInstance.status = 'Inactive';
            prestacionInstance.$update(function(){
                $loading.finish('app');
                $uibModalInstance.close('deleted');
            },function(){
                $loading.finish('app');
                vm.showErrorMessage();
            }.bind(vm));
        };

        vm.confirmReactivate = function confirmReactivate(prestacionInstance){
            prestacionInstance.status = 'Active';
            prestacionInstance.$update(function(){
                $loading.finish('app');
                $uibModalInstance.close('reactivated');
            },function(){
                displayComunicationError('app');
            });
        };

        vm.hideErrorMessage = function hideErrorMessage(){
            vm.errorMessage = null;
        };

        vm.confirmStatusChange = function confirmDelete(){
            var prestacionInstance = angular.copy(vm.originalPrestacion);
            $loading.start('app');
            if(prestacionInstance.status==='Active'){
                vm.confirmDelete(prestacionInstance);
            }else{
                if(prestacionInstance.status==='Inactive'){
                    vm.confirmReactivate(prestacionInstance);
                }
            }
        };

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
    angular.module('turnos.prestaciones').controller('PrestacionCtrl',['$loading','$uibModalInstance','Especialidad','prestacion', 'Prestacion', 'toastr', prestacionCtrl]);
})();