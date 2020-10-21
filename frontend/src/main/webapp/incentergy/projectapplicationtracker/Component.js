sap.ui.define(["incentergy/base/AbstractUIComponent", "sap/ui/dom/includeScript", "sap/base/Log"],
function(AbstractUIComponent, includeScript, Log) {
	"use strict";
	
	
	var dbPromise = new Promise(function (fnResolve) {
		let db = window.indexedDB.open('incentergy.projectapplicationtracker', 2);
		db.onsuccess = function (event) {
			fnResolve(event.target.result);
		}
		db.onupgradeneeded = function(upgradeDb) {
			if (!upgradeDb.target.result.objectStoreNames.contains('projects')) {
		      upgradeDb.target.result.createObjectStore('projects', {keyPath: 'id'});
		    }
			if (!upgradeDb.target.result.objectStoreNames.contains('search')) {
		      upgradeDb.target.result.createObjectStore('search', {keyPath: 'id'});
		    }
		}
	});
	
	var pSearchIndex = includeScript({"url": "https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.6.22/dist/flexsearch.min.js"}).then(function () {		
		return includeScript({"url": "https://cdn.jsdelivr.net/gh/nextapps-de/flexsearch@0.6.22/lang/de.js"});
	}).then(() => {
		return dbPromise.then((db) => {
			return new Promise(function (fnResolve) {
			 	let tx = db.transaction(['search'], 'readonly');
				let oSearchIndexRequest = tx.objectStore('search').get("index");
				oSearchIndexRequest.onsuccess = function (oResult) {
					
					let index = new FlexSearch("score", {
					    stemmer: "de",
						filter: "de",
						doc: {
							id: "id",
							field: ["body"],
							store: ["body", "projectId"]
						}
					});
					if(oResult.target.result) {
						index.import(oResult.target.result.data);
					}
					fnResolve(index);
				}
			});
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
			  let tx = db.transaction(['projects'], 'readwrite');
			  let projects = tx.objectStore('projects');
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
			  this.searchIndex().then(oIndex => {
				 let tx2 = db.transaction(['search'], 'readwrite');
			  	 let objectStoreSearch = tx2.objectStore('search');
				 objectStoreSearch.put({'id': 'index', 'data': oIndex.export()});
			  });
			  return tx.complete;
			});
			
		}
	});
});
