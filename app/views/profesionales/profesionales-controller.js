(function(){
    'use strict';

    function profesionalesCtrl ($uibModal,toastr,Profesional) {
        this.profesionales = [];
        this.profesional = null;

        this.detail = function detail(profesional){
            this.profesional = profesional;
        };

        this.modifyProfesional = function modifyProfesional(selectedProfesional){
            var modalInstance = $uibModal.open({
                templateUrl: '/views/profesionales/profesional.html',
                backdrop:'static',
                controller: 'ProfesionalCtrl',
                controllerAs: 'ProfesionalCtrl',
                resolve: {
                    profesional: function () {
                        return selectedProfesional;
                    }
                }
            });
            modalInstance.result.then(function (result) {
                if(result=='modified'){
                    toastr.success('Profesional modificado');
                }else if(result=='deleted'){
                    toastr.success('Profesional eliminado');
                }else if(result=='reactivated'){
                    toastr.success('Profesional reactivado');
                }
                this.searchName();
            }.bind(this), function () {
            });
        };

        this.searchName = function searchName(){
            this.profesional = null;
            var currentStatusFilter;
            if(this.statusFilter==1){
                currentStatusFilter = 'Active';
            }else{
                if(this.statusFilter==3){
                    currentStatusFilter = 'Inactive';
                }
            }
            if(currentStatusFilter){
                this.profesionales = Profesional.query({name:this.nameFilter,status:currentStatusFilter});

            }else{
                this.profesionales = Profesional.query({name:this.nameFilter});
            }

        };

        this.newProfesional = function newProfesional(){
            var modalInstance = $uibModal.open({
                templateUrl: '/views/profesionales/newprofesional.html',
                backdrop:'static',
                controller: 'NewProfesionalCtrl',
                controllerAs: 'NewProfesionalCtrl'
            });
            modalInstance.result.then(function () {
                toastr.success('Profesional creado');
                this.searchName();
            }.bind(this), function () {

            });
        };

        //Controller initialization
        this.init = function init(){
            this.statusFilter = "1";
            this.searchName();
        };
        this.init();
    }
    angular.module('turnos.profesionales').controller('ProfesionalesCtrl',['$uibModal','toastr','Profesional',profesionalesCtrl]);
})();