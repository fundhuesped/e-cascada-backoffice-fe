(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */

    function profesionalCtrl ($loading,$uibModalInstance,$filter,profesional,Document,Sex, Province, District, Location, CivilStatus, Prestacion, Especialidad, Profesional,toastr) {
        var vm = this;
        vm.profesional = {};
        vm.editing = true;
        vm.errorMessage = null;
        vm.confirm = confirm;
        vm.showModal = showModal;
        vm.searchPrestacionesForEspecialidad = searchPrestacionesForEspecialidad;
        vm.confirmReactivate = confirmReactivate;
        vm.confirmStatusChange = confirmStatusChange;
        vm.confirmDelete = confirmDelete;   
        vm.changeStatus =  changeStatus;
        vm.cancel = cancel;
        vm.originalProfesional = {};
        vm.openBirthDateCalendar = openBirthDateCalendar;
        vm.birthDateCalendarPopup = {
          opened: false,
          options: {
            maxDate: new Date(),
          }
        };


        activate();

        function activate(){
            $loading.start('app');
            Profesional.get({id:profesional.id}, function(returnedObject){
                vm.originalProfesional = angular.copy(returnedObject);
                vm.profesional = returnedObject;
                vm.profesional.birthDate = (vm.profesional.birthDate?new Date(vm.profesional.birthDate + 'T03:00:00'):null);

                Document.getFullActiveList(function(documents){
                    vm.documents = documents;
                },function(){displayComunicationError('app');});

                Document.getFullActiveList(function(documents){
                    vm.documents = documents;
                }, function(){displayComunicationError('app');});
                
                Sex.getFullActiveList(function(sexTypes){
                    vm.sexTypes = sexTypes;
                }, function(){displayComunicationError('app');});
                
                Province.getFullActiveList(function(provinces){
                    vm.provinces = provinces;
                }, function(){displayComunicationError('app');});
                
                CivilStatus.getFullActiveList(function(civilStatusTypes){
                    vm.civilStatusTypes = civilStatusTypes;
                },function(){displayComunicationError('app');});

                vm.selectedProvince = (vm.profesional.location?{id:vm.profesional.location.district.province.id}:null);

                if (vm.profesional.location) {
                    District.getActiveList({province: vm.profesional.location.district.province.id},function(districts){
                        vm.districts = districts;
                    },function(){displayComunicationError('app');});

                    Location.getActiveList({district: vm.profesional.location.district.id}, function(locations){
                        vm.locations = locations;
                    },function(){displayComunicationError('app');});
                }                

                vm.selectedDistrict = (vm.profesional.location?vm.profesional.location.district:null);


                vm.profesional.primaryPhoneMessage = (vm.profesional.primaryPhoneMessage?vm.profesional.primaryPhoneMessage:false);
                
                if(vm.profesional.prestaciones && vm.profesional.prestaciones.length>0){
                    vm.selectedEspecialidad = vm.profesional.prestaciones[0].especialidad;

                    Prestacion.getFullActiveList({especialidad:vm.selectedEspecialidad.id}, function(prestaciones){
                        vm.prestaciones = prestaciones;
                    },function(){displayComunicationError('app');});
                }
                
                Especialidad.getFullActiveList(function(especialidades){
                    vm.especialidades = especialidades;
                },function(){displayComunicationError('app');});
                $loading.finish('app');

            },function(){displayComunicationError('app');});
        }


        function searchPrestacionesForEspecialidad(){
            vm.prestaciones = Prestacion.getFullActiveList({especialidad: vm.selectedEspecialidad.id},function(prestaciones){
                vm.prestaciones = prestaciones;
            },function(){displayComunicationError('app');});
        }
        
        function confirm () {
            if(vm.profesionalForm.$valid){
                vm.hideErrorMessage();
                $loading.start('app');
                vm.profesional.birthDate = (vm.profesional.birthDate?$filter('date')(vm.profesional.birthDate, 'yyyy-MM-dd'):null);
                vm.profesional.$update(function(){
                    $loading.finish('app');
                    $uibModalInstance.close('modified');
                },function(){
                    displayComunicationError('app');
                });
            }else{
                vm.errorMessage = 'Por favor revise el formulario';
            }
        }

        //Confirm delete modal
        function showModal(){
            vm.modalStyle = {display:'block'};
        }

        vm.confirmModal = function confirmModal(){
            vm.confirmStatusChange();
        };

        vm.dismissModal = function dismissModal(){
            vm.modalStyle = {};
        };

        vm.hideErrorMessage = function hideErrorMessage(){
            vm.errorMessage = null;
        };

        function confirmDelete(profesionalInstance){
            profesionalInstance.status = 'Inactive';
            profesionalInstance.$update(function(){
                $loading.finish('app');
                $uibModalInstance.close('deleted');
            },function(){
                displayComunicationError('app');
            });
        }
        function confirmReactivate(profesionalInstance){
            profesionalInstance.status = 'Active';
            profesionalInstance.$update(function(){
                $loading.finish('app');
                $uibModalInstance.close('reactivated');
            },function(){
                displayComunicationError('app');
            });
        }

        function confirmStatusChange(){
            var profesionalInstance = angular.copy(vm.originalProfesional);
            profesionalInstance.birthDate = $filter('date')(profesionalInstance.birthDate, 'yyyy-MM-dd');

            $loading.start('app');
            if(profesionalInstance.status==='Active'){
                vm.confirmDelete(profesionalInstance);
            }else{
                if(profesionalInstance.status==='Inactive'){
                    vm.confirmReactivate(profesionalInstance);
                }
            }
        }

        function changeStatus() {
            vm.showModal();
        }

        function cancel (){
            $uibModalInstance.dismiss('cancel');
        }

        vm.searchLocations = function searchLocations() {
            if (vm.selectedDistrict) {
                Location.getFullActiveList({district: vm.selectedDistrict.id}, function(locations){
                    vm.locations = locations;
                },function(){displayComunicationError('app');});
            }
        };

        function openBirthDateCalendar() {
          vm.birthDateCalendarPopup.opened = true;
        }

        vm.searchDistricts = function searchDistricts() {
            vm.locations = [];
            if (vm.selectedProvince) {
                District.getFullActiveList({province: vm.selectedProvince.id}, function(districts){
                    vm.districts = districts;
                },function(){displayComunicationError('app');});
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
    angular.module('turnos.profesionales').controller('ProfesionalCtrl',['$loading','$uibModalInstance','$filter','profesional','Document','Sex', 'Province', 'District', 'Location', 'CivilStatus', 'Prestacion', 'Especialidad', 'Profesional', 'toastr', profesionalCtrl]);
})();