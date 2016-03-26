(function(){
    'use strict';

    function pacienteCtrl ($loading,$uibModalInstance,$filter,paciente,Document,Sex) {
        this.paciente = angular.copy(paciente);
        this.editing = true;
        this.errorMessage = null;

        this.confirm = function confirm () {
            if(this.pacienteForm.$valid){
                this.hideErrorMessage();
                $loading.start('app');
                this.paciente.birthDate = $filter('date')(this.paciente.birthDate, "yyyy-MM-dd");
                this.paciente.$update(function(){
                    $loading.finish('app');
                    $uibModalInstance.close('modified');
                },function(){
                    this.showErrorMessage();
                });
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

        this.confirmDelete = function confirmDelete(pacienteInstance){
            pacienteInstance.status = 'Inactive';
            pacienteInstance.$update(function(){
                $loading.finish('app');
                $uibModalInstance.close('deleted');
            },function(){
                $loading.finish('app');
                $uibModalInstance.close('deleted');
            });
        }
        this.confirmReactivate = function confirmReactivate(pacienteInstance){
            pacienteInstance.status = 'Active';
            pacienteInstance.$update(function(){
                $loading.finish('app');
                $uibModalInstance.close('reactivated');
            },function(){
                $loading.finish('app');
                $uibModalInstance.close('reactivated');
            });
        }

        this.confirmStatusChange = function confirmDelete(){
            var pacienteInstance = angular.copy(paciente);
            $loading.start('app');
            if(pacienteInstance.status=='Active'){
                this.confirmDelete(pacienteInstance);
            }else{
                if(pacienteInstance.status=='Inactive'){
                    this.confirmReactivate(pacienteInstance);
                }
            }
        };

        this.changeStatus = function changeStatus() {
            this.showModal();
        };

        this.cancel = function cancel (){
            $uibModalInstance.dismiss('cancel');
        };

        this.init = function init(){
            this.documents = Document.getActiveList();
            this.sexTypes = Sex.getActiveList()
        };
        this.init();

    }
    angular.module('turnos.pacientes').controller('PacienteCtrl',['$loading','$uibModalInstance','$filter','paciente','Document','Sex',pacienteCtrl]);
})();