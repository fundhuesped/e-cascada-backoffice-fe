(function() {
    'use strict';
    function ProfesionalProvider() {
      function ProfesionalResource($resource,apiBase) {
        var Profesional = $resource(apiBase + 'practicas/profesional/:profesionalId/',{profesionalId:'@id'},{
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

        Profesional.getUrlForObjectId = function getUrlForObjectId(id){
          return apiBase + 'practicas/profesional/' + id + '/';
        };

        return Profesional;
    	}
      this.$get = ['$resource','apiBase',ProfesionalResource];
    }
  angular.module('turnos.resources').provider('Profesional',ProfesionalProvider);
})();