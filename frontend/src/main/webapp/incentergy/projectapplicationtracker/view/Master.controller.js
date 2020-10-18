sap.ui.define([
	"incentergy/base/view/AbstractMasterController"
], function (AbstractMasterController) {
	"use strict";

	return AbstractMasterController.extend("incentergy.projectapplicationtracker.view.Master", {
		onListItemPress: function (oEvent) {
			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
				entityPath = oEvent.getSource().getBindingContext().getPath(),
				entity = entityPath.substring(1);

			var oParams = {layout: oNextUIState.layout};
			oParams[this.getEntityName()] = encodeURIComponent(entity);
			this.oRouter.navTo("detail", oParams);
		},
		getEntityName: function() {
			return "projectapplication";
		},
		getSearchField: function() {
			return "name";
		},
		getSortField: function() {
			return "createdTs";
		}
	});
}, true);
