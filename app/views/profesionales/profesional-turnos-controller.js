(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */

    angular
        .module('turnos.profesionales')
        .controller('TurnosProfesionalCtrl',turnosProfesionalCtrl);

    turnosProfesionalCtrl.$inject = ['$uibModal',
                                  '$loading',
                                  '$filter',
                                 'toastr',
                                 'moment',
                                 'Turno',
                                 '$stateParams',
                                 'Profesional'];

    function turnosProfesionalCtrl ($uibModal, $loading, $filter, toastr, moment, Turno, $stateParams, Profesional) {
        var vm = this;
        vm.canShowCancelTurno = canShowCancelTurno;
        vm.pageSize = 6;
        vm.profesional = {};
        vm.getTurnosForProfesional = getTurnosForProfesional;
        vm.getTurnosForProfesionalToday = getTurnosForProfesionalToday;
        vm.totalItems = null;
        vm.currentPage = 1;
        vm.turnosToday = [];
        vm.turnos = [];
        vm.refresh = refresh;
        vm.showCancelTurno = showCancelTurno;

        activate();

        //Controller initialization
        function activate(){
            getTurnosForProfesional();
            getTurnosForProfesionalToday();
            if($stateParams.profesional){
              vm.profesional= $stateParams.profesional;
            }else{
              vm.profesional = Profesional.get({id:$stateParams.profesionalId});
            }
        }

        function getTurnosForProfesionalToday(){
            $loading.start('app');

            var searchObject = {
              profesional:$stateParams.profesionalId,
              ordering:'day, start', 
              taken:true
            };
            
            searchObject.day = $filter('date')(new Date(), 'yyyy-MM-dd');


            vm.turnos = Turno.getActiveList(searchObject, function(turnos){
                vm.turnosToday = turnos;
                $loading.finish('app');
            }, function(){displayComunicationError('app');});                
        }

        function getTurnosForProfesional(){
            $loading.start('app');

            var searchObject = {
              profesional:$stateParams.profesionalId,
              ordering:'day, start', 
              taken:true
            };
            
            searchObject.day__gte = $filter('date')(new Date(), 'yyyy-MM-dd');
            searchObject.start__gte = $filter('date')(new Date(), 'yyyy-MM-dd');

            searchObject.page_size  = vm.pageSize;
            searchObject.page  = vm.currentPage;

            vm.turnos = Turno.getPaginatedActiveList(searchObject, function(paginatedResult){
                vm.turnos = paginatedResult.results;
                vm.totalItems =  paginatedResult.count;
                $loading.finish('app');
            }, function(){displayComunicationError('app');});                
        }

        function canShowCancelTurno(turno){
            return moment(turno.day + ' ' + turno.start).isSameOrAfter(moment(), 'minute');
        }

        function showCancelTurno(turno){
            var modalInstance = $uibModal.open({
                templateUrl: '/views/turnos/turno-delete.html',
                size: 'sm',
                backdrop:'static',
                controller: 'TurnoDeleteCtrl',
                controllerAs: 'TurnoDeleteCtrl',
                resolve: {
                    turno: function () {
                        return new Turno(turno);
                    }
                }
            });
            modalInstance.result.then(function (result) {
                if(result==='turnCanceled'){
                    activate();
                }
            }, function () {
            });
        }

        function refresh(){
            getTurnosForProfesional();
            getTurnosForProfesionalToday();
        }

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