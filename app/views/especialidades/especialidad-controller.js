(function(){
    'use strict';
    
    function especialidadCtrl ($loading,$uibModalInstance,especialidad) {
    	this.especialidad = angular.copy(especialidad);
        this.editing = true;
        this.errorMessage = null;

        this.confirm = function confirm () {
            if(this.especialidadForm.$valid){
                this.hideErrorMessage();
                $loading.start('app');
                this.especialidad.$update(function(){
                    $loading.finish('app');
                    $uibModalInstance.close('modified'); 
                },function(){
                    $loading.finish('app');
                    this.showErrorMessage();
                }.bind(this));
            }else{
                this.errorMessage = 'Por favor revise el formulario';                
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
        this.showErrorMessage = function showErrorMessage(){
            this.errorMessage = 'Ocurio un error en la comunicación';
        };
        this.hideErrorMessage = function hideErrorMessage(){
            this.errorMessage = null;
        };

        this.confirmDelete = function confirmDelete(especialidadInstance){
            especialidadInstance.status = 'Inactive';
            especialidadInstance.$update(function(){
                $loading.finish('app');
                $uibModalInstance.close('deleted');
            },function(){
                $loading.finish('app');
                $uibModalInstance.close('deleted');                    
            });
        }
        this.confirmReactivate = function confirmReactivate(especialidadInstance){
            especialidadInstance.status = 'Active';
            especialidadInstance.$update(function(){
                $loading.finish('app');
                $uibModalInstance.close('reactivated');
            },function(){
                $loading.finish('app');
                $uibModalInstance.close('reactivated');                    
            });
        }

        this.confirmStatusChange = function confirmDelete(){
            var especialidadInstance = angular.copy(especialidad);
            $loading.start('app');
            if(especialidadInstance.status=='Active'){
                this.confirmDelete(especialidadInstance);
            }else{
                if(especialidadInstance.status=='Inactive'){
                    this.confirmReactivate(especialidadInstance);
                }
            }
        };

        this.changeStatus = function changeStatus() {
            this.showModal();
        }; 

        this.cancel = function cancel (){
            $uibModalInstance.dismiss('cancel');
        };

    }
    angular.module('turnos.especialidades').controller('EspecialidadCtrl',['$loading','$uibModalInstance','especialidad',especialidadCtrl]);
})();