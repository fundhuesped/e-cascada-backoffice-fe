(function(){
    'use strict';
    
    function prestacionCtrl ($stateParams) {
    	this.prestacion =
    		{
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
    		};
        this.toggleEdit = function toggleEdit(){
            this.editing = !this.editing;
        };
    }
    angular.module('turnos.prestaciones').controller('PrestacionCtrl',['$stateParams',prestacionCtrl]);
})();