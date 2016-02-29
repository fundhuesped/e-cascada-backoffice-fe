(function(){
    'use strict';
    
    function especialidadCtrl ($loading,$uibModalInstance,especialidad) {
    	this.especialidad = especialidad;
/*    		{
	    		id: 1,
	    		name: 'Pediatria',
                createdAt: '2016-01-02',
                lastModifiedAt: null,
                description: 'Especialidad dedicada a menores de 15 años',
                createdBy: {
                    id:1,
                    name: 'Admin'
                },
                lastModifiedBy:null
    		};*/
/*        this.toggleEdit = function toggleEdit(){
            this.editing = !this.editing;
        };*/
        this.editing = true;

        this.confirm = function confirm () {
            if(this.especialidadForm.$valid){
                $loading.start('app');
                setTimeout(function(){             
                    $loading.finish('app');
                    $uibModalInstance.close('modified');
                }, 3000);
            }
        };

        //Confirm delete modal

        this.showModal = function showModal(){
            this.modalStyle = {display:'block'};
        };

        this.confirmModal = function confirmModal(){
            this.confirmDelete();
        };
                
        this.dismissModal = function showModal(){
            this.modalStyle = {};
        };

        this.confirmDelete = function confirmDelete(){
            $loading.start('app');
                setTimeout(function(){             
                    $loading.finish('app');
                    $uibModalInstance.close('deleted');
                }, 3000);
        };

        this.remove = function remove () {
            this.showModal();
        }; 

        this.cancel = function cancel (){
            $uibModalInstance.dismiss('cancel');
        };

    }
    angular.module('turnos.especialidades').controller('EspecialidadCtrl',['$loading','$uibModalInstance','especialidad',especialidadCtrl]);
})();