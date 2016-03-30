(function () {
    'use strict';
    function DistrictProvider() {
        function DistrictResource($resource, apiBase) {
            var District = $resource(apiBase + 'comun/district/:districtId/', {districtId: '@id'}, {
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

            District.getUrlForObjectId = function getUrlForObjectId(id) {
                return apiBase + 'comun/district/' + id + '/';
            };

            return District;
        }

        this.$get = ['$resource', 'apiBase', DistrictResource];
    }

    angular.module('turnos.resources').provider('District', DistrictProvider);
})();