function setup() {
	/* tea plate reusable card components */
	let loadingTemplate = `<div class="poc-loading-block">
            <div class="loading-address"></div>
        </div>`;

	let template = (data) => {
		let ts = `<div class="poc-block">`;
		if (data["notification-count"] != undefined) {
			ts += `<div class="notification">${data["notification-count"]}</div>`;
		}
		ts += `<div class="first-name poc-text" id="${data["jid"]}">
                ${data["first-name"]} ${data["last-name"]}
            </div>
            <div class="address poc-text">${data["address"]}</div>
        </div>`;

		return ts;
	};

	let noData = (() => {
		let ts = `<div class="poc-block">`;
		ts += `<div class="first-name poc-text">
                No Data
            </div>
        </div>`;

		return ts;
	})();

	function onclick(event, data) {
		alert(
			"Woah woah! I've only spend 15 mins making this demo! Feel free to modify this to add more Spongebob Trivia!"
		);
		console.log(data);
	}

	/* template 1 - left most column */
	var newTemplate1 = new TeaPlates(
		"poc-wrapper-1",
		template,
		loadingTemplate,
		noData
	);
	newTemplate1.registerEventListeners("click", onclick);
	newTemplate1.showLoading(3);

	function newDataSet() {
		newTemplate1.setData(jsondata);

		newTemplate1.insertObjects(() => {
			updateNotificationCount();
		});
	}

	// Dynamic update dataset values
	function updateNotificationCount() {
		setTimeout(() => {
			newTemplate1.updateDataForUid(1, (data) => {
				data["notification-count"] = 10;
				data["address"] = "Dynamically updated value!";
				return data;
			});
			newTemplate1.reloadObjectAtUid(1);
		}, 2000);
	}

	setTimeout(() => {
		newDataSet();
		// newTemplate1.removeAllObjects();
	}, 2000);

	/* template 2 */
	var newTemplate2 = new TeaPlates(
		"poc-wrapper-2",
		template,
		loadingTemplate,
		noData
	);
	newTemplate2.showLoading(3);
	setTimeout(() => {
		newTemplate2.hideLoading();
		newTemplate2.showNoDataElement();
	}, 3000);

	var newTemplate3 = new TeaPlates(
		"poc-wrapper-3",
		template,
		loadingTemplate,
		noData
	);
	newTemplate3.showLoading(4);
	setTimeout(() => {
		newTemplate3.hideLoading();
		newTemplate3.showNoDataElement();
	}, 4000);

	var newTemplate4 = new TeaPlates(
		"poc-wrapper-4",
		template,
		loadingTemplate,
		noData
	);
	newTemplate4.showLoading(2);
	setTimeout(() => {
		newTemplate4.hideLoading();
		newTemplate4.showNoDataElement();
	}, 3000);

	var newTemplate5 = new TeaPlates(
		"poc-wrapper-5",
		template,
		loadingTemplate,
		noData
	);
	newTemplate5.showLoading(5);
	setTimeout(() => {
		newTemplate5.hideLoading();
		newTemplate5.showNoDataElement();
	}, 3500);
}

window.onload = setup;
