(function(){
    'use strict';
    
    function especialidadesCtrl ($uibModal,toastr) {
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
    	};
    	

        this.modifyEspecialidad = function modifyEspecialidad(selectedEspecialidad){
            var modalInstance = $uibModal.open({
                templateUrl: '/views/especialidades/especialidad.html',
                backdrop:'static',
                controller: 'EspecialidadCtrl',
                controllerAs: 'EspecialidadCtrl',
                resolve: {
                    especialidad: function () {
                      return selectedEspecialidad;
                    }
                }
            });
            modalInstance.result.then(function (result) {
                if(result=='modified'){
                   toastr.success('Especialidad modificada');                    
                }else if(result=='deleted'){
                   toastr.success('Especialidad eliminada');                    
                }
            }, function () {
            });
        };

        this.newEspecialidad = function newEspecialidad(){
            var modalInstance = $uibModal.open({
                templateUrl: '/views/especialidades/newespecialidad.html',
                backdrop:'static',
                controller: 'NewEspecialidadCtrl',
                controllerAs: 'NewEspecialidadCtrl'
            });
            modalInstance.result.then(function () {
               toastr.success('Especialidad creada');
            }, function () {
              
            });
        };
                        
    }
    angular.module('turnos.especialidades').controller('EspecialidadesCtrl',['$uibModal','toastr',especialidadesCtrl]);
})();