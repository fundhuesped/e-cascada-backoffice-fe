(function(){
    'use strict';
    
    function especialidadesCtrl () {
    	this.especialidades = [
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
    		},
    		{
	    		id: 2,
	    		name: 'Infectologia',
                description: 'Se encarga del estudio, la prevención, el diagnóstico, tratamiento y pronóstico de las enfermedades producidas por agentes infecciosos',
                createdAt: '2016-01-02',
                lastModifiedAt: null,
                createdBy: {
                    id:1,
                    name: 'Admin'
                },
                lastModifiedBy:null

    		}
    	];
    	this.detail = function detail(especialidad){
    		this.especialidad = especialidad;
    	}
    	
    }
    angular.module('turnos.especialidades').controller('EspecialidadesCtrl',[especialidadesCtrl]);
})();