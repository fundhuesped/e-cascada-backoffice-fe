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
                                  'Especialidad', 
                                  'toastr'];

    function newProfesionalCtrl($loading, $uibModalInstance, $filter, Profesional, Document, Sex, Province, District, Location, CivilStatus, Prestacion,Especialidad, toastr) {
        var vm = this;
        vm.searchPrestacionesForEspecialidad = searchPrestacionesForEspecialidad;
        vm.especialidades = [];
        vm.selectedEspecialidad = {};
        vm.searchDistricts = searchDistricts;
        vm.searchLocations = searchLocations;
        vm.close = close;
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
            vm.documents = Document.getFullActiveList();
            vm.sexTypes = Sex.getFullActiveList();
            vm.provinces = Province.getFullActiveList();
            vm.civilStatusTypes = CivilStatus.getFullActiveList();
            vm.especialidades = Especialidad.getFullActiveList();

            
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
            }, function(){displayComunicationError('app');});
            
            Especialidad.getFullActiveList(function(especialidades){
                vm.especialidades = especialidades;
                $loading.finish('app');
            }, function(){displayComunicationError('app');});


        }

        displayComunicationError('app');

        function searchPrestacionesForEspecialidad(){
            Prestacion.getFullActiveList({especialidad: vm.selectedEspecialidad.id},function(prestaciones){
                vm.prestaciones = prestaciones;
            }, function(){displayComunicationError('app');});
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
                    }, function () {
                        displayComunicationError('app');
                    }
                );
            } else {
                vm.errorMessage = 'Por favor revise el formulario';
            }
        }
        
        function close() {
            $uibModalInstance.dismiss('cancel');
        }

        function hideErrorMessage() {
            vm.errorMessage = null;
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
})();