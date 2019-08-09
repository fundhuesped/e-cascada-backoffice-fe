(function(){
    'use strict';
    function loginRedirectInterceptor($injector, $q ) {
        var self = this;
        self.errorMessageShowing = false;
        var loginRedirectInterceptor = {
            responseError: function(response) {
                var $state = $injector.get('$state');
                var $timeout = $injector.get('$timeout');
                if (response.status === 401 || response.status === 403)
                {
                    $state.go('login', {returnTo:$state.current.name, withParams:$state.params}, {custom:{'silent': true, loggedOut: true}});
                    response.data.detail = 'Su sesión fue cerrada'; 
                    if(!self.errorMessageShowing){
                        var toastr = $injector.get('toastr');
                        toastr.error('Su sesión fue cerrada');
                        self.errorMessageShowing = true;
                        $timeout(
                            function() {
                              self.errorMessageShowing = false;
                            }, 1500);
                    }
                }
                return $q.reject(response);
            }
        };
        return loginRedirectInterceptor;
    }
    angular.module('turnos.app').factory('loginRedirectInterceptor', ['$injector', '$q', loginRedirectInterceptor]);
    /*
      CAMBIAR ESTO
    */
    angular.module('turnos.app').config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('loginRedirectInterceptor');
    }]);
})();