(function(){
    'use strict';
    
    function prestacionesCtrl ($uibModal, toastr) {
    	this.prestaciones = [
    		{
	    		id: 1,
	    		name: 'Turno infecto primera vez',
                createdAt: '2016-01-02',
                lastModifiedAt: null,
                duration: {
                        hours: 0,
                        minutes: 40
                    }, 
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
                duration: {
                        hours: 0,
                        minutes: 20
                    },                
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

        this.modify = function modify(selected){
            var modalInstance = $uibModal.open({
                templateUrl: '/views/prestaciones/prestacion.html',
                controller: 'PrestacionCtrl',
                controllerAs: 'PrestacionCtrl',
                backdrop:'static',
                resolve: {
                    prestacion: function () {
                      return selected;
                    }
                }
            });
            modalInstance.result.then(function (result) {
                if(result=='modified'){
                   toastr.success('Prestacion modificada');                    
                }else if(result=='deleted'){
                   toastr.success('Prestacion eliminada');                    
                }
            }, function () {
            });
        };

        this.create = function create(){
            var modalInstance = $uibModal.open({
                templateUrl: '/views/prestaciones/newprestacion.html',
                backdrop:'static',
                controller: 'NewPrestacionCtrl',
                controllerAs: 'NewPrestacionCtrl'
            });
            modalInstance.result.then(function () {
               toastr.success('Prestacion creada');
            }, function () {         
            });
        };
    	
    }
    angular.module('turnos.prestaciones').controller('PrestacionesCtrl',['$uibModal','toastr',prestacionesCtrl]);
})();