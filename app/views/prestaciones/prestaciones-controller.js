(function(){
    'use strict';
    
    function prestacionesCtrl ($uibModal, toastr) {
        this.prestaciones = [];
    	this.prestacionesSource = [
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
                status: 'Activa',
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
                status: 'Activa',
                lastModifiedBy:null

    		},
            {
                id: 3,
                name: 'CD4',
                createdAt: '2016-01-02',
                lastModifiedAt: null,
                duration: {
                        hours: 0,
                        minutes: 10
                    }, 
                description: 'Analisis de laboratorio para CD4',
                createdBy: {
                    id:1,
                    name: 'Admin'
                },
                status: 'Activa',
                lastModifiedBy:null
            },
            {
                id: 4,
                name: 'Cargar viral',
                createdAt: '2016-01-02',
                lastModifiedAt: null,
                duration: {
                        hours: 0,
                        minutes: 10
                    }, 
                description: 'Analisis de laboratior de carga viral',
                createdBy: {
                    id:1,
                    name: 'Admin'
                },
                status: 'Inactivo',
                lastModifiedBy:null
            },
    	];



        //Controller initialization
        this.init = function init(){
            this.statusFilter = "1"; 
            for (var i = this.prestacionesSource.length - 1; i >= 0; i--) {
               if(this.prestacionesSource[i].status == "Activa"){
                    this.prestaciones.push(this.prestacionesSource[i]);
                }
           };               
        }

        this.searchName = function searchName(){
            this.prestaciones = [];
            this.prestacion = null;
            for (var i = this.prestacionesSource.length - 1; i >= 0; i--) {
               if((
                (this.statusFilter==1 
                || this.statusFilter == 2 )
                && this.prestacionesSource[i].status == "Activa" )||((this.statusFilter==2 || this.statusFilter == 3 )&& this.prestacionesSource[i].status == "Inactivo" ) ){
                    if(this.prestacionesSource[i].name.indexOf(this.nameFilter)>-1 ){
                        this.prestaciones.push(this.prestacionesSource[i]);                        
                    }
                }
           }; 
        };


        this.changePrestacionesStatus = function changePrestacionesStatus(){
            this.prestaciones = [];
            this.prestacion = null;
            for (var i = this.prestacionesSource.length - 1; i >= 0; i--) {
               if((
                (this.statusFilter==1 
                || this.statusFilter == 2 )
                && this.prestacionesSource[i].status == "Activa" )||((this.statusFilter==2 || this.statusFilter == 3 )&& this.prestacionesSource[i].status == "Inactivo" ) ){
                    if(this.nameFilter){
                        if(this.prestacionesSource[i].name.indexOf(this.nameFilter)>-1){
                            this.prestaciones.push(this.prestacionesSource[i]);
                        }
                    }else{
                        this.prestaciones.push(this.prestacionesSource[i]);
                    }
                }
           };    
        };

        this.init();

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