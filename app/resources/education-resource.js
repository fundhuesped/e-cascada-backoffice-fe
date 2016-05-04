(function () {
    'use strict';
    function EducationProvider() {
        function EducationResource($resource, apiBase) {
            function transformDataSet(data){ 
                      return angular.fromJson(data).results;
            }
            var Education = $resource(apiBase + 'comun/educationType/:educationTypeId/', {educationTypeId: '@id'}, {
                update: {
                    method: 'PUT'
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
            Education._getActiveList = Education.getActiveList;
            Education.getActiveList = function(callbackOK,callbackNOK){
              var promise = this._getActiveList(function(data){
                promise = data.results;
                if(callbackOK){
                  callbackOK(data.results);
                }
              },function(error){
                if(callbackNOK){
                  callbackNOK(error);
                }
              });
              return promise;
            };

            Education.getUrlForObjectId = function getUrlForObjectId(id) {
                return apiBase + 'comun/educationType/' + id + '/';
            };

            return Education;
        }

        this.$get = ['$resource', 'apiBase', EducationResource];
    }

    angular.module('turnos.resources').provider('Education', EducationProvider);
})();