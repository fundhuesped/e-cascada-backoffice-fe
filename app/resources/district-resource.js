(function () {
    'use strict';
    function DistrictProvider() {
        function DistrictResource($resource, apiBase) {
            function transformDataSet(data){ 
                      return angular.fromJson(data).results;
            }
            var District = $resource(apiBase + 'comun/district/:id/', {id: '@id'}, {
                update: {
                    method: 'PUT'
                },
                getActiveList:{
                    method: 'GET',
                    params:{status:'Active',page_size:99},
                    isArray: true,
                    transformResponse: transformDataSet
                  },
                getInactiveList:{
                    method: 'GET',
                    params:{status:'Inactive',page_size:99},
                    isArray: true,
                    transformResponse: transformDataSet
                },
                query:{
                    method: 'GET',
                    isArray: true,
                    transformResponse: transformDataSet
                }
            });

            return District;
        }

        this.$get = ['$resource', 'apiBase', DistrictResource];
    }

    angular.module('turnos.resources').provider('District', DistrictProvider);
})();