(function () {
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */
    angular
        .module('turnos.profesionales')
        .controller('AddLeaveCtrl',addLeaveController);
        
    addLeaveController.$inject = ['$loading',
                                  '$uibModalInstance',
                                  '$filter',
                                  'profesional',
                                  'Leave',
                                  'Agenda'];

    function addLeaveController($loading, $uibModalInstance, $filter, profesional, Leave, Agenda) {
        var vm = this;
        vm.cancel = cancel;
        vm.confirm = confirm;
        vm.errorMessage = null;
        vm.hideErrorMessage = hideErrorMessage;
        vm.leaveForm;
        vm.newLeave = {};
        vm.profesional = angular.copy(profesional);
        vm.showErrorMessage = showErrorMessage;
        vm.openFromDateCalendar = openFromDateCalendar;
        vm.openToDateCalendar = openToDateCalendar;
        vm.lastAgendaFinishDate = null;
        vm.calculateToDate = calculateToDate;
        vm.disabledForm = false;

        vm.fromDateCalendarPopup = {
          opened: false,
          altInputFormats: ['d!/M!/yyyy','dd-MM-yyyy'],
          options: {
            minDate: new Date(),
            maxDate: vm.lastAgendaFinishDate
          }
        };        
        vm.toDateCalendarPopup = {
          opened: false,
          altInputFormats: ['d!/M!/yyyy','dd-MM-yyyy'],
          options: {
            minDate: new Date(),
            maxDate: vm.lastAgendaFinishDate
          }
        };
        activate();

        function activate() {
            Agenda.getActiveList({page_size:1,ordering:'-validTo', profesional:profesional.id}, function(list){
                if(list.length>0){
                    vm.lastAgendaFinishDate = new Date(list[0].validTo);
                    vm.fromDateCalendarPopup.options.maxDate = vm.lastAgendaFinishDate;
                    vm.toDateCalendarPopup.options.maxDate = vm.lastAgendaFinishDate;
                }else{      
                    vm.disabledForm = true;
                    vm.errorMessage = 'El profesional no posee agendas activas';
                }
            });
        }

        function calculateToDate(){
            vm.toDateCalendarPopup.options.minDate = vm.newLeave.fromDate || new Date();
        }

        function confirm() {
            if(vm.leaveForm.$valid){
                if(vm.newLeave.fromDate && vm.newLeave.toDate && (vm.newLeave.fromDate <= vm.newLeave.toDate) && vm.newLeave.fromDate >= new Date() && vm.newLeave.toDate <=vm.lastAgendaFinishDate){
                    vm.hideErrorMessage();
                    $loading.start('app');
                    var leave = new Leave();
                    leave.start_day = $filter('date')(vm.newLeave.fromDate, 'yyyy-MM-dd');
                    leave.end_day = $filter('date')(vm.newLeave.toDate, 'yyyy-MM-dd');
                    leave.profesional = vm.profesional;
                    leave.notes = vm.newLeave.notes;
                    leave.reason = vm.newLeave.reason;
                    leave.$save(function(){
                        $loading.finish('app');
                        $uibModalInstance.close('modified');
                    },function(){
                        $loading.finish('app');
                        vm.showErrorMessage();
                    });
                }else{
                    vm.errorMessage = 'Por favor revise el formulario.';
                }
            }else{
                vm.errorMessage = 'Por favor revise el formulario';
            }
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function checkLeaveDates(){

        }
        
        function showErrorMessage() {
            vm.errorMessage = 'Ocurio un error en la comunicación';
        }
        
        function openFromDateCalendar() {
          vm.fromDateCalendarPopup.opened = true;
        }

        function openToDateCalendar() {
          vm.toDateCalendarPopup.opened = true;
        }


        function hideErrorMessage() {
            vm.errorMessage = null;
        }

    }
})();