(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */

    angular
        .module('turnos.profesionales')
        .controller('ProfesionalesCtrl',profesionalesCtrl);
        
    profesionalesCtrl.$inject = ['$uibModal',
                                 'toastr',
                                 'Profesional'];

    function profesionalesCtrl ($uibModal,toastr,Profesional) {
        var vm = this;
        vm.addLeave = addLeave;
        vm.profesionales = [];
        vm.profesional = null;
        vm.detail = detail;
        vm.modifyProfesional = modifyProfesional;
        vm.newProfesional = newProfesional;
        vm.searchName = searchName;

        activate();
        
        //Controller initialization
        function activate(){
            vm.statusFilter = '1';
            vm.searchName();
        }

        function detail(profesional){
            vm.profesional = profesional;
        }

        function modifyProfesional(selectedProfesional){
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
                if(result==='modified'){
                    toastr.success('Profesional modificado');
                }else if(result==='deleted'){
                    toastr.success('Profesional eliminado');
                }else if(result==='reactivated'){
                    toastr.success('Profesional reactivado');
                }
                vm.searchName();
            }, function () {
            });
        }

        function addLeave(selectedProfesional){
            var modalInstance = $uibModal.open({
                templateUrl: '/views/profesionales/addleave.html',
                backdrop:'static',
                controller: 'AddLeaveCtrl',
                controllerAs: 'AddLeaveCtrl',
                resolve: {
                    profesional: function () {
                        return selectedProfesional;
                    }
                }
            });
            modalInstance.result.then(function (result) {
                if(result==='created'){
                    toastr.success('Ausencia cargada');
                }
            }, function () {
            });
        }

        function newProfesional(){
            var modalInstance = $uibModal.open({
                templateUrl: '/views/profesionales/newprofesional.html',
                backdrop:'static',
                controller: 'NewProfesionalCtrl',
                controllerAs: 'NewProfesionalCtrl'
            });
            modalInstance.result.then(function () {
                toastr.success('Profesional creado');
                vm.searchName();
            }, function () {

            });
        }
        
        function searchName(){
            vm.profesional = null;
            var currentStatusFilter;
            if(vm.statusFilter==1){
                currentStatusFilter = 'Active';
            }else{
                if(vm.statusFilter==3){
                    currentStatusFilter = 'Inactive';
                }
            }
            if(currentStatusFilter){
                vm.profesionales = Profesional.query({name:vm.nameFilter,status:currentStatusFilter});

            }else{
                vm.profesionales = Profesional.query({name:vm.nameFilter});
            }
        }
    }
})();