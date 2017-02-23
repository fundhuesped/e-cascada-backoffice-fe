(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */

    function newprestacionCtrl ($loading, $uibModalInstance, Prestacion, Especialidad, toastr) {
        var vm = this;
        
        activate();

        function activate(){
            $loading.start('app');
            Especialidad.getActiveList(function(especialidades){
                vm.especialidades = especialidades;
                $loading.finish('app');
            },function (){displayComunicationError('app');} );
        }

        vm.newPrestacion = {
            duration:{}
        };

        vm.confirm = function confirm () {
            if(vm.newPrestacionForm.$valid){
                vm.hideErrorMessage();
                $loading.start('app');
                var prestacion = new Prestacion();
                prestacion.name = vm.newPrestacion.name;
                prestacion.description = vm.newPrestacion.description;
                prestacion.notes = vm.newPrestacion.notes;
                prestacion.default = vm.newPrestacion.default;
                prestacion.status = 'Active';
                prestacion.durationHours = vm.newPrestacion.duration.hours;
                prestacion.durationMinutes = vm.newPrestacion.duration.minutes;
                prestacion.especialidad = vm.newPrestacion.especialidad;
                prestacion.$save(function(){
                    $loading.finish('app');
                    $uibModalInstance.close('created');
                },function(){
                    displayComunicationError('app');
                });
            }else{
                vm.errorMessage = 'Por favor revise el formulario';
            }
        };

        vm.hideErrorMessage = function hideErrorMessage(){
            vm.errorMessage = null;
        };
        
        vm.close = function close (){
            $uibModalInstance.dismiss('cancel');
        };

        vm.clearForm = function clearForm () {
            if(vm.isModal){

            }else{
                vm.newPrestacion.name = '';
                vm.newPrestacion.description = '';
                vm.newPrestacion.hours = 0;
                vm.newPrestacion.minutes = 0;
            }
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
    angular.module('turnos.prestaciones').controller('NewPrestacionCtrl',['$loading', '$uibModalInstance', 'Prestacion', 'Especialidad', 'toastr',newprestacionCtrl]);
})();