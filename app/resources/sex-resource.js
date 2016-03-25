(function() {
    'use strict';
    function SexProvider() {
      function SexResource($resource,apiBase) {
        var Sex = $resource(apiBase + 'comun/sexType/:sexTypeId/',{sexTypeId:'@id'},{
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

        Sex.getUrlForObjectId = function getUrlForObjectId(id){
          return apiBase + 'comun/sexType/' + id + '/';
        };

        return Sex;
    	}
      this.$get = ['$resource','apiBase',SexResource];
    }
  angular.module('turnos.resources').provider('Sex',SexProvider);
})();