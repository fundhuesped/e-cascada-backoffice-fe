(function () {
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */

    function newPacienteCtrl($state, $loading, $filter, Paciente, Document, Sex, Province, District, Location, SocialService, CivilStatus, Education, toastr) {
        var vm = this;
        vm.locations = null;
        vm.districts = null;
        vm.selectedProvince = null;
        vm.close = close;
        vm.clearForm = clearForm;
        vm.searchLocations = searchLocations;
        vm.hideErrorMessage = hideErrorMessage;
        vm.searchDistricts = searchDistricts;
        vm.confirm = confirm;
        vm.showAllowDuplicate = false;
        vm.allowDuplicate = false;
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

        vm.newPaciente = {
            socialService:null,
            civilStatus:null,
            education:null,
            primaryPhoneMessage:false,
            consent:'Not asked'
        };

        activate();

        function activate() {
            $loading.start('app');
            
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
                $loading.finish('app');
            }, function(){displayComunicationError('app');});
        }

        function confirm() {

            if(vm.newPaciente.birthDate){
                vm.newPacienteForm.birthDate.$setValidity('required', true);
            }else{
                vm.newPacienteForm.birthDate.$setValidity('required', false);
            }

            if (vm.newPacienteForm.$valid) {
                vm.hideErrorMessage();
                $loading.start('app');
                var paciente = new Paciente();
                paciente.firstName = vm.newPaciente.firstName;
                paciente.otherNames = vm.newPaciente.otherNames;
                paciente.alias = vm.newPaciente.alias;
                paciente.hceNumber = vm.newPaciente.hceNumber;
                paciente.fatherSurname = vm.newPaciente.fatherSurname;
                paciente.motherSurname = vm.newPaciente.motherSurname;
                paciente.documentType = vm.newPaciente.documentType;
                paciente.documentNumber = vm.newPaciente.documentNumber;
                paciente.birthDate = $filter('date')(vm.newPaciente.birthDate, "yyyy-MM-dd");
                paciente.genderAtBirth = vm.newPaciente.genderAtBirth;
                paciente.genderOfChoice = vm.newPaciente.genderOfChoice;
                paciente.email = vm.newPaciente.email;
                paciente.street = vm.newPaciente.street;
                paciente.postal = vm.newPaciente.postal;
                paciente.location = vm.newPaciente.location;
                paciente.primaryPhoneNumber = vm.newPaciente.primaryPhoneNumber;
                paciente.primaryPhoneContact = vm.newPaciente.primaryPhoneContact;
                paciente.primaryPhoneMessage = vm.newPaciente.primaryPhoneMessage;
                paciente.secondPhoneNumber = vm.newPaciente.secondPhoneNumber;
                paciente.secondPhoneContact = vm.newPaciente.secondPhoneContact;
                paciente.secondPhoneMessage = vm.newPaciente.secondPhoneMessage;
                paciente.thirdPhoneNumber = vm.newPaciente.thirdPhoneNumber;
                paciente.thirdPhoneContact = vm.newPaciente.thirdPhoneContact;
                paciente.thirdPhoneMessage = vm.newPaciente.thirdPhoneMessage;
                paciente.occupation = vm.newPaciente.occupation;
                paciente.terms = vm.newPaciente.terms;
                paciente.socialService = vm.newPaciente.socialService;
                paciente.socialServiceNumber = vm.newPaciente.socialServiceNumber;
                paciente.civilStatus = vm.newPaciente.civilStatus;
                paciente.education = vm.newPaciente.education;
                paciente.bornPlace = vm.newPaciente.bornPlace;
                paciente.firstVisit = $filter('date')(vm.newPaciente.firstVisit, "yyyy-MM-dd");
                paciente.notes = vm.newPaciente.notes;
                paciente.consent = vm.newPaciente.consent;
                if(vm.allowDuplicate){

                }
                paciente.$save({allowDuplicate:vm.allowDuplicate},function () {
                        $loading.finish('app');
                        $state.go('newturno');
                    },
                    function(error){
                        if(error.status==400 && error.data == 'Duplicate paciente exists'){
                          toastr.warning('Por favor revise que ya existe un paciente con estos datos');
                          $loading.finish('app');
                          vm.showAllowDuplicate = true;
                        }else{
                            displayComunicationError('app');
                        }
                    }
                );
            } else {
                vm.errorMessage = 'Por favor revise el formulario';
            }
        }

        function hideErrorMessage() {
            vm.errorMessage = null;
        }

        function clearForm() {
            vm.newPaciente = {
                socialService:null,
                civilStatus:null,
                education:null,
                primaryPhoneMessage:false,
                consent:'Not asked'
            };
        }
        
        function openFirstTimeCalendar() {
            vm.firstTimeCalendarPopup.opened = true;
        }

        function openBirthDateCalendar() {
          vm.birthDateCalendarPopup.opened = true;
        }

        function searchLocations() {
            if (vm.selectedDistrict) {
                Location.getFullActiveList({district: vm.selectedDistrict.id}, function(locations){
                    vm.locations = locations;
                },displayComunicationError);
            }
        }

        function searchDistricts() {
            vm.locations = null;
            if (vm.selectedProvince) {
                District.getFullActiveList({province: vm.selectedProvince.id},function(districts){
                    vm.districts = districts;
                },displayComunicationError);
            }
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

    angular.module('turnos.pacientes').controller('NewPacienteCtrl', ['$state', '$loading', '$filter', 'Paciente', 'Document', 'Sex', 'Province', 'District', 'Location', 'SocialService', 'CivilStatus', 'Education', 'toastr', newPacienteCtrl]);
})();
