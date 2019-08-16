angular.module("home", [])
	.directive("advancedSearch", ["Api",
			function(api) {
				return {
					restrict: "E",
					replace: true,
					scope: {
						handler: "=",
						criteria: "="
					},
					link: function (scope) {
						scope.criteria = scope.criteria || { qualification : null }

						scope.pick = function(item) {
							scope.criteria.qualification = item;
						};

						scope.clear = function() {
							scope.criteria = { qualification: null };
							if (scope.qualifications.length > 0) {
								scope.criteria.qualification = scope.qualifications[0];
							}
						};

						api.qualification.get(
							function (response) {
								scope.qualifications = response.qualifications;
								scope.qualifications.unshift({
									name: "== NONE ==",
									type: 0
								});
								if (scope.qualifications.length > 0) {
									scope.criteria.qualification = scope.criteria.qualification == null
									? scope.qualifications[0]
									: scope.criteria.qualification;
								}
							}, function () {
								scope.qualifications = [];
							}
						);
					},
					templateUrl: "Scripts/home/advanced-search.html"
				};
			}
		]
	)
	.directive("qualificationsEditor", ["Api",
			function(api) {
				return {
					restrict: "E",
					replace: true,
					scope: {
						handler: "="
					},
					link: function (scope) {
						function load() {
							api.qualification.get(
								function (response) {
									scope.rows = response.qualifications;
								}, function() {
									scope.rows = [];
								}
							);
						}

						load();
						scope.save = function () {
							api.qualification.post(scope.row, function() {
								load();
							});
						};

						scope.delete= function(row) {
							api.qualification.delete({
								id: row.id
							}, function () {
								load();
							});
						}
					},
					templateUrl: "Scripts/home/qualifications-editor.html"
				};
			}
		]
	)
	.directive("candidateQualifications", ["Api", 
			function(api) {
				return {
					restrict: "E",
					replace: true,
					scope: {
						row: "=",
						handler: "="
					},
					link: function (scope) {
						function load() {
							api.candidatequalification.get({
								idCandidate: scope.row.id
							}, function (response) {
								scope.candidateQualifications = response.results;
							}, function () {
								scope.candidateQualifications = [];
							});
						}

						scope.pick = function (qualification) {
							scope.selected = qualification;
						};

						scope.add = function() {
							api.candidatequalification.post({
								candidateId: scope.row.id,
								qualificationId: scope.selected.id,
								started: scope.model.started,
								completed: scope.model.completed
							}, function() {
								scope.model = {}
								load();
							});
						}

						scope.remove = function (item) {
							api.candidatequalification.delete({
								id: item.id
							}, function () {
								load();
							});
						}

						api.qualification.get(
							function(response) {
								scope.qualifications = response.qualifications;
								if (scope.qualifications.length > 0) {
									scope.selected = scope.qualifications[0];
								}
							}, function() {
								scope.qualifications = [];
							}
						);

						load();
					},
					templateUrl: "Scripts/home/candidate-qualifications.html"
				}
			}
		]
	)
	.directive("editor", [
			function() {
				return {
					restrict: "E",
					replace: true,
					scope: {
						row: "=",
						handler: "="
					},
					templateUrl: "Scripts/home/editor.html"
				};
			}
		]
	)
	.directive("home", ["Api", "$uibModal",
			function(api, $modal) {
				return {
					restrict: "E",
					replace: true,
					scope: {},
					link: function (scope) {
						scope.criteria = { qualification: null };
						var modal, config = {
							scope: scope,
							size: "lg",
							backdrop: "static",
							template: "<editor row='selected' handler='handler'></editor>"
						};

						var qualifications = {
							scope: scope,
							size: "lg",
							backdrop: "static",
							template: "<qualifications-editor handler='handler'></qualifications-editor>"
						};

						var candidateQualifications = {
							scope: scope,
							size: "lg",
							backdrop: "static",
							template: "<candidate-qualifications row='selected' handler='handler'></candidate-qualifications>"
						};

						var advancedSearch = {
							scope: scope,
							size: "lg",
							backdrop: "static",
							template: "<advanced-search criteria='criteria' handler='handler'></advanced-search>"
						};

						function load() {
							api.search.post(
									scope.criteria,
								function (response) {
									scope.rows = response.candidates;
								}, function () {
									scope.rows = [];
								}
							);
						}

						load();
						scope.handler = {
							save: function(row) {
								if (row.id === 0) {
									api.candidate.post(row,
										function() {
											load();
										}
									);
								} else {
									api.candidate.put(row,
										function() {
											load();
										}
									);
								}
								modal.close();
							},
							search: function (criteria) {
								scope.criteria = criteria;
								load();
								modal.close();
							},
							close: function () {
								modal.close();
							}
						}

						scope.add = function () {
							scope.selected = { id: 0 };
							modal = $modal.open(config);
						};

						scope.update = function (row) {
							scope.selected = row;
							modal = $modal.open(config);
						}

						scope.delete = function(row) {
							api.candidate.delete({
									id: row.id
								}, function () {
									load();
								}
							);
						}

						scope.addQualification = function() {
							modal = $modal.open(qualifications);
						}

						scope.qualifications = function (row) {
							scope.selected = row;
							modal = $modal.open(candidateQualifications);
						}

						scope.search = function() {
							modal = $modal.open(advancedSearch);
						}
					},
					templateUrl: "Scripts/home/home.html"
				};
			}
		]
	);