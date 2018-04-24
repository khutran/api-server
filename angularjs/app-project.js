(function() {

    // let injector = angular.injector();
    // console.log(injector.get('moduleUser'));
    angular
        .module('moduleProject', [])
        .provider('providerProject', providerProject)
        .controller('controllerProject', controllerProject);

    function providerProject() {
        this.$get = async function($q, $http, $window) {
            [this.user, this.project] = await $q.all([
                $http({
                    method: 'GET',
                    url: `/api/user/${$window.user_id}`
                }),
                $http({
                    method: "GET",
                    url: `/api/project/${$window.project_id}`
                })
            ]);
            return {
                infoUser: this.user,
                infoProject: this.project
            }
        }

    }

    async function controllerProject($scope, $http, providerProject) {
        let page = 1;
        let per_page = 10;

        let result = await providerProject;
        user = result.infoUser.data.data['projects'].data;
        $scope.projects = angular.copy(user);
        $scope.infoProject = angular.copy(result.infoProject.data.data);
        let getProject = await $http({
            method: 'GET',
            url: `http://${$scope.infoProject.host.data.host_name}/get/info?website=${$scope.infoProject.name}`
        });

        console.log(getProject.data.data.stdout);
        $scope.$apply();
    }

})();