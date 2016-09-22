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
                                'turno',
                                'Turno',
                                'TurnoSlot'];

    function turnoDetailCtrl ($uibModalInstance, 
                              $loading,
                              toastr,
                              moment,
                              turno,
                              Turno,
                              TurnoSlot){
        var vm = this;
        vm.cancelTurn = cancelTurn;
        vm.title = '';
        vm.turnoSlot = angular.copy(turno);
        vm.turno = turno.turnos.length>0?angular.copy(turno.turnos[0]):{};
        vm.dismiss = dismiss;
        vm.markedAsTurnAsPresent = markedAsTurnAsPresent;
        vm.modalStyle = {};
        vm.showDelete = showDelete;

        vm.cancelModal = {
            style : {},
            show : function show(){
                this.style = {display:'block'};
            },
            dismiss : function dismiss(){
                this.style = {};
            },
            confirm : function confirm(){
                this.dismiss();
                vm.cancelTurn();
            }
        };

        vm.presentModal = {
            style : {},
            show : function show(){
                this.style = {display:'block'};
            },
            dismiss : function dismiss(){
                this.style = {};
            },
            confirm : function confirm(){
                this.dismiss();
                vm.markedAsTurnAsPresent();
            }
        };

        activate();

        function activate(){
            if(vm.turnoSlot.state === TurnoSlot.state.ocuppied){
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
            var turno = vm.turnoSlot.turnos[0];
            turno.state = Turno.state.canceled;
            turno.$update(function(){
                $loading.finish('app');
                toastr.success('Turno cancelado con éxito');
                $uibModalInstance.close('deleted');
            },
            function(errorResponse){
                if(errorResponse.status == 400 && errorResponse.data.error){
                    $loading.finish('app');
                    toastr.warning(errorResponse.data.error);
                }else{
                    vm.turnoSlot = angular.copy(turno);
                    displayComunicationError('app');
                }
            });
        }

        function markedAsTurnAsPresent(){
            $loading.start('app');
            var turno = new Turno(vm.turnoSlot.turnos[0]);
            turno.state = Turno.state.present;
            turno.$update(function(){
                $loading.finish('app');
                toastr.success('Turno marcado como presente con éxito');
                $uibModalInstance.close('markedAsPresent');
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
            return moment(vm.turnoSlot.day + ' ' + vm.turnoSlot.start).isSameOrAfter(moment(), 'minute') && vm.turnoSlot.state === TurnoSlot.state.ocuppied;
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