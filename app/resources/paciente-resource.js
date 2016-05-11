(function() {
    'use strict';
    function PacienteProvider() {
      function PacienteResource($resource,apiBase) {
        function transformDataSet(data){ 
                  return angular.fromJson(data).results;
        }
        var Paciente = $resource(apiBase + 'pacientes/paciente/:pacienteId/',{pacienteId:'@id'},{
          update: {
            method:'PUT'
          },
          getActiveList:{
            method: 'GET',
            params:{status:'Active'},
            isArray: true,
            transformResponse: transformDataSet
          },
          getInactiveList:{
            method: 'GET',
            params:{status:'Inactive'},
            isArray: true,
            transformResponse: transformDataSet            
          },
          query:{
            method: 'GET',
            isArray: true,
            transformResponse: transformDataSet
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