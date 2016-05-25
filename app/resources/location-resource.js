(function () {
    'use strict';
    function LocationProvider() {
        function LocationResource($resource, apiBase) {
            function transformDataSet(data){ 
                      return angular.fromJson(data).results;
            }
            var Location = $resource(apiBase + 'comun/location/:id/', {id: '@id'}, {
                update: {
                    method: 'PUT'
                },
                getActiveList: {
                    method: 'GET',
                    params: {status: 'Active', page_size:99},
                    isArray: true,
                    transformResponse: transformDataSet
                },
                getInactiveList: {
                    method: 'GET',
                    params: {status: 'Inactive', page_size:99},
                    isArray: true,
                    transformResponse: transformDataSet
                },
                query:{
                    method: 'GET',
                    isArray: true,
                    transformResponse: transformDataSet
                }
            });

            return Location;
        }

        this.$get = ['$resource', 'apiBase', LocationResource];
    }

    angular.module('turnos.resources').provider('Location', LocationProvider);
})();