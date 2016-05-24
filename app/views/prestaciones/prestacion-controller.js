(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */

    function prestacionCtrl ($loading,$uibModalInstance,Especialidad,prestacion, Prestacion) {
        var vm = this;
        vm.prestacion = {};
        vm.errorMessage = null;
        
        activate();
        function activate(){
            Prestacion.get({id:prestacion.id}, function(returnedObject){
                vm.prestacion = returnedObject;
            });
            vm.especialidades = Especialidad.getActiveList();
        }

        vm.confirm = function confirm () {
            if(vm.prestacionForm.$valid){
                vm.hideErrorMessage();
                $loading.start('app');
                vm.prestacion.$update(function(){
                    $loading.finish('app');
                    $uibModalInstance.close('modified'); 
                },function(){
                    $loading.finish('app');
                    vm.showErrorMessage();
                }.bind(vm));
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
                $loading.finish('app');
                vm.showErrorMessage();
            }.bind(vm));
        };

        vm.showErrorMessage = function showErrorMessage(){
            vm.errorMessage = 'Ocurio un error en la comunicación';
        };
        vm.hideErrorMessage = function hideErrorMessage(){
            vm.errorMessage = null;
        };

        vm.confirmStatusChange = function confirmDelete(){
            var prestacionInstance = angular.copy(prestacion);
            $loading.start('app');
            if(prestacionInstance.status=='Active'){
                vm.confirmDelete(prestacionInstance);
            }
            if(prestacionInstance.status=='Inactive'){
                vm.confirmReactivate(prestacionInstance);
            }
        };

        vm.changeStatus = function changeStatus() {
            vm.showModal();
        }; 

        vm.cancel = function cancel (){
            $uibModalInstance.dismiss('cancel');
        };


    }
    angular.module('turnos.prestaciones').controller('PrestacionCtrl',['$loading','$uibModalInstance','Especialidad','prestacion', 'Prestacion', prestacionCtrl]);
})();