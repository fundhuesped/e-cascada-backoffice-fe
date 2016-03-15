(function() {
    'use strict';
    function PrestacionProvider() {
      function PrestacionResource($resource,apiBase) {
        var Prestacion = $resource(apiBase + 'prestacion/:prestacionId/',{prestacionId:'@id'},{
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
        return Prestacion;
    	}
      this.$get = ['$resource','apiBase',PrestacionResource];
    }
  angular.module('turnos.resources').provider('Prestacion',PrestacionProvider);
})();