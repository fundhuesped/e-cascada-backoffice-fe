(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */

    function pacienteCtrl ($loading, $uibModalInstance, $filter, $uibModal, moment, paciente, Document, Turno, Sex, Province, District, Location, SocialService, CivilStatus, Education, Paciente, toastr, $location, $anchorScroll) {
        var vm = this;

        vm.paciente = {};
        vm.editing = true;
        vm.errorMessage = null;
        vm.estadoTurno = estadoTurno;
        vm.turnos = [];
        vm.canShowCancelTurno = canShowCancelTurno;
        vm.confirm = confirm;
        vm.confirmDelete = confirmDelete;
        vm.confirmReactivate = confirmReactivate;
        vm.changeStatus = changeStatus;
        vm.searchLocations = searchLocations;
        vm.searchDistricts = searchDistricts;
        vm.cancel = cancel;
        vm.originalPaciente = {};
        vm.showCancelTurno = showCancelTurno;
        vm.confirmStatusChange = confirmStatusChange;
        vm.allowDuplicate = false;
        vm.showAllowDuplicate = false;
        vm.birthDateCalendarPopup = {
          opened: false,
          options: {
            maxDate: new Date(),
          }
        };
        vm.firstTimeCalendarPopup = {
          opened: false,
          options: {
            maxDate: new Date(),
          }
        };

        vm.openBirthDateCalendar = openBirthDateCalendar;
        vm.openFirstTimeCalendar = openFirstTimeCalendar;


        activate();

        function activate(){
            Paciente.get({id:paciente.id}, function(returnedObject){
                $loading.start('app');

                vm.originalPaciente = angular.copy(returnedObject);
                vm.paciente = returnedObject;
                vm.paciente.birthDate = (vm.paciente.birthDate?new Date(vm.paciente.birthDate + 'T03:00:00'):null);
                vm.paciente.firstVisit = (vm.paciente.firstVisit?new Date(vm.paciente.firstVisit):null);
                vm.paciente.primaryPhoneNumber = parseInt(vm.paciente.primaryPhoneNumber)
                vm.paciente.secondPhoneNumber = parseInt(vm.paciente.secondPhoneNumber)
                vm.paciente.thirdPhoneNumber = parseInt(vm.paciente.thirdPhoneNumber)

                Document.getFullActiveList(function(documents){
                    vm.documents = documents;
                }, function(){displayComunicationError('app');});
                
                Sex.getFullActiveList(function(sexTypes){
                    vm.sexTypes = sexTypes;
                }, function(){displayComunicationError('app');});
                
                Province.getFullActiveList(function(provinces){
                    vm.provinces = provinces;
                }, function(){displayComunicationError('app');});
                
                SocialService.getFullActiveList(function(socialServices){
                    vm.socialServices = socialServices;
                }, function(){displayComunicationError('app');});
                
                CivilStatus.getFullActiveList(function(civilStatusTypes){
                    vm.civilStatusTypes = civilStatusTypes;
                }, function(){displayComunicationError('app');});
                
                Education.getFullActiveList(function(educationTypes){
                    vm.educationTypes = educationTypes;
                }, function(){displayComunicationError('app');});
                

                vm.selectedProvince = (vm.paciente.location?{id:vm.paciente.location.district.province.id}:null);

                if (vm.paciente.location) {
                    District.getActiveList({province: vm.paciente.location.district.province.id},function(districts){
                        vm.districts = districts;
                    },function(){displayComunicationError('app');});

                    Location.getActiveList({district: vm.paciente.location.district.id}, function(locations){
                        vm.locations = locations;
                    },function(){displayComunicationError('app');});
                }   

                vm.selectedDistrict = (vm.paciente.location?vm.paciente.location.district:null);

                vm.paciente.primaryPhoneMessage = (vm.paciente.primaryPhoneMessage?vm.paciente.primaryPhoneMessage:false);


                getTurnosForPaciente();

            },function(){displayComunicationError('app');});
        }

        function confirm () {
            if(vm.pacienteForm.$valid){
                vm.hideErrorMessage();
                $loading.start('app');
                vm.paciente.prospect = false;
                vm.paciente.birthDate = $filter('date')(vm.paciente.birthDate, 'yyyy-MM-dd');
                vm.paciente.firstVisit = $filter('date')(vm.paciente.firstVisit, 'yyyy-MM-dd');
                vm.paciente.$update({allowDuplicate:vm.allowDuplicate}, function(){
                    $loading.finish('app');
                    $uibModalInstance.close('modified');
                },function(error){
                    if(error.status==400 && error.data == 'Duplicate paciente exists'){
                        toastr.warning('Por favor revise que ya existe un paciente con estos datos');
                        $loading.finish('app');
                        vm.showAllowDuplicate = true;
                      }else{
                          displayComunicationError('app');
                      }
                });
            }else{
                vm.errorMessage = 'Por favor revise el formulario';
            }
        }

        //Confirm delete modal
        vm.showModal = function showModal(){
            vm.modalStyle = {display:'block'};
        };

        vm.confirmModal = function confirmModal(){
            vm.confirmStatusChange();
        };

        vm.dismissModal = function showModal(){
            vm.modalStyle = {};
        };
        vm.showErrorMessage = function showErrorMessage(){
            vm.errorMessage = 'Ocurio un error en la comunicación';
        };
        vm.hideErrorMessage = function hideErrorMessage(){
            vm.errorMessage = null;
        };

        function confirmDelete(pacienteInstance){
            pacienteInstance.status = 'Inactive';
            pacienteInstance.$update(function(){
                $loading.finish('app');
                $uibModalInstance.close('deleted');
            },function(){displayComunicationError('app');}
            );
        }
        function confirmReactivate(pacienteInstance){
            pacienteInstance.status = 'Active';
            pacienteInstance.$update(function(){
                $loading.finish('app');
                $uibModalInstance.close('reactivated');
            },function(){displayComunicationError('app');});
        }

        function confirmStatusChange(){
            var pacienteInstance = angular.copy(vm.originalPaciente);
            pacienteInstance.birthDate = $filter('date')(pacienteInstance.birthDate, 'yyyy-MM-dd');
            pacienteInstance.firstVisit = $filter('date')(pacienteInstance.firstVisit, 'yyyy-MM-dd');

            $loading.start('app');
            if(pacienteInstance.status==='Active'){
                vm.confirmDelete(pacienteInstance);
            }else{
                if(pacienteInstance.status==='Inactive'){
                    vm.confirmReactivate(pacienteInstance);
                }
            }
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
                        return turno;
                    }
                }
            });
            modalInstance.result.then(function (result) {
                if(result==='turnCanceled'){
                    getTurnosForPaciente();
                }
            }, function () {
            });
        }

        function estadoTurno(estado){
            if(estado === Turno.state.initial){
                return 'Reservado';
            }else if(estado === Turno.state.canceled){
                return 'Cancelado';
            }else if(estado === Turno.state.present){
                return 'Presente';
            }else if(estado === Turno.state.served){
                return 'Atendido';
            }
        }

        function getTurnosForPaciente(){
            $loading.start('app');
            vm.turnos = Turno.getActiveList({paciente:vm.paciente.id, ordering:'-day'}, function(turnos){
                vm.turnos = turnos;
                $loading.finish('app');
            }, function(){displayComunicationError('app');});                
        }
        function changeStatus() {
            vm.showModal();
            $location.hash('modal');
            $anchorScroll();
        }

        function cancel (){
            $uibModalInstance.dismiss('cancel');
        }

        function openFirstTimeCalendar() {
            vm.firstTimeCalendarPopup.opened = true;
        }

        function openBirthDateCalendar() {
          vm.birthDateCalendarPopup.opened = true;
        }

        function searchLocations() {
            if (vm.selectedDistrict) {
                Location.getFullActiveList({district: vm.selectedDistrict.id},function(locations){
                    vm.locations = locations;
                }, displayComunicationError);
            }
        }

        function searchDistricts() {
            vm.locations = null;
            if (vm.selectedProvince) {
                District.getFullActiveList({province: vm.selectedProvince.id}, function(districts){
                    vm.districts = districts;
                }, displayComunicationError);
            }
        }

        function canShowCancelTurno(turno){
            if(turno.state === Turno.state.initial && moment(turno.turnoSlot.day + ' ' + turno.turnoSlot.start).isSameOrAfter(moment(), 'minute')){
                return true;                
            }
            return false;
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
    angular.module('turnos.pacientes').controller('PacienteCtrl',['$loading','$uibModalInstance','$filter', '$uibModal', 'moment', 'paciente','Document','Turno','Sex', 'Province', 'District', 'Location', 'SocialService', 'CivilStatus', 'Education', 'Paciente', 'toastr', '$location', '$anchorScroll', pacienteCtrl]);
})();