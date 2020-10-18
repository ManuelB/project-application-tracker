sap.ui.define([
	"incentergy/base/view/AbstractAppController"
], function (AbstractAppController) {
	"use strict";

	return AbstractAppController.extend("incentergy.projectapplicationtracker.view.App", {
		getEntityName : function() {
			return "projectapplication";
		}
	});
}, true);
