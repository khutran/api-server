(function() {
    let listProject = angular
        .module('listProject', [])
        .controller('listProjectController', async($scope, $http) => {
            try {
                let projects = await $http({
                    method: 'GET',
                    url: "/api/project",
                })

                $scope.list_projects = angular.copy(projects.data);
                $scope.$apply();
            } catch (e) {
                console.log(e);
            }
        });

    let addProject = angular
        .module('addProject', [])
        .controller('addProjectController', ($scope, $http) => {
            $scope.add = async function(project) {
                try {
                    let project = await $http({
                        method: "POST",
                        url: "/api/project",
                        data: {
                            "name": project.name,
                            "host_id": project.host,
                            "categories": project.categories,
                            "git": project.git,
                            "framework": project.framework,
                            "status_id": 1
                        }
                    })
                } catch (e) {
                    console.log(e);
                }
            }
        });

    angular.module("moduleProject", ["listProject", "addProject"]);
})();