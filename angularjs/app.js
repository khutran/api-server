// (function() {
//     angular
//         .module('app', ['moduleUser'])
//         .controller('myController', ($scope, $window) => {
//         	console.log($window.user_id);
//         })

//     // let injector = angular.injector(['ng', 'Myapp'])
//     // console.log(injector);
// })

require('./api/');


(function(app) {

})(angular.module('app', [
	'app.api'
]));