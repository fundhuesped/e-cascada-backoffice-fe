(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */
    angular
        .module('turnos.prestaciones')
        .controller('PrestacionesCtrl',prestacionesCtrl);
    prestacionesCtrl.$inject = ['$loading', '$uibModal','toastr','Prestacion', 'SessionService'];
    
    function prestacionesCtrl ($loading, $uibModal, toastr, Prestacion, SessionService) {
        var vm = this;
        vm.prestaciones = [];
        vm.prestacion = null;
        vm.pageSize = 20;
        vm.totalItems = null;
        vm.currentPage = 1;
        vm.searchName = searchName;
        vm.changeSearchParameter = changeSearchParameter;
        vm.currentUserCan = SessionService.currentUserCan;
        
        activate();

        //Controller initialization
        function activate(){
            $loading.start('app');

            vm.statusFilter = '1'; 
            Prestacion.getPaginatedActiveList({page_size:vm.pageSize,ordering:'name'}, function(paginatedResult){
                vm.prestaciones = paginatedResult.results;
                for (var i = vm.prestaciones.length - 1; i >= 0; i--) {
                    Object.defineProperty(vm.prestaciones[i],
                        'durationHours', {
                        enumerable: true,
                        configurable: false,
                        get: function () {
                          var tempVal = Math.floor(this.duration/60)|0;
                          return tempVal;
                        },
                        set: function (value) {
                            this.duration = this.durationMinutes + value *60;
                        }
                    });

                    Object.defineProperty(vm.prestaciones[i],
                        'durationMinutes', {
                        enumerable: true,
                        configurable: false,
                        get: function () {
                          return Math.floor(this.duration%60)|0;
                        },
                        set: function (value) {
                          this.duration = this.durationHours*60 + value;
                        }
                    });
                }
                vm.totalItems = paginatedResult.count;
                $loading.finish('app');
            }, function(){displayComunicationError('app');});
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
                ordering:'name',
                name:vm.nameFilter
            };
            if(currentStatusFilter){
                searchObject.status = currentStatusFilter;
            }
            Prestacion.queryPaginated(searchObject,
                function (paginatedResult){
                    vm.prestaciones = paginatedResult.results;
                    vm.totalItems = paginatedResult.count;
                for (var i = vm.prestaciones.length - 1; i >= 0; i--) {
                    Object.defineProperty(vm.prestaciones[i],
                        'durationHours', {
                        enumerable: true,
                        configurable: false,
                        get: function () {
                          var tempVal = Math.floor(this.duration/60)|0;
                          return tempVal;
                        },
                        set: function (value) {
                            this.duration = this.durationMinutes + value *60;
                        }
                    });

                    Object.defineProperty(vm.prestaciones[i],
                        'durationMinutes', {
                        enumerable: true,
                        configurable: false,
                        get: function () {
                          return Math.floor(this.duration%60)|0;
                        },
                        set: function (value) {
                          this.duration = this.durationHours*60 + value;
                        }
                    });
                }
                $loading.finish('app');
            }, function(){displayComunicationError('app');});
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

        function displayComunicationError(loading){
            if(!toastr.active()){
                toastr.warning('Ocurrió un error en la comunicación, por favor intente nuevamente.');
            }
            if(loading){
                $loading.finish(loading);
            }
        }
    }
})();