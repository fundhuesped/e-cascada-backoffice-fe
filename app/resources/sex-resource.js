(function() {
    'use strict';
    function SexProvider() {
      function SexResource($resource,apiBase) {
        function transformDataSet(data){ 
          return angular.fromJson(data).results;
        }        
        var Sex = $resource(apiBase + 'comun/sexType/:id/',{id:'@id'},{
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

        return Sex;
    	}
      this.$get = ['$resource','apiBase',SexResource];
    }
  angular.module('turnos.resources').provider('Sex',SexProvider);
})();