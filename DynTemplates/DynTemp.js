class DynamicTemplate {

    delta=80;
    animationTime=300;

    constructor(wrapperId, template, loadingTemplate) {
        this.jsonData = [];
        this.wrapperId = wrapperId;
        this.template = template;
        this.loadingTemplate = loadingTemplate;
        this.newElements = [];
        this.insertedElements = [];
        this.loadingElements = [];
    }

    setData(jdata) {
        let templateObjects = [];
        if (Array.isArray(jdata)) {
            templateObjects = jdata.map(
                (data) => this.template(data)
            );
            this.jsonData.push(...jdata);
        } else {
            templateObjects.push(this.template(data));
            this.jsonData.push(jdata);
        }

        let tempNE = templateObjects
            .map((item, index) => 
                this.createElementFromString(item, index)
            );        
        this.newElements.push(...tempNE);
    }

    removeData() {
        this.jsonData = [];
        this.newElements = [];
    }

    // parseTemplate() {
    //     let regex = /#\{[\n ]*?.*?[\n ]*?\}/g;
    //     let result = [...this.template.match(regex)];
    //     this.templateKeys = result.map(res => res.replace(/[#{ \?)\n}]/g, ''));
    // }

    // createTemplateObject(values) {
    //     let templateObject = this.template;
    //     values.forEach(val => {
    //         templateObject = templateObject.replace(/#\{[\n ]*?.*?[\n ]*?\}/, val); 
    //     });

    //     return templateObject;
    // }

    insertObjects(completion=()=>{}) {
        let completionPromise = [];
        this.newElements.forEach((element, index) => {
            let promise = new Promise((resolve, _reject) => {
                setTimeout(() => {
                    element.classList.add("animate-in");
                    document.getElementById(this.wrapperId).appendChild(element);
                    setTimeout(() => {
                        element.classList.remove("animate-in");
                        resolve()
                    }, this.animationTime, element, this);
                }, (this.delta * index), element);
            });
            completionPromise.push(promise);
        });

        Promise.all(completionPromise)
            .then(() => {
                this.insertedElements.push(...this.newElements);
                this.newElements = [];
                completion();
            });
    }

    removeAllObjects(completion=()=>{}) {
        let completionPromise = [];
        this.insertedElements.slice().reverse()
            .forEach((element, index) => {
                let promise = new Promise((resolve, _reject) => {
                    setTimeout(() => {
                        element.classList.add("animate-out");
                        setTimeout(() => {
                            document.getElementById(this.wrapperId).removeChild(element);
                            resolve();
                        }, this.animationTime, element, this, index);
                    }, this.delta * index, element, this, index);
                });
                completionPromise.push(promise);
            }
        );
        Promise.all(completionPromise)
            .then(() => {
                this.insertedElements = [];
                completion();
            });
    }

    removeObject(index, completion=()=>{}) {
        let element = this.insertedElements[index];
        let elementStyle = window.getComputedStyle(element);
        let height = element.offsetHeight;
        let marginTop = index > 0 ? parseFloat(elementStyle.marginTop) : 0;
        let rmMargin = -(height + marginTop);
        element.classList.add("animate-out");
        element.style.marginTop = rmMargin + 'px';

        setTimeout(() => {
            this.insertedElements.splice(index, 1);
            document.getElementById(this.wrapperId).removeChild(element);
            completion();
        }, this.animationTime, element, this, index);
    }

    createElementFromString(htmlString, uid=-1) {
        var div = document.createElement('div');
        div.innerHTML = htmlString;
        div.firstChild.setAttribute('uid', `${this.wrapperId}-${uid}`);
        return div.firstChild;
    }

    showLoading(count=1, completion=()=>{}) {
        for(let i = 0; i < count; i++) {
            this.loadingElements.push(this.createElementFromString(this.loadingTemplate, `load-${i}`));
        }
        let completionPromise = [];
        this.loadingElements.forEach((element, index) => {
            let promise = new Promise((resolve, _reject) => {
                setTimeout(() => {
                    element.classList.add("animate-in");
                    document.getElementById(this.wrapperId).appendChild(element);
                    setTimeout(() => {
                        element.classList.remove("animate-in");
                        resolve()
                    }, this.animationTime, element, this);
                }, this.delta * index, element);
            });
            completionPromise.push(promise);
        });

        Promise.all(completionPromise)
            .then(() => completion());
    }

    hideLoading(completion=()=>{}) {
        let completionPromise = [];
        this.loadingElements.slice().reverse()
            .forEach((element, index) => {
                let promise = new Promise((resolve, _reject) => {
                    setTimeout(() => {
                        element.classList.add("animate-out");
                        setTimeout(() => {
                            document.getElementById(this.wrapperId).removeChild(element);
                            resolve();
                        }, this.animationTime, element, this, index);
                    }, this.delta * index, element, this, index);
                });
                completionPromise.push(promise);
            }
        );
        Promise.all(completionPromise)
            .then(() => {
                this.loadingElements = [];
                completion();
            });
    }
}
