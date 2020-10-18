sap.ui.define([
	"sap/ui/model/json/JSONModel"
], function(JSONModel) {
	"use strict";

	return JSONModel.extend("incentergy.projectapplicationtracker.model.ProjectApplicationModel", {


		/**
		 * Fetches the data from indexeddb and sets up the JSON model.

		 * @return {incentergy.projectapplicationtracker.model.ProjectApplicationModel} the indexeddb model instance
		 */
		constructor : function() {
			// call super constructor with not arguments
			JSONModel.apply(this, []);
			this.setSizeLimit(1000000);

			// load data from local storage
			this._loadData();

			return this;
		},

		/**
		 * Loads the current state of the model from local storage
		 */
		_loadData : function() {
			let sDb = "incentergy.projectapplicationtracker";
			let sObjectStore = "projects";
			new Promise(function (fnResolve) {
				let request = indexedDB.open(sDb);
				request.onsuccess = function (event) {
					let db = event.target.result;
					db.transaction(sObjectStore, "readonly").objectStore(sObjectStore).getAll().onsuccess = function(event) {											
						fnResolve(event.target.result);
					};
				}
			}).then(aProjects => this.setData({"ProjectApplications": aProjects}));
			this._bDataLoaded = true;
		}
	});
});