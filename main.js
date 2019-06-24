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
        ts += `<div class="first-name poc-text" id="${data['jid']}">
                ${data['first-name']} ${data['last-name']}
            </div>
            <div class="address poc-text">${data['address']}</div>
        </div>`;
        return ts;
    }

    var newTemplate1 = new DynamicTemplate('poc-wrapper-1', template, loadingTemplate);
    newTemplate1.showLoading(1);

    setTimeout(() => {
        insertData(() => {
            newTemplate1.showLoading(2);
            setTimeout(() => {
                insertData();
            }, 5000)
        });
    }, 5000)

    function insertData(completion) {
        function newDS() {
            newTemplate1.setData(jsondata);
            newTemplate1.insertObjects(completion);
        }
        newTemplate1.hideLoading(newDS);
    }
}

window.onload = setup;
