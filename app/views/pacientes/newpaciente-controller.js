(function () {
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */

    function newPacienteCtrl($loading, $uibModalInstance, $filter, Paciente, Document, Sex, Province, District, Location, SocialService, CivilStatus, Education) {
        var vm = this;
        vm.locations = null;
        vm.districts = null;
        vm.selectedProvince = null;
        vm.close = close;
        vm.clearForm = clearForm;
        vm.searchLocations = searchLocations;
        vm.hideErrorMessage = hideErrorMessage;
        vm.showErrorMessage = showErrorMessage;
        vm.searchDistricts = searchDistricts;
        vm.confirm = confirm;

        vm.newPaciente = {
            socialService:null,
            civilStatus:null,
            education:null,
            primaryPhoneMessage:false
        };

        activate();

        function activate() {
            vm.documents = Document.getActiveList();
            vm.sexTypes = Sex.getActiveList();
            vm.provinces = Province.getActiveList();
            vm.socialServices = SocialService.getActiveList();
            vm.civilStatusTypes = CivilStatus.getActiveList();
            vm.educationTypes = Education.getActiveList();
        }

        function confirm() {
            if (vm.newPacienteForm.$valid) {
                vm.hideErrorMessage();
                $loading.start('app');
                var paciente = new Paciente();
                paciente.firstName = vm.newPaciente.firstName;
                paciente.otherNames = vm.newPaciente.otherNames;
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
                paciente.$save(function () {
                        $loading.finish('app');
                        $uibModalInstance.close('created');
                    }, function (error) {
                        $loading.finish('app');
                        vm.showErrorMessage();
                    }.bind(vm)
                );
            } else {
                vm.errorMessage = 'Por favor revise el formulario';
            }
        }

        function close() {
            $uibModalInstance.dismiss('cancel');
        }

        function showErrorMessage() {
            vm.errorMessage = 'Ocurio un error en la comunicación';
        }

        function hideErrorMessage() {
            vm.errorMessage = null;
        }

        function clearForm() {
            if (vm.isModal) {

            } else {
                vm.newPaciente.name = '';
                vm.newPaciente.description = '';
            }
        }

        function searchLocations() {
            if (vm.selectedDistrict) {
                vm.locations = Location.query({district: vm.selectedDistrict.id, status: 'Active'});
            }
        }

        function searchDistricts() {
            vm.locations = null;
            if (vm.selectedProvince) {
                vm.districts = District.query({province: vm.selectedProvince.id, status: 'Active'});
            }
        }


    }

    angular.module('turnos.pacientes').controller('NewPacienteCtrl', ['$loading', '$uibModalInstance', '$filter', 'Paciente', 'Document', 'Sex', 'Province', 'District', 'Location', 'SocialService', 'CivilStatus', 'Education', newPacienteCtrl]);
})();
