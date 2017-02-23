(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */
  
    function newespecialidadCtrl ($loading,$uibModalInstance,Especialidad, toastr) {

        var vm = this;
        vm.clearForm = clearForm;
        vm.close = close;
        vm.confirm = confirm;
        vm.hideErrorMessage = hideErrorMessage;
        vm.newEspecialidad = {};
        

        activate();

        function activate(){

        }

        function confirm () {
            if(vm.newEspecialidadForm.$valid){
                vm.hideErrorMessage();
                $loading.start('app');
                var especialidad = new Especialidad();
                especialidad.name = vm.newEspecialidad.name;
                especialidad.description = vm.newEspecialidad.description;
                especialidad.default = vm.newEspecialidad.default;
                especialidad.status = 'Active';
                especialidad.$save(function(){
                    $loading.finish('app');
                    $uibModalInstance.close('created');
                },function(){
                    displayComunicationError('app');
                }
                );
            }else{
                vm.errorMessage = 'Por favor revise el formulario';
            }
         }
        
        function close(){
            $uibModalInstance.dismiss('cancel');
        }
                
        function hideErrorMessage(){
            vm.errorMessage = null;
        }

        function clearForm () {
            vm.newEspecialidad.name = '';
            vm.newEspecialidad.description = '';
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
    angular.module('turnos.especialidades').controller('NewEspecialidadCtrl',['$loading', '$uibModalInstance', 'Especialidad', 'toastr', newespecialidadCtrl]);
})();