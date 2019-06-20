function setup() {
    let template = 
    `<div class="poc-block">
        <div class="first-name poc-loader" id="#{jid}">#{first-name} #{last-name}</div>
    </div>`;

    var newTemplate = new DynamicTemplate('poc-wrapper', template);
    newTemplate.setData(jsondata);
    newTemplate.parseTemplate();
}

document.addEventListener('DOMContentLoaded', setTimeout(setup, 500));