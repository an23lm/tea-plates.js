class TeaPlates {

    delta = 80;
    animationTime = 300;

    pTP_uid = 0;

    constructor(wrapperId, template, loadingTemplate) {
        this.jsonData = {};
        this.wrapperId = wrapperId;
        this.template = template;
        this.loadingTemplate = loadingTemplate;
        this.newElements = [];
        this.insertedElements = [];
        this.loadingElements = [];
        this.eventListeners = [];
    }

    setData(jdata) {
        let templateObjects = [];
        if (Array.isArray(jdata)) {
            templateObjects = jdata.map(
                (data) => {
                    this.jsonData[`uid-${++this.pTP_uid}`] = data;
                    return this.pTP_createTemplate(this.template(data), this.pTP_uid);
                }
            );
        } else {
            this.jsonData[`uid-${++this.pTP_uid}`] = jdata;
            let tmp = this.pTP_createTemplate(this.template(jdata), this.pTP_uid);
            templateObjects.push(tmp);
        }

        let tempNE = templateObjects.map(
            item => this.pTP_CreateElementFromString(item.templateString, item.uid)
        );
        this.newElements.push(...tempNE);
        this.eventListeners.forEach(
            listener => this.pTP_AddEventListeners(this.newElements, listener)
        );
    }

    pTP_createTemplate(templateString, uid) {
        return {'templateString': templateString, 'uid': uid};
    }

    removeData() {
        this.jsonData = {};
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

    insertObjects(completion = () => {}) {
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

    removeAllObjects(completion = () => {}) {
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
            });
        Promise.all(completionPromise)
            .then(() => {
                this.insertedElements = [];
                completion();
            });
    }

    registerEventListeners(eventType, eventHandler, options = false) {
        let listener = {
            'type': eventType,
            'handler': eventHandler,
            'options': options
        };
        let index = this.eventListeners.push(listener) - 1;
        this.pTP_AddEventListeners(this.insertedElements, listener);
        this.pTP_AddEventListeners(this.newElements, listener);
        return index
    }

    unregisterEventListeners(index) {
        let removedEL = this.eventListeners.splice(index, 1);
        this.pTP_RemoveEventListeners(this.insertedElements, removedEL);
        this.pTP_RemoveEventListeners(this.newElements, removedEL);
        return removedEL;
    }

    pTP_AddEventListeners(elements, eventListener) {
        let self = this;
        elements.forEach(element => {
            let ref;
            element.addEventListener(
                eventListener.type,
                ref = function(e) { handler.call(this, e, self, eventListener.handler) },
                eventListener.options)
            eventListener['handerRef'] = ref;
        });

        function handler(event, self, eventHandler) {
            let uid = this.getAttribute('uid');
            let data = self.jsonData[`uid-${uid}`];
            eventHandler.call(this, event, data);
        }
    }

    pTP_RemoveEventListeners(elements, eventListener) {
        elements.forEach(element =>
            element.removeEventListener(eventListener.type, eventListener.handerRef, eventListener.options)
        );
    }

    removeObject(index, completion = () => {}) {
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

    pTP_CreateElementFromString(htmlString, uid = -1) {
        var div = document.createElement('div');
        div.innerHTML = htmlString;
        div.firstChild.setAttribute('uid', uid);
        return div.firstChild;
    }

    showLoading(count = 1, completion = () => {}) {
        for (let i = 0; i < count; i++) {
            this.loadingElements.push(this.pTP_CreateElementFromString(this.loadingTemplate, `load-${i}`));
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

    hideLoading(completion = () => {}) {
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
            });
        Promise.all(completionPromise)
            .then(() => {
                this.loadingElements = [];
                completion();
            });
    }
}
