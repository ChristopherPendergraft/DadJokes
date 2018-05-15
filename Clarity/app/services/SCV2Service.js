/**
 * Created by ChrisPendergraft on 5/5/16.
 */
 
angular.module('myApp.view2', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/view2', {
            templateUrl: 'view2/view2.html',
            controller: 'DemoCtrl'
        });

