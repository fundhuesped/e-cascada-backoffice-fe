(function () {
    'use strict';

    function newPacienteCtrl($loading, $uibModalInstance, $filter, Paciente, Document, Sex, Province, District, Location, SocialService, CivilStatus, Education) {
        this.newPaciente = {
            socialService:null,
            civilStatus:null,
            education:null
        };

        this.confirm = function confirm() {
            if (this.newPacienteForm.$valid) {
                this.hideErrorMessage();
                $loading.start('app');
                var paciente = new Paciente();
                paciente.firstName = this.newPaciente.firstName;
                paciente.otherNames = this.newPaciente.otherNames;
                paciente.fatherSurname = this.newPaciente.fatherSurname;
                paciente.motherSurname = this.newPaciente.motherSurname;
                paciente.documentType = this.newPaciente.documentType;
                paciente.documentNumber = this.newPaciente.documentNumber;
                paciente.birthDate = $filter('date')(this.newPaciente.birthDate, "yyyy-MM-dd");
                paciente.genderAtBirth = this.newPaciente.genderAtBirth;
                paciente.genderOfChoice = this.newPaciente.genderOfChoice;
                paciente.email = this.newPaciente.email;
                paciente.status = 'Active';
                paciente.street = this.newPaciente.street;
                paciente.postal = this.newPaciente.postal;
                paciente.location = this.newPaciente.location;
                paciente.primaryPhoneNumber = this.newPaciente.primaryPhoneNumber;
                paciente.primaryPhoneContact = this.newPaciente.primaryPhoneContact;
                paciente.primaryPhoneMessage = this.newPaciente.primaryPhoneMessage;
                paciente.secondPhoneNumber = this.newPaciente.secondPhoneNumber;
                paciente.secondPhoneContact = this.newPaciente.secondPhoneContact;
                paciente.secondPhoneMessage = this.newPaciente.secondPhoneMessage;
                paciente.thirdPhoneNumber = this.newPaciente.thirdPhoneNumber;
                paciente.thirdPhoneContact = this.newPaciente.thirdPhoneContact;
                paciente.thirdPhoneMessage = this.newPaciente.thirdPhoneMessage;
                paciente.occupation = this.newPaciente.occupation;
                paciente.terms = this.newPaciente.terms;
                paciente.socialService = this.newPaciente.socialService;
                paciente.socialServiceNumber = this.newPaciente.socialServiceNumber;
                paciente.civilStatus = this.newPaciente.civilStatus;
                paciente.education = this.newPaciente.education;
                paciente.bornPlace = this.newPaciente.bornPlace;
                paciente.firstVisit = $filter('date')(this.newPaciente.firstVisit, "yyyy-MM-dd");
                paciente.notes = this.newPaciente.notes;
                paciente.$save(function () {
                        $loading.finish('app');
                        $uibModalInstance.close('created');
                    }, function (error) {
                        $loading.finish('app');
                        this.showErrorMessage();
                    }.bind(this)
                );
            } else {
                this.errorMessage = 'Por favor revise el formulario';
            }
        };
        this.close = function close() {
            $uibModalInstance.dismiss('cancel');
        };
        this.showErrorMessage = function showErrorMessage() {
            this.errorMessage = 'Ocurio un error en la comunicación';
        };
        this.hideErrorMessage = function hideErrorMessage() {
            this.errorMessage = null;
        };
        this.clearForm = function clearForm() {
            if (this.isModal) {

            } else {
                this.newPaciente.name = '';
                this.newPaciente.description = '';
            }
        };

        this.searchLocations = function searchLocations() {
            this.locations = [];
            if (this.selectedDistrict) {
                this.locations = Location.query({district: this.selectedDistrict.id, status: 'Active'});
            }
        };

        this.searchDistricts = function searchDistricts() {
            this.districts = [];
            if (this.selectedProvince) {
                this.districts = District.query({province: this.selectedProvince.id, status: 'Active'});
            }
        };

        this.init = function init() {
            this.documents = Document.getActiveList();
            this.sexTypes = Sex.getActiveList();
            this.provinces = Province.getActiveList();
            this.socialServices = SocialService.getActiveList();
            this.civilStatusTypes = CivilStatus.getActiveList();
            this.educationTypes = Education.getActiveList();
        };
        this.init();
    }

    angular.module('turnos.pacientes').controller('NewPacienteCtrl', ['$loading', '$uibModalInstance', '$filter', 'Paciente', 'Document', 'Sex', 'Province', 'District', 'Location', 'SocialService', 'CivilStatus', 'Education', newPacienteCtrl]);
})();