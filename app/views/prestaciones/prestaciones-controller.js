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
        vm.pageSize = 20;
        vm.totalItems = null;
        vm.currentPage = 1;
        vm.searchName = searchName;
        vm.changeSearchParameter = changeSearchParameter;
        
        activate();

        //Controller initialization
        function activate(){
            vm.statusFilter = '1'; 
            Prestacion.getPaginatedActiveList({page_size:vm.pageSize,order_field:'name',
                order_by:'asc'}, function(paginatedResult){
                vm.prestaciones = paginatedResult.results;
                vm.totalItems = paginatedResult.count;
            });
        }


        function searchName(){
            vm.prestacion = null;
            var currentStatusFilter;
            if(vm.statusFilter==1){
                currentStatusFilter = 'Active';
            }else{
                if(vm.statusFilter==3){
                    currentStatusFilter = 'Inactive';
                }
            }
            var searchObject = {
                page_size:vm.pageSize,
                page:vm.currentPage,
                order_field:'name',
                order_by:'asc',
                name:vm.nameFilter
            };
            if(currentStatusFilter){
                searchObject.status = currentStatusFilter;
            }
            Prestacion.queryPaginated(searchObject,
                function (paginatedResult){
                    vm.prestaciones = paginatedResult.results;
                    vm.totalItems = paginatedResult.count;
            });
        }

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
            }, function () {
            });
        };

        function changeSearchParameter(){
            vm.currentPage = 1;
            vm.searchName();
        }

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
            }, function () {         
            });
        };
    }
})();