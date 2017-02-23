(function(){
    'use strict';
    function tokenInjector($injector) {  
        var tokenInjector = {
            request: function(config) {
                var SessionSrv = $injector.get('SessionService');
                if (SessionSrv.currentToken) {     
                    if(config.url.indexOf('login') > -1){
                        return config;
                    }    
                    config.headers['Authorization'] = 'Token ' + SessionSrv.currentToken;
                }
                return config;
            }
        };
        return tokenInjector;
    }

    angular.module('turnos.app').factory('tokenInjector', ['$injector', tokenInjector]);  

    angular.module('turnos.app').config(['$httpProvider', function($httpProvider) {  
        $httpProvider.interceptors.push('tokenInjector');
    }]);

})();