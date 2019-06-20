class DynamicTemplate {

    constructor(wrapperId, template) {
        this.jsonData = undefined;
        this.wrapperId = wrapperId;
        this.template = template;
        this.templateObjects = []
    }

    setData(data) {
        this.jsonData = data;
    }

    parseTemplate() {
        let regex = /#\{[\n ]*?.*?[\n ]*?\}/g;
        let result = [...this.template.match(regex)];
        let nres = result.map( res => res.replace(/[#{ \?)\n}]/g, '') );
        console.log([...result]);
        console.log([...nres]);
        let pts = (data) => {
            let values = nres.map(item => data[item]);
            let templateObject = this.createTemplateObject(values);
            this.templateObjects.push(templateObject);
        }
        if (Array.isArray(this.jsonData)) {
            this.jsonData.forEach(data => {
                pts(data);
            });
        } else {
            pts(this.jsonData);
        }
        this.insertObjects();
    }

    createTemplateObject(values) {
        let templateObject = this.template;
        values.forEach(val => {
            templateObject = templateObject.replace(/#\{[\n ]*?.*?[\n ]*?\}/, val); 
        });

        return templateObject;
    }

    insertObjects() {
        let element = this.templateObjects.join('\n');
        document.getElementById(this.wrapperId).innerHTML = element;
    }

}