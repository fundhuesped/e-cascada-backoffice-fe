(function () {
    'use strict';
    function EducationProvider() {
        function EducationResource($resource, apiBase) {
            function transformDataSet(data){ 
                      return angular.fromJson(data).results;
            }
            var Education = $resource(apiBase + 'comun/educationType/:id/', {id: '@id'}, {
                update: {
                    method: 'PUT'
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
                }
            });

            return Education;
        }

        this.$get = ['$resource', 'apiBase', EducationResource];
    }

    angular.module('turnos.resources').provider('Education', EducationProvider);
})();