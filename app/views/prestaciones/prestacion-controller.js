(function(){
    'use strict';
    
    function prestacionCtrl ($loading,$uibModalInstance,Especialidad,prestacion) {
        this.prestacion = angular.copy(prestacion);
        this.errorMessage = null;

        this.confirm = function confirm () {
            if(this.prestacionForm.$valid){
                $loading.start('app');
                this.prestacion.$update(function(){
                    $loading.finish('app');
                    $uibModalInstance.close('modified'); 
                },function(){
                    this.showErrorMessage();
                }.bind(this));
            }else{
                this.errorMessage = 'Revise el formulario por favor';
            }
        };

        //Confirm delete modal
        this.showModal = function showModal(){
            this.modalStyle = {display:'block'};
        };

        this.confirmModal = function confirmModal(){
            this.confirmStatusChange();
        };
                
        this.dismissModal = function showModal(){
            this.modalStyle = {};
        };

        this.confirmDelete = function confirmDelete(prestacionInstance){
            prestacionInstance.status = 'Inactive';
            prestacionInstance.$update(function(){
                $loading.finish('app');
                $uibModalInstance.close('deleted');
            },function(){
                this.showErrorMessage();
            }.bind(this));
        };

        this.confirmReactivate = function confirmReactivate(prestacionInstance){
            prestacionInstance.status = 'Active';
            prestacionInstance.$update(function(){
                $loading.finish('app');
                $uibModalInstance.close('reactivated');
            },function(){
                this.showErrorMessage();
            }.bind(this));
        };

        this.showErrorMessage = function showErrorMessage(){
            this.errorMessage = 'Ocurio un error en la comunicacion';
        };
        this.hideErrorMessage = function hideErrorMessage(){
            this.errorMessage = null;
        };

        this.confirmStatusChange = function confirmDelete(){
            var prestacionInstance = angular.copy(prestacion);
            $loading.start('app');
            if(prestacionInstance.status=='Active'){
                this.confirmDelete(prestacionInstance);
            }
            if(prestacionInstance.status=='Inactive'){
                this.confirmReactivate(prestacionInstance);
            }
        };

        this.changeStatus = function changeStatus() {
            this.showModal();
        }; 

        this.cancel = function cancel (){
            $uibModalInstance.dismiss('cancel');
        };

        this.init = function init(){
            this.especialidades = Especialidad.getActiveList();
        }
        this.init();
    }
    angular.module('turnos.prestaciones').controller('PrestacionCtrl',['$loading','$uibModalInstance','Especialidad','prestacion',prestacionCtrl]);
})();