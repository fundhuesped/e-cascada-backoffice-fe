(function () {
    'use strict';

    function newProfesionalCtrl($loading, $uibModalInstance, $filter, Profesional, Document, Sex, Province, District, Location, CivilStatus, Prestacion) {
        this.newProfesional = {
            socialService:null,
            civilStatus:null,
            education:null,
            prestaciones:null
        };

        this.confirm = function confirm() {
            if (this.newProfesionalForm.$valid) {
                this.hideErrorMessage();
                $loading.start('app');
                var profesional = new Profesional();
                profesional.firstName = this.newProfesional.firstName;
                profesional.otherNames = this.newProfesional.otherNames;
                profesional.fatherSurname = this.newProfesional.fatherSurname;
                profesional.motherSurname = this.newProfesional.motherSurname;
                profesional.documentType = this.newProfesional.documentType;
                profesional.documentNumber = this.newProfesional.documentNumber;
                profesional.birthDate = $filter('date')(this.newProfesional.birthDate, "yyyy-MM-dd");
                profesional.genderAtBirth = this.newProfesional.genderAtBirth;
                profesional.genderOfChoice = this.newProfesional.genderOfChoice;
                profesional.email = this.newProfesional.email;
                //TODO: Set as default
                profesional.status = 'Active';
                profesional.street = this.newProfesional.street;
                profesional.postal = this.newProfesional.postal;
                profesional.location = this.newProfesional.location;
                profesional.primaryPhoneNumber = this.newProfesional.primaryPhoneNumber;
                profesional.primaryPhoneContact = this.newProfesional.primaryPhoneContact;
                profesional.primaryPhoneMessage = this.newProfesional.primaryPhoneMessage || false;
                profesional.civilStatus = this.newProfesional.civilStatus;
                profesional.notes = this.newProfesional.notes;
                profesional.prestaciones = this.newProfesional.prestaciones;
                profesional.$save(function () {
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
                this.newProfesional.name = '';
                this.newProfesional.description = '';
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
            this.civilStatusTypes = CivilStatus.getActiveList();
            this.prestaciones = Prestacion.getActiveList();
        };
        this.init();
    }

    angular.module('turnos.profesionales').controller('NewProfesionalCtrl', ['$loading', '$uibModalInstance', '$filter', 'Profesional', 'Document', 'Sex', 'Province', 'District', 'Location', 'CivilStatus', 'Prestacion', newProfesionalCtrl]);
})();