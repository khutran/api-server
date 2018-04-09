(function() {
    angular
        .module('loginApp', [])
        .controller('loginController', ($scope, $http, $window) => {
            $scope.login = async function(user) {
                try {
                    let data = await $http({
                        method: 'POST',
                        url: "/api/login",
                        data: {
                            email: user.email,
                            password: user.password
                        }
                    });

                    $window.location.href = "/user";
                } catch (e) {
                    $scope.error = e.data;
                    $scope.$apply();
                }
            }
        });
})();