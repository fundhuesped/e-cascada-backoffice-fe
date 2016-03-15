(function() {
    'use strict';
    function EspecialidadProvider() {
      function EspecialidadResource($resource,apiBase) {
        var Especialidad = $resource(apiBase + 'especialidad/:especialidadId/',{especialidadId:'@id'},{
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

        Especialidad.getUrlForObjectId = function getUrlForObjectId(id){
          return apiBase + 'especialidad/' + id + '/';
        };

        return Especialidad;
    	}
      this.$get = ['$resource','apiBase',EspecialidadResource];
    }
  angular.module('turnos.resources').provider('Especialidad',EspecialidadProvider);
})();