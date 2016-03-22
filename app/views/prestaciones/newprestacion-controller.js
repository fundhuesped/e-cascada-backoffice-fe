(function(){
    'use strict';
    
    function newprestacionCtrl ($loading,$uibModalInstance,Prestacion,Especialidad) {
        
        this.newPrestacion = {
            duration:{}
        };

        this.confirm = function confirm () {
            if(this.newPrestacionForm.$valid){
                this.hideErrorMessage();
                $loading.start('newPrestacion');
                var prestacion = new Prestacion();
                prestacion.name = this.newPrestacion.name;
                prestacion.description = this.newPrestacion.description;
                prestacion.notes = this.newPrestacion.notes;
                prestacion.status = 'Active';
                prestacion.durationHours = this.newPrestacion.duration.hours;
                prestacion.durationMinutes = this.newPrestacion.duration.minutes;
                prestacion.especialidad = this.newPrestacion.especialidad.id;
                prestacion.$save(function(){
                    $loading.finish('newPrestacion');
                    $uibModalInstance.close('created');
                },function(error){
                    $loading.finish('newPrestacion');
                    $uibModalInstance.close('error');
                });
            }else{
                this.errorMessage = 'Por favor revise el formulario';
            }
        };

        this.showErrorMessage = function showErrorMessage(){
            this.errorMessage = 'Ocurio un error en la comunicación';
        };
        this.hideErrorMessage = function hideErrorMessage(){
            this.errorMessage = null;
        };
        
        this.close = function close (){
            $uibModalInstance.dismiss('cancel');
        };

        this.clearForm = function clearForm () {
            if(this.isModal){

            }else{
                this.newPrestacion.name = '';
                this.newPrestacion.description = '';
                this.newPrestacion.hours = 0;
                this.newPrestacion.minutes = 0;
            }
        };

        this.init = function init(){
            this.especialidades = Especialidad.getActiveList();
        };
        this.init();
    }
    angular.module('turnos.prestaciones').controller('NewPrestacionCtrl',['$loading','$uibModalInstance','Prestacion','Especialidad',newprestacionCtrl]);
})();