(function(){
    'use strict';
    
    function prestacionesCtrl () {
    	this.prestaciones = [
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
    		},
    		{
	    		id: 2,
	    		name: 'Turno infectologia',
                description: 'Turno infectologia',
                duration: '20m',
                createdAt: '2016-01-02',
                lastModifiedAt: null,
                createdBy: {
                    id:1,
                    name: 'Admin'
                },
                lastModifiedBy:null

    		}
    	];
    	this.detail = function detail(prestacion){
    		this.prestacion = prestacion;
    	};
    	
    }
    angular.module('turnos.prestaciones').controller('PrestacionesCtrl',[prestacionesCtrl]);
})();