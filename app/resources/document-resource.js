(function() {
    'use strict';
    function DocumentProvider() {
      function DocumentResource($resource,apiBase) {
        var Document = $resource(apiBase + 'comun/documentType/:documentTypeId/',{documentTypeId:'@id'},{
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

        Document.getUrlForObjectId = function getUrlForObjectId(id){
          return apiBase + 'comun/documentType/' + id + '/';
        };

        return Document;
    	}
      this.$get = ['$resource','apiBase',DocumentResource];
    }
  angular.module('turnos.resources').provider('Document',DocumentProvider);
})();