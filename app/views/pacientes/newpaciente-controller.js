(function(){
    'use strict';

    function newPacienteCtrl ($loading,$uibModalInstance,$filter,Paciente,Document,Sex) {
        this.confirm = function confirm () {
            if(this.newPacienteForm.$valid){
                this.hideErrorMessage();
                $loading.start('newPaciente');
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
                paciente.telephone = this.newPaciente.telephone;
                paciente.status = 'Active';
                paciente.$save(function(){
                        $loading.finish('newPaciente');
                        $uibModalInstance.close('created');
                    },function(error){
                        this.showErrorMessage();
                    }
                );
            }else{
                this.errorMessage = 'Por favor revise el formulario';
            }
        };
        this.close = function close (){
            $uibModalInstance.dismiss('cancel');
        };
        this.showErrorMessage = function showErrorMessage(){
            this.errorMessage = 'Ocurio un error en la comunicación';
        };
        this.hideErrorMessage = function hideErrorMessage(){
            this.errorMessage = null;
        };
        this.clearForm = function clearForm () {
            if(this.isModal){

            }else{
                this.newPaciente.name = '';
                this.newPaciente.description = '';
            }
        };

        this.init = function init(){
            this.documents = Document.getActiveList();
            this.sexTypes = Sex.getActiveList()
        };
        this.init();
    }
    angular.module('turnos.pacientes').controller('NewPacienteCtrl',['$loading','$uibModalInstance','$filter','Paciente','Document','Sex',newPacienteCtrl]);
})();