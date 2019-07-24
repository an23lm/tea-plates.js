function setup() {
    let loadingTemplate =
        `<div class="poc-loading-block">
            <div class="loading-address"></div>
        </div>`;

    let template = (data) => {
        let ts = `<div class="poc-block">`
        if (data['notification-count'] != undefined) {
            ts += `<div class="notification">${data['notification-count']}</div>`
        }
        ts += `<div class="first-name poc-text" id="${data['jid']}">
                ${data['first-name']} ${data['last-name']}
            </div>
            <div class="address poc-text">${data['address']}</div>
        </div>`;

        return ts;
    }

    function onclick(event, data) {
        alert('clicked');
        console.log(data);
    }

    let noData = `<div>No Data available</div>`
    var newTemplate1 = new TeaPlates('poc-wrapper-1', template, loadingTemplate, noData);
    newTemplate1.registerEventListeners('click', onclick);
    newTemplate1.showLoading(1);

    function newDS() {
        newTemplate1.setData(jsondata);
        newTemplate1.insertObjects(() => {
            newTemplate1.updateDataForUid(1, (data) => {
                data['notification-count'] = 10;
                return data;
            });
            newTemplate1.reloadObjectAtUid(1);

            newTemplate1.removeAllObjects();
        });
    }

    setTimeout(() => {
        newTemplate1.hideLoading();
        newTemplate1.showNoDataElement();
    }, 1000);

    // var newTemplate2 = new TeaPlates('poc-wrapper-2', template, loadingTemplate);
    // newTemplate2.showLoading(3);
    // setTimeout(() => {
    //     insertData(newTemplate2);
    // }, 9000)

    // setTimeout(() => {
    //     insertData(newTemplate1, () => {
    //         var obj = newTemplate1.removeObjectWithUID(2);
    //         newTemplate2.setData(obj);
    //         newTemplate2.insertObjects();
            
    //     });
    // }, 5000)

    // var newTemplate3 = new TeaPlates('poc-wrapper-3', template, loadingTemplate);
    // newTemplate3.showLoading(4);
    // setTimeout(() => {
    //     insertData(newTemplate3);
    // }, 10000)

    // var newTemplate4 = new TeaPlates('poc-wrapper-4', template, loadingTemplate);
    // newTemplate4.showLoading(2);
    // setTimeout(() => {
    //     insertData(newTemplate4);
    //     setTimeout(() => {
    //         newTemplate4.updateDataForUid(1, (data) => {
    //             data['notification-count'] = 10;
    //             return data;
    //         });
    //         newTemplate4.reloadObjectAtUid(1);
    //     }, 2000);
    // }, 3000)

    // var newTemplate5 = new TeaPlates('poc-wrapper-5', template, loadingTemplate);
    // newTemplate5.showLoading(5);
    // setTimeout(() => {
    //     insertData(newTemplate5);
    // }, 12000)
}

window.onload = setup;