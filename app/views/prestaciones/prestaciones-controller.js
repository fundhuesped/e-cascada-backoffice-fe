(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */
    angular
        .module('turnos.prestaciones')
        .controller('PrestacionesCtrl',prestacionesCtrl);
    prestacionesCtrl.$inject = ['$uibModal','toastr','Prestacion'];
    
    function prestacionesCtrl ($uibModal, toastr, Prestacion) {
        var vm = this;
        vm.prestaciones = [];
        vm.prestacion = null;

        activate();

        //Controller initialization
        function activate(){
            vm.statusFilter = '1'; 
            vm.prestaciones = Prestacion.getActiveList();
        }

        vm.searchName = function searchName(){
            vm.prestacion = null;
            var currentStatusFilter;
            if(vm.statusFilter==1){
                currentStatusFilter = 'Active';
            }else{
                if(vm.statusFilter==3){
                    currentStatusFilter = 'Inactive';
                }
            }
            if(currentStatusFilter){
                vm.prestacionesDataSet = Prestacion.query({name:vm.nameFilter,status:currentStatusFilter});

            }else{
                vm.prestacionesDataSet = Prestacion.query({name:vm.nameFilter});
            }
        };

    	vm.detail = function detail(prestacion){
    		vm.prestacion = prestacion;
    	};

        vm.modify = function modify(selected){
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
                vm.searchName();     
            }.bind(vm), function () {
            });
        };

        vm.create = function create(){
            var modalInstance = $uibModal.open({
                templateUrl: '/views/prestaciones/newprestacion.html',
                backdrop:'static',
                controller: 'NewPrestacionCtrl',
                controllerAs: 'NewPrestacionCtrl'
            });
            modalInstance.result.then(function () {
                toastr.success('Prestación creada');
                vm.searchName();     
            }.bind(vm), function () {         
            });
        };
    }
})();