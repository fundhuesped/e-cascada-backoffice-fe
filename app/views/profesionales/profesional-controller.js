(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */

    function profesionalCtrl ($loading,$uibModalInstance,$filter,profesional,Document,Sex, Province, District, Location, CivilStatus, Prestacion) {
        var vm = this;
        vm.profesional = angular.copy(profesional);
        vm.editing = true;
        vm.errorMessage = null;
        vm.confirm = confirm;
        vm.showModal = showModal;
        
        function confirm () {
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

        vm.confirmDelete = function confirmDelete(profesionalInstance){
            profesionalInstance.status = 'Inactive';
            profesionalInstance.$update(function(){
                $loading.finish('app');
                $uibModalInstance.close('deleted');
            },function(){
                $loading.finish('app');
                $uibModalInstance.close('deleted');
            });
        }
        vm.confirmReactivate = function confirmReactivate(profesionalInstance){
            profesionalInstance.status = 'Active';
            profesionalInstance.$update(function(){
                $loading.finish('app');
                $uibModalInstance.close('reactivated');
            },function(){
                $loading.finish('app');
                $uibModalInstance.close('reactivated');
            });
        }

        vm.confirmStatusChange = function confirmDelete(){
            var profesionalInstance = angular.copy(profesional);
            $loading.start('app');
            if(profesionalInstance.status=='Active'){
                vm.confirmDelete(profesionalInstance);
            }else{
                if(profesionalInstance.status=='Inactive'){
                    vm.confirmReactivate(profesionalInstance);
                }
            }
        };

        vm.changeStatus = function changeStatus() {
            vm.showModal();
        };

        vm.cancel = function cancel (){
            $uibModalInstance.dismiss('cancel');
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

        vm.init = function init(){
            vm.documents = Document.getActiveList();
            vm.sexTypes = Sex.getActiveList();
            vm.provinces = Province.getActiveList();
            vm.districts = District.getActiveList();
            vm.locations = Location.getActiveList();
            vm.civilStatusTypes = CivilStatus.getActiveList();
            vm.selectedDistrict = vm.profesional.location.district;
            vm.selectedProvince = vm.profesional.location.district.province;
            vm.prestaciones = Prestacion.getActiveList();
        };
        vm.init();

    }
    angular.module('turnos.profesionales').controller('ProfesionalCtrl',['$loading','$uibModalInstance','$filter','profesional','Document','Sex', 'Province', 'District', 'Location', 'CivilStatus', 'Prestacion', profesionalCtrl]);
})();