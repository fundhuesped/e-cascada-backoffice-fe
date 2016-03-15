(function(){
    'use strict';
    
    function newprestacionCtrl ($loading,$uibModalInstance,Prestacion,Especialidad) {
        
        this.newPrestacion = {
            duration:{}
        };



        this.confirm = function confirm () {
            if(this.newPrestacionForm.$valid){
                var prestacion = new Prestacion();
                prestacion.name = this.newPrestacion.name;
                prestacion.description = this.newPrestacion.description;
                prestacion.notes = this.newPrestacion.notes;
                prestacion.duration = this.newPrestacion.duration.hours * 60 + this.newPrestacion.duration.minutes;
                prestacion.especialidad = Especialidad.getUrlForObjectId(this.newPrestacion.especialidad.id);
                prestacion.$save(function(){
                    $loading.finish('newPrestacion');
                    $uibModalInstance.close('created');
                },function(error){
                    $loading.finish('newPrestacion');
                    $uibModalInstance.close('error');
                }
                );
            }
         };

/*        this.confirm = function confirm () {
            if(this.newprestacionForm.$valid){
                $loading.start('app');
                setTimeout(function(){             
                    $loading.finish('app');
                    $uibModalInstance.close('created');
                 }, 3000);
            }
         };*/
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