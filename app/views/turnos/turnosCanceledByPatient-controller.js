(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */

    angular
        .module('turnos.turnos')
        .controller('TurnosCanceledByPatientCtrl',turnosCanceledByPatientCtrl);

    turnosCanceledByPatientCtrl.$inject = ['$uibModal',
                                     '$loading',
                                     '$filter',
                                     'toastr',
                                     'moment',
                                     'Turno'];

    function turnosCanceledByPatientCtrl ($uibModal, 
                                    $loading, 
                                    $filter, 
                                    toastr, 
                                    moment, 
                                    Turno) {
        var vm = this;
        vm.pageSize = 10;
        vm.getTurnos = getTurnos;
        vm.totalItems = null;
        vm.currentPage = 1;
        vm.turnos = [];
        vm.canShowInformTurno = canShowInformTurno;
        vm.showInformTurno = showInformTurno;
        vm.markTurno = markTurno;
        vm.changeSearchParameter = changeSearchParameter;
        vm.statusFilter = '1';
        vm.getReasonDecription = getReasonDecription;

        vm.markModal = {
            style : {},
            show : function show(){
                this.style = {display:'block'};
            },
            dismiss : function dismiss(){
                this.style = {};
            },
            confirm : function confirm(){
                this.dismiss();
                vm.markTurno();
            }
        };


        activate();

        //Controller initialization
        function activate(){
            getTurnos();
        }

        function getTurnos(){
            $loading.start('app');

            var searchObject = {
                ordering:'day,start', 
                state: Turno.state.canceled,
                cancelation_reason: Turno.cancelationReason.pacientRequestSMS + ',' + Turno.cancelationReason.pacientRequestEmail,
                page_size: vm.pageSize,
                page: vm.currentPage
            };

            if (vm.statusFilter === '1') {
                searchObject.informed = false;
            }else{
                searchObject.informed = true;
            }

            vm.turnos = Turno.getPaginatedActiveList(searchObject, function(paginatedResult){
                vm.turnos = paginatedResult.results;
                vm.totalItems =  paginatedResult.count;
                $loading.finish('app');
            }, function(){displayComunicationError('app');});                
        }

        function canShowInformTurno(turno){
            return !turno.informed ;
        }

        function showInformTurno(turno){
            vm.selectedTurno = turno;
            vm.markModal.show();
        }

        function changeSearchParameter(){
            getTurnos();
        }

        function markTurno(){
            $loading.start('app');
            var turno = new Turno(vm.selectedTurno);
            turno.informed = true;
            turno.$update(function(){
                $loading.finish('app');
                getTurnos();
                toastr.success('Turno marcado con éxito');
            },
            function(errorResponse){
                if(errorResponse.status == 400 && errorResponse.data.error){
                    $loading.finish('app');
                    toastr.warning(errorResponse.data.error);
                }else{
                    displayComunicationError('app');
                }
            });
        }

        function getReasonDecription(reasonId){
            return Turno.cancelationReasonDescription[reasonId];
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