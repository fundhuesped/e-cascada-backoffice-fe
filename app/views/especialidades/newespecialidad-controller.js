(function(){
    'use strict';
    
    function newespecialidadCtrl ($loading,$uibModalInstance,Especialidad) {
        this.confirm = function confirm () {
            if(this.newEspecialidadForm.$valid){
                this.hideErrorMessage();
                $loading.start('app');
                var especialidad = new Especialidad();
                especialidad.name = this.newEspecialidad.name;
                especialidad.description = this.newEspecialidad.description;
                especialidad.status = 'Active';
                especialidad.$save(function(){
                    $loading.finish('app');
                    $uibModalInstance.close('created');
                },function(error){
                    $loading.finish('app');
                    this.showErrorMessage();
                }.bind(this)
                );
            }else{
                this.errorMessage = 'Por favor revise el formulario';
            }
         };
        this.close = function close (){
            $uibModalInstance.dismiss('cancel');
        };
        this.showErrorMessage = function showErrorMessage(){
            this.errorMessage = 'Ocurio un error en la comunicación';
        };
        this.hideErrorMessage = function hideErrorMessage(){
            this.errorMessage = null;
        };
        this.clearForm = function clearForm () {
            if(this.isModal){

            }else{
                this.newEspecialidad.name = '';
                this.newEspecialidad.description = '';
            }
        };
    }
    angular.module('turnos.especialidades').controller('NewEspecialidadCtrl',['$loading','$uibModalInstance','Especialidad',newespecialidadCtrl]);
})();