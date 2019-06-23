function setup() {
    let loadingTemplate = 
    `<div class="poc-loading-block">
        Loading
    </div>`;

    let template = (data) => {
        let ts = `<div class="poc-block">`
        if (data['notification-count'] != undefined) {
            ts += `<div class="notification">${data['notification-count']}</div>`
        }
        ts += `<div class="first-name poc-text" id="$data['jid']">
                ${data['first-name']} ${data['last-name']}
            </div>
            <div class="address poc-text">${data['address']}</div>
        </div>`;
        return ts;
    }

    var newTemplate1 = new DynamicTemplate('poc-wrapper-1', template, loadingTemplate);
    newTemplate1.showLoading(1);

    setTimeout(() => {
        function newDS() {
            newTemplate1.setData(jsondata);
            newTemplate1.insertObjects(delta=80);
        }
        newTemplate1.hideLoading(80, 300, newDS);
        
        // newTemplate1.removeObject(0, 1000);
        // newTemplate1.removeObject(2, 1000);
        // newTemplate1.removeAllObjects();
    }, 10000)

    // var newTemplate2 = new DynamicTemplate('poc-wrapper-2', template);
    // newTemplate2.setLoading(3);
    // setTimeout(() => {
    //     function newDS() {
    //         newTemplate2.setData(jsondata);
    //         newTemplate2.insertObjects(delta=80);
    //     }
    //     newTemplate2.removeAllObjects(80, 300, newDS);
    // }, 9000)

    // var newTemplate3 = new DynamicTemplate('poc-wrapper-3', template);
    // newTemplate3.setLoading(2);
    // setTimeout(() => {
    //     function newDS() {
    //         newTemplate3.setData(jsondata);
    //         newTemplate3.insertObjects(delta=80);
    //     }
    //     newTemplate3.removeAllObjects(80, 300, newDS);
    // }, 11000)

    // var newTemplate4 = new DynamicTemplate('poc-wrapper-4', template);
    // newTemplate4.setLoading(4);
    // setTimeout(() => {
    //     function newDS() {
    //         newTemplate4.setData(jsondata);
    //         newTemplate4.insertObjects(delta=80);
    //     }
    //     newTemplate4.removeAllObjects(80, 300, newDS);
    // }, 5000)

    // var newTemplate5 = new DynamicTemplate('poc-wrapper-5', template);
    // newTemplate5.setLoading(1);
    // setTimeout(() => {
    //     function newDS() {
    //         newTemplate5.setData(jsondata);
    //         newTemplate5.insertObjects(delta=80);
    //     }
    //     newTemplate5.removeAllObjects(80, 300, newDS);
    // }, 8000)
}

window.onload = setup;
