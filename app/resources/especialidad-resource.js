(function() {
    'use strict';
    function EspecialidadProvider() {
      function EspecialidadResource($resource,apiBase) {
        function transformDataSet(data){ 
                  return angular.fromJson(data).results;
        }
        var Especialidad = $resource(apiBase + 'practicas/especialidad/:id/',{id:'@id'},{
          update: {
            method:'PUT'
          },
          getActiveList:{
            method: 'GET',
            params:{status:'Active', page_size:99},
            isArray: true,
            transformResponse: transformDataSet
          },
          getInactiveList:{
            method: 'GET',
            params:{status:'Inactive', page_size:99},
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
            params:{status:'Active'},
            isArray: false
          }
        });

        return Especialidad;
    	}
      this.$get = ['$resource','apiBase',EspecialidadResource];
    }
  angular.module('turnos.resources').provider('Especialidad',EspecialidadProvider);
})();