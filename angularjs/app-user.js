(function() {

    let moduleUser = angular
        .module('moduleUser', [])
        .provider('providerUser', providerUser)
        .controller('controllerUser', controllerUser);

    function providerUser() {
        this.$get = async function($http, $rootScope, $window) {
            this.user = await $http({
                method: 'GET',
                url: `/api/user/${$window.user_id}`
            });
            return this.user;

        }

    }

    async function controllerUser($scope, providerUser) {

        let per_page = 10;

        let data = await providerUser;
        data = data.data.data['projects'].data
        $scope.projects = [];

        for (let i = 0; i < per_page; i++) {
            if (!_.isUndefined(data[i])) {
                $scope.projects.push(data[i]);
            }
        }

        $scope.showMore = async function() {
            per_page += 5;
            for (let i = $scope.projects.length; i < per_page; i++) {
                if (!_.isUndefined(data[i])) {
                    $scope.projects.push(data[i]);
                }
            }
            if ($scope.projects.length === data.length) {
                $scope.styleMore = { display: 'none' };
            }
        }

        $scope.search = async function(event, string) {
            event.preventDefault();
            if (!string) {
                $scope.projects = data;
            } else {
                $scope.projects = [];
                _.forEach(data, (n) => {
                    if (n.name.indexOf(string) != -1) {
                        $scope.projects.push(n);
                    }
                })
            }
        }

        $scope.keydown = async function() {
            if (!$scope.keySearch) {
                $scope.projects = data;
            } else {
                $scope.projects = [];
                _.forEach(data, (n) => {
                    if (n.name.indexOf($scope.keySearch) != -1) {
                        $scope.projects.push(n);
                    }
                })
            }
        }

        if ($scope.projects.length === data.length) {
            $scope.styleMore = { display: 'none' };
        }

        $scope.$apply();
    }
})();