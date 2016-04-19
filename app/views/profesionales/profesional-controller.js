(function(){
    'use strict';

    function profesionalCtrl ($loading,$uibModalInstance,$filter,profesional,Document,Sex, Province, District, Location, CivilStatus, Prestacion) {
        this.profesional = angular.copy(profesional);
        this.editing = true;
        this.errorMessage = null;

        this.confirm = function confirm () {
            if(this.profesionalForm.$valid){
                this.hideErrorMessage();
                $loading.start('app');
                this.profesional.birthDate = $filter('date')(this.profesional.birthDate, "yyyy-MM-dd");
                this.profesional.$update(function(){
                    $loading.finish('app');
                    $uibModalInstance.close('modified');
                },function(){
                    this.showErrorMessage();
                }.bind(this));
            }else{
                this.errorMessage = 'Por favor revise el formulario';
            }
        };

        //Confirm delete modal
        this.showModal = function showModal(){
            this.modalStyle = {display:'block'};
        };

        this.confirmModal = function confirmModal(){
            this.confirmStatusChange();
        };

        this.dismissModal = function showModal(){
            this.modalStyle = {};
        };
        this.showErrorMessage = function showErrorMessage(){
            this.errorMessage = 'Ocurio un error en la comunicación';
        };
        this.hideErrorMessage = function hideErrorMessage(){
            this.errorMessage = null;
        };

        this.confirmDelete = function confirmDelete(profesionalInstance){
            profesionalInstance.status = 'Inactive';
            profesionalInstance.$update(function(){
                $loading.finish('app');
                $uibModalInstance.close('deleted');
            },function(){
                $loading.finish('app');
                $uibModalInstance.close('deleted');
            });
        }
        this.confirmReactivate = function confirmReactivate(profesionalInstance){
            profesionalInstance.status = 'Active';
            profesionalInstance.$update(function(){
                $loading.finish('app');
                $uibModalInstance.close('reactivated');
            },function(){
                $loading.finish('app');
                $uibModalInstance.close('reactivated');
            });
        }

        this.confirmStatusChange = function confirmDelete(){
            var profesionalInstance = angular.copy(profesional);
            $loading.start('app');
            if(profesionalInstance.status=='Active'){
                this.confirmDelete(profesionalInstance);
            }else{
                if(profesionalInstance.status=='Inactive'){
                    this.confirmReactivate(profesionalInstance);
                }
            }
        };

        this.changeStatus = function changeStatus() {
            this.showModal();
        };

        this.cancel = function cancel (){
            $uibModalInstance.dismiss('cancel');
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

        this.init = function init(){
            this.documents = Document.getActiveList();
            this.sexTypes = Sex.getActiveList();
            this.provinces = Province.getActiveList();
            this.districts = District.getActiveList();
            this.locations = Location.getActiveList();
            this.civilStatusTypes = CivilStatus.getActiveList();
            this.selectedDistrict = this.profesional.location.district;
            this.selectedProvince = this.profesional.location.district.province;
            this.prestaciones = Prestacion.getActiveList();
        };
        this.init();

    }
    angular.module('turnos.profesionales').controller('ProfesionalCtrl',['$loading','$uibModalInstance','$filter','profesional','Document','Sex', 'Province', 'District', 'Location', 'CivilStatus', 'Prestacion', profesionalCtrl]);
})();