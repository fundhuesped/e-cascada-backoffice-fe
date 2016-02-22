(function(){
    'use strict';
    
    function newprestacionCtrl ($loading,$uibModalInstance) {
        
        this.newPrestacion = {
            duration:{}
        };

        this.confirm = function confirm () {
            if(this.newprestacionForm.$valid){
                $loading.start('app');
                setTimeout(function(){             
                    $loading.finish('app');
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
                this.newPrestacion.name = '';
                this.newPrestacion.description = '';
                this.newPrestacion.hours = 0;
                this.newPrestacion.minutes = 0;
            }
        };
    }
    angular.module('turnos.prestaciones').controller('NewPrestacionCtrl',['$loading','$uibModalInstance',newprestacionCtrl]);
})();