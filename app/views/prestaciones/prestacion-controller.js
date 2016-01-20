(function(){
    'use strict';
    
    function prestacionCtrl ($stateParams) {
    	this.prestacion =
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
        this.toggleEdit = function toggleEdit(){
            this.editing = !this.editing;
        };
    }
    angular.module('turnos.prestaciones').controller('PrestacionCtrl',['$stateParams',prestacionCtrl]);
})();