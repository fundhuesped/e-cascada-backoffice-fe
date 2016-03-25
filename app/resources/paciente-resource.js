(function() {
    'use strict';
    function PacienteProvider() {
      function PacienteResource($resource,apiBase) {
        var Paciente = $resource(apiBase + 'pacientes/paciente/:pacienteId/',{pacienteId:'@id'},{
          update: {
            method:'PUT'
          },
          getActiveList:{
            method: 'GET',
            params:{status:'Active'},
            isArray: true
          },
          getInactiveList:{
            method: 'GET',
            params:{status:'Inactive'},
            isArray: true
          }
        });

        Paciente.getUrlForObjectId = function getUrlForObjectId(id){
          return apiBase + 'pacientes/paciente/' + id + '/';
        };

        return Paciente;
    	}
      this.$get = ['$resource','apiBase',PacienteResource];
    }
  angular.module('turnos.resources').provider('Paciente',PacienteProvider);
})();