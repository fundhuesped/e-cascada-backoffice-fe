(function () {
    'use strict';
    function ProvinceProvider() {
        function ProvinceResource($resource, apiBase) {
            var Province = $resource(apiBase + 'comun/province/:provinceId/', {provinceId: '@id'}, {
                update: {
                    method: 'PUT'
                },
                getActiveList: {
                    method: 'GET',
                    params: {status: 'Active'},
                    isArray: true
                },
                getInactiveList: {
                    method: 'GET',
                    params: {status: 'Inactive'},
                    isArray: true
                }
            });

            Province.getUrlForObjectId = function getUrlForObjectId(id) {
                return apiBase + 'comun/province/' + id + '/';
            };

            return Province;
        }

        this.$get = ['$resource', 'apiBase', ProvinceResource];
    }

    angular.module('turnos.resources').provider('Province', ProvinceProvider);
})();