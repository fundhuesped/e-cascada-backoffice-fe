(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */

    function pacienteCtrl ($loading,$uibModalInstance,$filter,paciente,Document,Turno,Sex, Province, District, Location, SocialService, CivilStatus, Education) {
        var vm = this;

        vm.paciente = angular.copy(paciente);
        vm.editing = true;
        vm.errorMessage = null;
        vm.turnos = [];
        vm.confirm = confirm;
        vm.confirmDelete = confirmDelete;
        vm.confirmReactivate = confirmReactivate;
        vm.changeStatus = changeStatus;
        vm.searchLocations = searchLocations;
        vm.searchDistricts = searchDistricts;
        vm.cancel = cancel;
        
        vm.confirmStatusChange = confirmStatusChange;
        activate();

        function activate(){
            //TODO: Make sure everything is set to callback
            vm.documents = Document.getActiveList();
            vm.sexTypes = Sex.getActiveList();
            vm.provinces = Province.getActiveList();
            vm.districts = District.getActiveList();
            vm.locations = Location.getActiveList();
            vm.civilStatusTypes = CivilStatus.getActiveList();
            vm.educationTypes = Education.getActiveList();
            vm.socialServices = SocialService.getActiveList();
            vm.selectedDistrict = vm.paciente.location.district;
            vm.selectedProvince = {id:vm.paciente.location.district.province.id};
            vm.turnos = Turno.query({status:'Active',paciente:vm.paciente.id, order_field:'day', order_by:'desc'});
        }

        function confirm () {
            if(vm.pacienteForm.$valid){
                vm.hideErrorMessage();
                $loading.start('app');
                vm.paciente.birthDate = $filter('date')(vm.paciente.birthDate, 'yyyy-MM-dd');
                vm.paciente.firstVisit = $filter('date')(vm.paciente.firstVisit, 'yyyy-MM-dd');
                vm.paciente.$update(function(){
                    $loading.finish('app');
                    $uibModalInstance.close('modified');
                },function(){
                    vm.showErrorMessage();
                });
            }else{
                vm.errorMessage = 'Por favor revise el formulario';
            }
        }

        //Confirm delete modal
        vm.showModal = function showModal(){
            vm.modalStyle = {display:'block'};
        };

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

        function confirmStatusChange(pacienteInstance){
            pacienteInstance.status = 'Inactive';
            pacienteInstance.$update(function(){
                $loading.finish('app');
                $uibModalInstance.close('deleted');
            },function(){
                $loading.finish('app');
                $uibModalInstance.close('deleted');
            });
        }
        function confirmReactivate(pacienteInstance){
            pacienteInstance.status = 'Active';
            pacienteInstance.$update(function(){
                $loading.finish('app');
                $uibModalInstance.close('reactivated');
            },function(){
                $loading.finish('app');
                $uibModalInstance.close('reactivated');
            });
        }
        //confirmStatusChange
        function confirmDelete(){
            var pacienteInstance = angular.copy(paciente);
            $loading.start('app');
            if(pacienteInstance.status=='Active'){
                vm.confirmDelete(pacienteInstance);
            }else{
                if(pacienteInstance.status=='Inactive'){
                    vm.confirmReactivate(pacienteInstance);
                }
            }
        }

        function changeStatus() {
            vm.showModal();
        }

        function cancel (){
            $uibModalInstance.dismiss('cancel');
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
    angular.module('turnos.pacientes').controller('PacienteCtrl',['$loading','$uibModalInstance','$filter','paciente','Document','Turno','Sex', 'Province', 'District', 'Location', 'SocialService', 'CivilStatus', 'Education', pacienteCtrl]);
})();