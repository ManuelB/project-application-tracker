sap.ui.define([
	"incentergy/base/view/AbstractDetailController",
], function (AbstractDetailController) {
	"use strict";

	return AbstractDetailController.extend("incentergy.projectapplicationtracker.view.Detail", {
		_onMatched: function (oEvent) {
			this._entity = decodeURIComponent(oEvent.getParameter("arguments")[this.getEntityName()]);
			this.getView().bindElement({
				path: "/" + this._entity,
				parameters: this.getBindElementParams()
			});
		},
		getEntityName : function () {
			return "projectapplication";
		}
	});
}, true);
