(function () {
    'use strict';
    function SocialServiceProvider() {
        function SocialServiceResource($resource, apiBase) {
            var SocialService = $resource(apiBase + 'comun/socialService/:socialServiceId/', {socialServiceId: '@id'}, {
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

            SocialService.getUrlForObjectId = function getUrlForObjectId(id) {
                return apiBase + 'comun/socialService/' + id + '/';
            };

            return SocialService;
        }

        this.$get = ['$resource', 'apiBase', SocialServiceResource];
    }

    angular.module('turnos.resources').provider('SocialService', SocialServiceProvider);
})();