(function() {

    let loadProject = angular
        .module('loadProject', [])
        .controller('loadProjectController', async($scope, $http, $window, $sce) => {
            let user = await $http({
                method: 'GET',
                url: `/api/user/${$window.user_id}`
            });

            $scope.projects = angular.copy(user.data.data['projects']);

            _.forEach($scope.projects.data, (project) => {
                $scope.codeHtml = $sce.trustAsHtml(`
                				<tr>
                                    <td>${project.name}</td>
                                    <td>${project.host.host_name}</td>
                                    <td>${project.git}</td>
                                    <td>${project.status.name}</td>
                                    <td>${project.categories}</td>
                                    <td>${project.updated_at}</td>
                                </tr>`);
            });

            $scope.$apply();
        });

    angular.module('moduleUser', ['loadProject']);
})();