"use-strict"
angular.module("App", [
	// bower modules
	"angular-confirm",
	"ngAnimate",
	"ngCookies",
	"ngIdle",
	"ngMaterial",
	"ngResource",
	"ngRoute",
	"ngSanitize",
	"ui.bootstrap",
	"ui.router",
	// app modules
	"exception-handler",
	"home"
])
.controller("AppCtrl", ["$scope", "$http", "$window", "$location", "Exception",
	function ($scope, $http, $window, $location, exception) {
		$scope.current = null;
		$scope.hide = true;
	}
])
.config(["$routeProvider", "$httpProvider", "$stateProvider", "$urlRouterProvider",
	function ($routeProvider, $httpProvider, $stateProvider, $urlRouterProvider) {
		$httpProvider.interceptors.push("responseInterceptor");

		$stateProvider
			.state("home", {
				url: "/home",
				template: "<home></home>"
			});

		$urlRouterProvider.otherwise("/home");
	}
])
.factory("responseInterceptor", ["$q", "Exception", function ($q, exception) {
	return {
		"responseError": function (response) {
			if (response.status === 401) {
				// non valid user trying to get access to the application
				exception.unanthorizedUser();
			} else if ((response.status === 500) && (_.isObject(response.data))) {
				// exception occurred on the server
				exception.throw(response.data);
			}
			return $q.reject(response);
		}
	}
}])
.service("Api", ["$resource", "$http", function ($resource, $http) {

	this.candidate = $resource("../api/candidate/", null, {
		'get': { method: "GET" },
		'post': { method: "POST" },
		'put': { method: "PUT" },
		'delete': { method: "DELETE" }
	});

	this.candidatequalification = $resource("../api/candidatequalification/", null, {
		'post': { method: "POST" },
		'delete': { method: "DELETE" }
	});

	this.qualification = $resource("../api/qualification/", null, {
		'post': { method: "POST" },
		'delete': { method: "DELETE" }
	});

	this.search = $resource("../api/search/", null, {
		'post': { method: "POST" }
	});

	this.token = function (data) {
		return $http({
			method: "POST",
			url: "/Token",
			data: data,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			}
		});
	}
}]);