sap.ui.define(["incentergy/base/AbstractUIComponent"],
function(AbstractUIComponent) {
	"use strict";
	
	
	var dbPromise = new Promise(function (fnResolve) {
		let db = window.indexedDB.open('incentergy.projectapplicationtracker', 1);
		db.onsuccess = function (event) {
			fnResolve(event.target.result);
		}
		db.onupgradeneeded = function(upgradeDb) {
			if (!upgradeDb.target.result.objectStoreNames.contains('projects')) {
		      upgradeDb.target.result.createObjectStore('projects', {keyPath: 'id'});
		    }
		}
	});
	
	
	return AbstractUIComponent.extend("incentergy.projectapplicationtracker.Component", {
		"db": function() {
			return dbPromise;
		},
		"onImportSalesProjects": function(sChannel, sEventId, oEvent) {
			this.db().then(function(db) {
			  var tx = db.transaction(['projects'], 'readwrite');
			  var projects = tx.objectStore('projects');
			  for(let oProject of oEvent.records) {
			    projects.add(oProject);
			  }
			  return tx.complete;
			});
		}
	});
});
