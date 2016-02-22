(function(){
    'use strict';
    
    function prestacionCtrl ($loading,$uibModalInstance,prestacion) {
        this.prestacion = prestacion;
    /*	this.prestacion =
            {
                id: 1,
                name: 'Turno infecto primera vez',
                createdAt: '2016-01-02',
                lastModifiedAt: null,
                duration: '40m', 
                description: 'Turno doble por primera vez infectologia',
                createdBy: {
                    id:1,
                    name: 'Admin'
                },
                lastModifiedBy:null
            };
            */
/*        this.toggleEdit = function toggleEdit(){
            this.editing = !this.editing;
        };

        */
        this.editing = true;

        this.confirm = function confirm () {
            if(this.prestacionForm.$valid){
                $loading.start('app');
                setTimeout(function(){             
                    $loading.finish('app');
                    $uibModalInstance.close('modified');
                }, 3000);
            }
        };

        this.delete = function confirm () {
            if(this.prestacionForm.$valid){
                $loading.start('app');
                setTimeout(function(){             
                    $loading.finish('app');
                    $uibModalInstance.close('deleted');
                }, 3000);
            }
        }; 
        this.cancel = function cancel (){
            $uibModalInstance.dismiss('cancel');
        };
    }
    angular.module('turnos.prestaciones').controller('PrestacionCtrl',['$loading','$uibModalInstance','prestacion',prestacionCtrl]);
})();