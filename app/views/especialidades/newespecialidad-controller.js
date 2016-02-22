(function(){
    'use strict';
    
    function newespecialidadCtrl ($loading,$uibModalInstance) {
        this.confirm = function confirm () {
            if(this.newEspecialidadForm.$valid){
                $loading.start('newEspecialidad');
                setTimeout(function(){             
                    $loading.finish('newEspecialidad');
                    $uibModalInstance.close('created');
                 }, 3000);
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
    angular.module('turnos.especialidades').controller('NewEspecialidadCtrl',['$loading','$uibModalInstance',newespecialidadCtrl]);
})();