(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */
    angular
        .module('turnos.turnos')
        .controller('TurnoDetailCtrl',turnoDetailCtrl);
  
    turnoDetailCtrl.$inject =  [ '$uibModalInstance', 
                                '$loading', 
                                'toastr',
                                'moment', 
                                'turno'];

    function turnoDetailCtrl ($uibModalInstance, $loading, toastr, moment, turno) {
        var vm = this;
        vm.cancelTurn = cancelTurn;
        vm.title = '';
        vm.turno = angular.copy(turno);
        vm.dismiss = dismiss;
        vm.showModal = showModal;
        vm.confirmModal = confirmModal;
        vm.dismissModal = dismissModal;
        vm.modalStyle = {};
        vm.showDelete = showDelete;

        activate();

        function activate(){
            if(turno.taken === true){
                vm.title = 'Turno asignado';
            }else{
                vm.title = 'Turno disponible';
            }
        }

        function dismiss (){
            $uibModalInstance.dismiss('dismiss');
        }

        function cancelTurn(){
            $loading.start('app');
            vm.turno.taken = false;
            vm.turno.$update(function(){
                $loading.finish('app');
                toastr.success('Turno cancelado con éxito');
                $uibModalInstance.close('deleted');
            },
            function(errorResponse){
                if(errorResponse.status == 400 && errorResponse.data.error){
                    $loading.finish('app');
                    toastr.warning(errorResponse.data.error);
                }else{
                    vm.turno = angular.copy(turno);
                    displayComunicationError('app');
                }
            });
        }

        function showDelete(){
            return moment(vm.turno.day + ' ' + vm.turno.start).isSameOrAfter(moment(), 'minute') && vm.turno.taken === true;
        }

        function showModal(){
            vm.modalStyle = {display:'block'};
        }

        function confirmModal(){
            dismissModal();
            vm.cancelTurn();
        }
                
        function dismissModal(){
            vm.modalStyle = {};
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