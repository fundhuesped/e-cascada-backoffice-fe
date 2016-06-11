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
        vm.searchDistricts = searchDistricts;
        vm.searchLocations = searchLocations;
        vm.close = close;
        vm.showErrorMessage = showErrorMessage;
        vm.hideErrorMessage = hideErrorMessage;
        vm.confirm = confirm;
        vm.openBirthDateCalendar = openBirthDateCalendar;
        vm.newProfesional = {
            socialService:null,
            civilStatus:null,
            education:null,
            prestaciones:null,
            primaryPhoneMessage:false
        };
        vm.birthDateCalendarPopup = {
          opened: false,
          options: {
            maxDate: new Date(),
          }
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

        function confirm() {
            if (vm.newProfesionalForm.$valid) {
                vm.hideErrorMessage();
                $loading.start('app');
                var profesional = new Profesional();
                profesional.firstName = vm.newProfesional.firstName;
                profesional.otherNames = vm.newProfesional.otherNames;
                profesional.fatherSurname = vm.newProfesional.fatherSurname;
                profesional.motherSurname = vm.newProfesional.motherSurname;
                profesional.licenseNumber = vm.newProfesional.licenseNumber;
                profesional.municipalNumber = vm.newProfesional.municipalNumber;
                profesional.documentType = vm.newProfesional.documentType;
                profesional.documentNumber = vm.newProfesional.documentNumber;
                profesional.birthDate = (vm.newProfesional.birthDate?$filter('date')(vm.newProfesional.birthDate, "yyyy-MM-dd"):null);
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
        
        function close() {
            $uibModalInstance.dismiss('cancel');
        }
        
        function showErrorMessage() {
            vm.errorMessage = 'Ocurio un error en la comunicación';
        }

        function hideErrorMessage() {
            vm.errorMessage = null;
        }

        function searchLocations() {
            if (vm.selectedDistrict) {
                vm.locations = Location.getActiveList({district: vm.selectedDistrict.id});
            }
        }

        function openBirthDateCalendar() {
          vm.birthDateCalendarPopup.opened = true;
        }
        
        function searchDistricts() {
            vm.locations = [];
            if (vm.selectedProvince) {
                vm.districts = District.getActiveList({province: vm.selectedProvince.id});
            }
        }
        

    }
})();