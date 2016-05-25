(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */

    function profesionalCtrl ($loading,$uibModalInstance,$filter,profesional,Document,Sex, Province, District, Location, CivilStatus, Prestacion, Especialidad, Profesional) {
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


        activate();

        function activate(){
            Profesional.get({id:profesional.id}, function(returnedObject){
                vm.profesional = returnedObject;
                vm.documents = Document.getActiveList();
                vm.sexTypes = Sex.getActiveList();
                vm.provinces = Province.getActiveList();
                vm.districts = District.getActiveList();
                vm.locations = Location.getActiveList();
                vm.civilStatusTypes = CivilStatus.getActiveList();
                vm.selectedDistrict = vm.profesional.location.district;
                vm.selectedProvince = vm.profesional.location.district.province;
                vm.profesional.primaryPhoneMessage = (vm.profesional.primaryPhoneMessage?vm.profesional.primaryPhoneMessage:false);
                if(vm.profesional.prestaciones && vm.profesional.prestaciones.length>0){
                    vm.selectedEspecialidad = vm.profesional.prestaciones[0].especialidad;
                    vm.prestaciones = Prestacion.getActiveList({especialidad:vm.selectedEspecialidad.id});
                }
                vm.especialidades = Especialidad.getActiveList();
            });
        }


        function searchPrestacionesForEspecialidad(){
            vm.prestaciones = Prestacion.getActiveList({especialidad: vm.selectedEspecialidad.id});
        }
        
        function confirm () {
          if(vm.profesional.birthDate){
                vm.profesionalForm.birthDate.$setValidity('required', true);
            }else{
                vm.profesionalForm.birthDate.$setValidity('required', false);
            }
            if(vm.profesionalForm.$valid){
                vm.hideErrorMessage();
                $loading.start('app');
                vm.profesional.birthDate = $filter('date')(vm.profesional.birthDate, 'yyyy-MM-dd');
                vm.profesional.$update(function(){
                    $loading.finish('app');
                    $uibModalInstance.close('modified');
                },function(){
                    $loading.finish('app');
                    vm.showErrorMessage();
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

        vm.dismissModal = function showModal(){
            vm.modalStyle = {};
        };
        vm.showErrorMessage = function showErrorMessage(){
            vm.errorMessage = 'Ocurio un error en la comunicación';
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
                $loading.finish('app');
                $uibModalInstance.close('deleted');
            });
        }
        function confirmReactivate(profesionalInstance){
            profesionalInstance.status = 'Active';
            profesionalInstance.$update(function(){
                $loading.finish('app');
                $uibModalInstance.close('reactivated');
            },function(){
                $loading.finish('app');
                $uibModalInstance.close('reactivated');
            });
        }

        function confirmStatusChange(){
            var profesionalInstance = angular.copy(vm.profesional);
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
                vm.locations = Location.getActiveList({district: vm.selectedDistrict.id});
            }
        };

        vm.searchDistricts = function searchDistricts() {
            vm.locations = [];
            if (vm.selectedProvince) {
                vm.districts = District.getActiveList({province: vm.selectedProvince.id});
            }
        };



    }
    angular.module('turnos.profesionales').controller('ProfesionalCtrl',['$loading','$uibModalInstance','$filter','profesional','Document','Sex', 'Province', 'District', 'Location', 'CivilStatus', 'Prestacion', 'Especialidad', 'Profesional', profesionalCtrl]);
})();