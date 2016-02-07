(function(){
    'use strict';
    
    function pacienteCtrl ($stateParams, paciente) {
        if(paciente){
            this.paciente = paciente;
            this.isModal = true;
        }else{
            this.paciente =
            {
                id: 1,
                firstname: 'Nicolas',
                othernames: 'Lelio',
                fathersurname: 'Gonzalez',
                mothersurname: 'Benedetti',
                docType: {
                    id: 1,
                    name: 'DNI'
                },
                genderAtBirth: 'M',
                docNumber: '34456863',
                birthdate:'1989-01-07',
                createdAt: '2016-01-02',
                lastModifiedAt: null,
                createdBy: {
                    id:1,
                    name: 'Admin'
                },
                lastModifiedBy:null
            };            
        }


        this.turnos = [
        {
            id: 1,
            fecha: '2016-02-02',
            especialidad: 'Infectologia',
            prestacion: 'Turno infectologia',
            medico: 'Fernandez',
            estado:'Pendiente de confirmar'
        },
        {
            id: 2,
            fecha: '2016-01-28',
            especialidad: 'Infectologia',
            prestacion: 'Turno medicamento',
            medico: 'Fernandez',
            estado:'Confirmado'
        },
        {
            id: 3,
            fecha: '2015-10-16',
            especialidad: 'Infectologia',
            prestacion: 'Turno medicamento',
            medico: 'Fernandez',
            estado:'Cerrado'
        }]    
        this.toggleEdit = function toggleEdit(){
            this.editing = !this.editing;
        };
    }
    angular.module('turnos.pacientes').controller('PacienteCtrl',['$stateParams','paciente',pacienteCtrl]);
})();