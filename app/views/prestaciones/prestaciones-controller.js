(function(){
    'use strict';
    
    function prestacionesCtrl ($uibModal, toastr,Prestacion, Especialidad) {
        this.prestaciones = [];
        this.prestacion = null;

        this.searchName = function searchName(){
            this.prestacion = null;
            var currentStatusFilter;
            if(this.statusFilter==1){
                currentStatusFilter = 'Active';
            }else{
                if(this.statusFilter==3){
                    currentStatusFilter = 'Inactive';
                }
            }
            if(currentStatusFilter){
                this.prestaciones = Prestacion.query({name:this.nameFilter,status:currentStatusFilter},function(){
                   for (var i = this.prestaciones.length - 1; i >= 0; i--) {
                        this.prestaciones[i].especialidadObj = Especialidad.get({especialidadId:this.prestaciones[i].especialidad.substr(-2,1)});
                    }
                }.bind(this));
           }else{
               this.prestaciones = Prestacion.query({name:this.nameFilter},function(){
                   for (var i = this.prestaciones.length - 1; i >= 0; i--) {
                        this.prestaciones[i].especialidadObj = Especialidad.get({especialidadId:this.prestaciones[i].especialidad.substr(-2,1)});
                    }
                }.bind(this));
           }
        };

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
                if(result==='modified'){
                   toastr.success('Prestación modificada');  
                }else if(result==='deleted'){
                   toastr.success('Prestación eliminada'); 
                }else if(result==='reactivated'){
                   toastr.success('Prestación reactivada');                      
                }
                this.searchName();     
            }.bind(this), function () {
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
                toastr.success('Prestación creada');
                this.searchName();     
            }.bind(this), function () {         
            });
        };

        //Controller initialization
        this.init = function init(){
            this.statusFilter = "1"; 
            this.searchName();     
        }
        this.init();

    }
    angular.module('turnos.prestaciones').controller('PrestacionesCtrl',['$uibModal','toastr','Prestacion','Especialidad',prestacionesCtrl]);
})();