class DynamicTemplate {

    constructor(wrapperId, template, loadingTemplate) {
        this.jsonData = undefined;
        this.wrapperId = wrapperId;
        this.template = template;
        this.loadingTemplate = loadingTemplate;
        this.templateObjects = [];
        this.templateKeys = [];
        this.elements = [];
        this.loadingElements = [];
    }

    setData(jdata) {
        this.jsonData = jdata;
        if (Array.isArray(this.jsonData)) {
            this.templateObjects = this.jsonData.map(
                (data) => this.template(data)
            );
        } else {
            this.templateObjects = this.template(data);
        }
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

    insertObjects(delta=80, completion=()=>{}) {
        let completionPromise = [];
        this.elements = this.templateObjects.map((item, index) => 
                this.createElementFromString(item, index)
            );
        this.elements.forEach((element, index) => {
            let promise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    element.classList.add("animate-in");
                    document.getElementById(this.wrapperId).appendChild(element);
                    setTimeout(() => {
                        resolve()
                    }, 300);
                }, delta * index, element);
            });
            completionPromise.push(promise);
        });

        Promise.all(completionPromise)
            .then(() => completion());
    }

    removeAllObjects(delta=80, animationTime=300, completion=()=>{}) {
        let completionPromise = [];
        this.elements.slice().reverse()
            .forEach((element, index) => {
                let promise = new Promise((resolve, reject) => {
                    setTimeout(() => {
                        element.classList.remove("animate-in");
                        element.classList.add("animate-out");
                        setTimeout(() => {
                            document.getElementById(this.wrapperId).removeChild(element);
                            resolve();
                        }, animationTime, element, this, index);
                    }, delta * index, element, this, index);
                });
                completionPromise.push(promise);
            }
        );
        Promise.all(completionPromise)
            .then(() => {
                console.log('done');
                completion();
            })
            .catch((err) => { console.log(err); });
    }

    removeObject(index, animationTime=300, completion=()=>{}) {
        let element = this.elements[index];
        this.elements.splice(index, 1);
        let elementStyle = window.getComputedStyle(element);
        let height = element.offsetHeight;
        let marginTop = index > 0 ? parseFloat(elementStyle.marginTop) : 0;
        let rmMargin = -(height + marginTop);
        element.style.zIndex = "-1";
        element.classList.remove("animate-in");
        element.classList.add("animate-out");
        element.style.marginTop = rmMargin + 'px';

        setTimeout(() => {
            document.getElementById(this.wrapperId).removeChild(element);
            completion();
        }, animationTime, element, this, index);
    }

    createElementFromString(htmlString, uid=-1) {
        var div = document.createElement('div');
        div.innerHTML = htmlString;
        div.firstChild.setAttribute('uid', `${this.wrapperId}-${uid}`);
        return div.firstChild;
    }

    showLoading(count=1, delta=80, completion=()=>{}) {
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
                        resolve()
                    }, 300);
                }, delta * index, element);
            });
            completionPromise.push(promise);
        });

        Promise.all(completionPromise)
            .then(() => completion());
    }

    hideLoading(delta=80, animationTime=300, completion=()=>{}) {
        let completionPromise = [];
        this.loadingElements.slice().reverse()
            .forEach((element, index) => {
                let promise = new Promise((resolve, _reject) => {
                    setTimeout(() => {
                        element.classList.remove("animate-in");
                        element.classList.add("animate-out");
                        setTimeout(() => {
                            document.getElementById(this.wrapperId).removeChild(element);
                            resolve();
                        }, animationTime, element, this, index);
                    }, delta * index, element, this, index);
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
