(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */

    function turnoDeleteCtrl ($uibModalInstance, $loading, toastr, turno) {
        var vm = this;
        vm.cancelTurn = cancelTurn;
        vm.dismiss = dismiss;
        vm.title = '';
        vm.turno = angular.copy(turno);

        activate();

        function activate(){
        }


        function cancelTurn(){
            $loading.start('app');
            vm.turno.taken = false;
            vm.turno.$update(function(){
                $loading.finish('app');
                toastr.success('Turno cancelado con éxito');
                $uibModalInstance.close('turnCanceled');
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

        function dismiss (){
            $uibModalInstance.close('dismiss');
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
    angular.module('turnos.turnos').controller('TurnoDeleteCtrl',['$uibModalInstance', '$loading', 'toastr', 'turno', turnoDeleteCtrl]);
})();