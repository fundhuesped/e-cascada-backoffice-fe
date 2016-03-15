(function(){
    'use strict';
    
    function newespecialidadCtrl ($loading,$uibModalInstance,Especialidad) {
        this.confirm = function confirm () {
            if(this.newEspecialidadForm.$valid){
                var especialidad = new Especialidad();
                especialidad.name = this.newEspecialidad.name;
                especialidad.description = this.newEspecialidad.description;
                especialidad.$save(function(){
                    $loading.finish('newEspecialidad');
                    $uibModalInstance.close('created');
                },function(error){
                    $loading.finish('newEspecialidad');
                    $uibModalInstance.close('created');
                }
                );
            }
         };
        this.close = function close (){
            $uibModalInstance.dismiss('cancel');
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