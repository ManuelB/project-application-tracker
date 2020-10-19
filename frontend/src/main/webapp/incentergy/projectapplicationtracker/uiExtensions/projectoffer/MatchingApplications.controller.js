sap.ui.define(["sap/ui/core/Component", "sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"
], function (Component, Controller, JSONModel) {
	"use strict";

	return Controller.extend("incentergy.projectapplicationtracker.uiExtensions.projectoffer.MatchingApplications", {
		onInit: function () {
			this.getView().setModel(new JSONModel(), "MatchingApplications");
			this.getView().attachModelContextChange((oEvent) => {
				let oBindingContext = this.getView().getBindingContext();
				let oModel = this.getView().getModel();
				if(oBindingContext) {		
					let sSkillsPath = oBindingContext.getPath()+"/Skills";
					let oListBinding = oModel.bindList(sSkillsPath);
					oListBinding.attachDataReceived((oEvent) => {
						let aSkills = oEvent.getParameter("data");
						if(aSkills) {
							// take the first skill
							let sQuery = aSkills.results.slice(0,1).map(o => o.Name).join(" ");
							this.byId("search").setValue(sQuery);
							this.onSearch();
						}
					});
					oListBinding.initialize();
					oListBinding.getContexts();
				}
			});
		},
		onSearch: function() {
			let sQuery = this.byId("search").getValue();
			Component.load({"name":"incentergy.projectapplicationtracker"}).then((oComponentClass) => {
				new oComponentClass().searchIndex().then((oIndex) => {
					oIndex.search(sQuery, (aResults) => {
						this.getView().getModel("MatchingApplications").setData({"MatchingComments":aResults})
					});
				})
			});
		},
		onExit: function() {
			this.getView().getModel().destroy();
		}
	});
}, true);