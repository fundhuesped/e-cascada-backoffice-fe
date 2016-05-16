(function() {
    'use strict';
    function EspecialidadProvider() {
      function EspecialidadResource($resource,apiBase) {
        function transformDataSet(data){ 
                  return angular.fromJson(data).results;
        }
        var Especialidad = $resource(apiBase + 'practicas/especialidad/:especialidadId/',{especialidadId:'@id'},{
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

        Especialidad.getUrlForObjectId = function getUrlForObjectId(id){
          return apiBase + 'practicas/especialidad/' + id + '/';
        };

        return Especialidad;
    	}
      this.$get = ['$resource','apiBase',EspecialidadResource];
    }
  angular.module('turnos.resources').provider('Especialidad',EspecialidadProvider);
})();