(function() {
    'use strict';
    function ProfesionalProvider() {
      function ProfesionalResource($resource,apiBase) {
        function transformDataSet(data){ 
                  return angular.fromJson(data).results;
        }
        var Profesional = $resource(apiBase + 'practicas/profesional/:id/',{id:'@id'},{
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
          },
          queryPaginated:{
           method: 'GET',
           isArray: false
          },
          getPaginatedActiveList:{
           method: 'GET',
           isArray: false
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