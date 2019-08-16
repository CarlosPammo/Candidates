angular.module("exception-handler", [])
.service("Exception", ["$injector",
	function ($injector) {
		this.exception = {};

		this.get = function () {
			return this.exception;
		}

		this.throw = function (response) {
			this.exception = response;

			if (!response.header) {
				this.exception.header = "A problem occured...";
			}

			var modal = $injector.get("$uibModal");
			modal.open({
				backdrop: "static",
				controller: "ExceptionCtrl",
				templateUrl: "/Scripts/exception/exception.html"
			});
		}
	}
])
.controller("ExceptionCtrl", ["$scope", "$location", "$uibModalInstance", "Exception",
	function ($scope, $location, instance, exception) {
		$scope.exception = exception.get();
		$scope.close = function () {
			instance.close(false);
		};
	}
]);