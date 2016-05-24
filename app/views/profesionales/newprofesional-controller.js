(function () {
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */
    angular
        .module('turnos.profesionales')
        .controller('NewProfesionalCtrl',newProfesionalCtrl);
        
    newProfesionalCtrl.$inject = ['$loading',
                                  '$uibModalInstance',
                                  '$filter', 
                                  'Profesional', 
                                  'Document', 
                                  'Sex', 
                                  'Province', 
                                  'District', 
                                  'Location', 
                                  'CivilStatus', 
                                  'Prestacion',
                                  'Especialidad'];

    function newProfesionalCtrl($loading, $uibModalInstance, $filter, Profesional, Document, Sex, Province, District, Location, CivilStatus, Prestacion,Especialidad) {
        var vm = this;
        vm.searchPrestacionesForEspecialidad = searchPrestacionesForEspecialidad;
        vm.especialidades = [];
        vm.selectedEspecialidad = {};
        vm.newProfesional = {
            socialService:null,
            civilStatus:null,
            education:null,
            prestaciones:null
        };

        activate();

        function activate() {
            vm.documents = Document.getActiveList();
            vm.sexTypes = Sex.getActiveList();
            vm.provinces = Province.getActiveList();
            vm.civilStatusTypes = CivilStatus.getActiveList();
            vm.especialidades = Especialidad.getActiveList();
        }

        function searchPrestacionesForEspecialidad(){
            vm.prestaciones = Prestacion.getActiveList({especialidad: vm.selectedEspecialidad.id});
        }

        vm.confirm = function confirm() {
            if(vm.newProfesional.birthDate){
                vm.newProfesionalForm.birthDate.$setValidity('required', true);
            }else{
                vm.newProfesionalForm.birthDate.$setValidity('required', false);
            }
            
            if (vm.newProfesionalForm.$valid) {
                vm.hideErrorMessage();
                $loading.start('app');
                var profesional = new Profesional();
                profesional.firstName = vm.newProfesional.firstName;
                profesional.otherNames = vm.newProfesional.otherNames;
                profesional.fatherSurname = vm.newProfesional.fatherSurname;
                profesional.motherSurname = vm.newProfesional.motherSurname;
                profesional.documentType = vm.newProfesional.documentType;
                profesional.documentNumber = vm.newProfesional.documentNumber;
                profesional.birthDate = $filter('date')(vm.newProfesional.birthDate, "yyyy-MM-dd");
                profesional.genderAtBirth = vm.newProfesional.genderAtBirth;
                profesional.genderOfChoice = vm.newProfesional.genderOfChoice;
                profesional.email = vm.newProfesional.email;
                //TODO: Set as default
                profesional.status = 'Active';
                profesional.street = vm.newProfesional.street;
                profesional.postal = vm.newProfesional.postal;
                profesional.location = vm.newProfesional.location;
                profesional.primaryPhoneNumber = vm.newProfesional.primaryPhoneNumber;
                profesional.primaryPhoneContact = vm.newProfesional.primaryPhoneContact;
                profesional.primaryPhoneMessage = vm.newProfesional.primaryPhoneMessage || false;
                profesional.civilStatus = vm.newProfesional.civilStatus;
                profesional.notes = vm.newProfesional.notes;
                profesional.prestaciones = vm.newProfesional.prestaciones;
                profesional.$save(function () {
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
        };
        vm.close = function close() {
            $uibModalInstance.dismiss('cancel');
        };
        vm.showErrorMessage = function showErrorMessage() {
            vm.errorMessage = 'Ocurio un error en la comunicación';
        };
        vm.hideErrorMessage = function hideErrorMessage() {
            vm.errorMessage = null;
        };
        vm.clearForm = function clearForm() {
            if (vm.isModal) {

            } else {
                vm.newProfesional.name = '';
                vm.newProfesional.description = '';
            }
        };

        vm.searchLocations = function searchLocations() {
            vm.locations = [];
            if (vm.selectedDistrict) {
                vm.locations = Location.query({district: vm.selectedDistrict.id, status: 'Active'});
            }
        };

        vm.searchDistricts = function searchDistricts() {
            vm.districts = [];
            if (vm.selectedProvince) {
                vm.districts = District.query({province: vm.selectedProvince.id, status: 'Active'});
            }
        };
        

    }
})();