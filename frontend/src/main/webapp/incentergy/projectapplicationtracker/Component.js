sap.ui.define(["incentergy/base/AbstractUIComponent", "sap/ui/dom/includeScript", "sap/base/Log"],
function(AbstractUIComponent, includeScript, Log) {
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
	
	var pSearchIndex = includeScript({"url": "https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.6.22/dist/flexsearch.min.js"}).then(function () {		
		return includeScript({"url": "https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.6.22/lang/de.js"});
	}).then(() => {
		return new FlexSearch("score", {
		    stemmer: "de",
			filter: "de",
			doc: {
				id: "id",
				field: ["body"],
				store: ["body", "projectId"]
			}
		});
	});
	
	return AbstractUIComponent.extend("incentergy.projectapplicationtracker.Component", {
		"db": function() {
			return dbPromise;
		},
		"searchIndex": function() {
			return pSearchIndex;
		},
		"onImportSalesProjects": function(sChannel, sEventId, oEvent) {
			this.db().then((db) => {
			  var tx = db.transaction(['projects'], 'readwrite');
			  var projects = tx.objectStore('projects');
			  for(let oProject of oEvent.records) {
			    projects.put(oProject);
				try {
					if("comments" in oProject && typeof oProject.comments[Symbol.iterator] === "function")
					for(let oComment of oProject.comments) {					
						this.searchIndex().then(oIndex => oIndex.add(oComment));
					}
				} catch(e) {
					Log.warning("Could not index comments for project: "+oProject.id+" "+e.msg)
				}
			  }
			  return tx.complete;
			});
		}
	});
});
