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
                                     'TurnoSlot',
                                     '$stateParams',
                                     'Profesional'];

    function turnosProfesionalCtrl ($uibModal, 
                                    $loading, 
                                    $filter, 
                                    toastr, 
                                    moment, 
                                    Turno, 
                                    TurnoSlot, 
                                    $stateParams, 
                                    Profesional) {
        var vm = this;
        vm.canShowCancelTurno = canShowCancelTurno;
        vm.pageSize = 6;
        vm.profesional = {};
        vm.getTurnoSlotsForProfesional = getTurnoSlotsForProfesional;
        vm.getTurnosSlotsForProfesionalToday = getTurnosSlotsForProfesionalToday;
        vm.totalItems = null;
        vm.currentPage = 1;
        vm.turnoSlotsToday = [];
        vm.turnoSlots = [];
        vm.refresh = refresh;
        vm.showCancelTurno = showCancelTurno;

        activate();

        //Controller initialization
        function activate(){
            getTurnoSlotsForProfesional();
            getTurnosSlotsForProfesionalToday();
            if($stateParams.profesional){
              vm.profesional= $stateParams.profesional;
            }else{
              vm.profesional = Profesional.get({id:$stateParams.profesionalId});
            }
        }

        function getTurnosSlotsForProfesionalToday(){
            $loading.start('app');

            var searchObject = {
              profesional:$stateParams.profesionalId,
              ordering:'day, start', 
              state: TurnoSlot.state.ocuppied
            };
            
            searchObject.day = $filter('date')(new Date(), 'yyyy-MM-dd');


            vm.turnos = TurnoSlot.getActiveList(searchObject, function(turnoSlots){
                vm.turnoSlotsToday = turnoSlots;
                $loading.finish('app');
            }, function(){displayComunicationError('app');});                
        }

        function getTurnoSlotsForProfesional(){
            $loading.start('app');

            var searchObject = {
              profesional:$stateParams.profesionalId,
              ordering:'day, start', 
              state: TurnoSlot.state.ocuppied
            };
            
            searchObject.day__gte = $filter('date')(new Date(), 'yyyy-MM-dd');
            searchObject.start__gte = $filter('date')(new Date(), 'yyyy-MM-dd');

            searchObject.page_size  = vm.pageSize;
            searchObject.page  = vm.currentPage;

            vm.turnos = TurnoSlot.getPaginatedActiveList(searchObject, function(paginatedResult){
                vm.turnoSlots = paginatedResult.results;
                vm.totalItems =  paginatedResult.count;
                $loading.finish('app');
            }, function(){displayComunicationError('app');});                
        }

        function canShowCancelTurno(turnoSlot){
            return moment(turnoSlot.day + ' ' + turnoSlot.start).isSameOrAfter(moment(), 'minute');
        }

        function showCancelTurno(turnoSlot){
            var modalInstance = $uibModal.open({
                templateUrl: '/views/turnos/turno-delete.html',
                size: 'sm',
                backdrop:'static',
                controller: 'TurnoDeleteCtrl',
                controllerAs: 'TurnoDeleteCtrl',
                resolve: {
                    turno: function () {
                        var turno = new Turno(turnoSlot.currentTurno);
                        turno.turnoSlot = turnoSlot;
                        return turno;
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