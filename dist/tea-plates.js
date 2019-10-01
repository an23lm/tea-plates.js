class TeaPlates {
    /**
     * @summary class constructor
     * @param {String} wrapperId wrapper ID to insert template objects in
     * @param {Function} template template function which will be called with data and should return template string
     * @param {String} loadingTemplate template function which will be called to get a loading template string
     * @param {String} noDataTemplate template function which will be called to get "no data" template string
     */
    constructor(wrapperId, template, loadingTemplate, noDataTemplate) {
        this.delta = 80;
        this.animationTime = 300;
        this.pTP_uid = 0;

        this.jsonData = {};
        this.wrapperId = wrapperId;
        this.template = template;
        this.loadingTemplate = loadingTemplate;
        this.noDataTemplate = noDataTemplate;
        this.newElements = [];
        this.insertedElements = [];
        this.loadingElements = [];
        this.noDataElement = null;
        this.eventListeners = [];

        this.initQueue();

        this.isLoading = true;
    }

    initQueue() {
        var Queue = (function(){
            function Queue() {};
        
            Queue.prototype.isRunning = false;
            Queue.prototype.queue = [];
        
            Queue.prototype.add_function = function(execFunc, callback) { 
                var _this = this;
                //add callback to the queue
                function cb() {
                    callback();
                    _this.next();
                }

                this.queue.push(function() {
                    execFunc(cb);
                });
        
                if(!this.isRunning) {
                    // if nothing is running, then start the engines!
                    this.next();
                }
        
                return this; // for chaining fun!
            }
        
            Queue.prototype.next = function(){
                this.isRunning = false;
                //get the first element off the queue
                var shift = this.queue.shift(); 
                if (shift) { 
                    this.isRunning = true;
                    shift(); 
                }
            }
        
            return Queue;
        
        })();

        this.queue = new Queue;
    }

    /**
     * @summary jdata is parased and templates objects are created
     * @param {Array or Javascript Object} jdata data used to create template/s
     * @access public
     */ 
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
    
    /**
     * @summary get an object with uid and template string
     * @param {String} templateString 
     * @param {Number} uid 
     * @access private
     */
    pTP_createTemplate(templateString, uid) {
        return {
            'templateString': templateString,
            'uid': uid
        };
    }

    /**
     * remove all stored data
     */
    removeData() {
        this.jsonData = {};
        this.newElements = [];
    }

    /**
     * @summary use function to insert created objects into the wrapper div
     * @param {Function} completion function is called when all objects are inserted and done animating
     */
    insertObjects(completion = () => {}) {
        let method = this.pTP_insertObjects.bind(this);
        this.queue.add_function(method, completion);
    }

    pTP_insertObjects(completion = () => {}) {
        let completionPromise = [];
        this.newElements.forEach((element, index) => {
            let promise = new Promise((resolve) => {
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
                ref = function (e) {
                    handler.call(this, e, self, eventListener.handler)
                },
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

    updateDataForUid(uid, callback) {
        this.jsonData[`uid-${uid}`] = callback(this.jsonData[`uid-${uid}`]);
    }

    reloadObjectAtUid(uid) {
        let data = this.jsonData[`uid-${uid}`];
        let newTpl = this.pTP_createTemplate(this.template(data), uid);
        let newEle = this.pTP_CreateElementFromString(newTpl.templateString, uid);

        let element = undefined;
        let index = undefined;

        this.insertedElements.forEach((ele, i) => {
            if (ele.getAttribute('uid') == uid) {
                element = ele;
                index = i;
            }
        });
        if (element == undefined) return;

        this.insertedElements[index] = newEle;

        element.parentNode.replaceChild(newEle, element);

        this.eventListeners.forEach(
            listener => this.pTP_AddEventListeners([newEle], listener)
        );
    }

    removeObjectAtIndex(index, completion = () => {}) {
        let method = this.pTP_removeObjectAtIndex.bind(this, index);
        this.queue.add_function(method, completion);
    }

    pTP_removeObjectAtIndex(index, completion = () => {}) {
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

    removeObjectWithUID(uid, completion = () => {}) {
        let method = this.pTP_removeObjectWithUID.bind(this, uid);
        this.queue.add_function(method, completion);
    }

    pTP_removeObjectWithUID(uid, completion = () => {}) {
        let element = undefined;
        let index = undefined;
        this.insertedElements.forEach((ele, i) => {
            if (ele.getAttribute('uid') == uid) {
                element = ele;
                index = i;
            }
        });
        if (element == undefined) return;
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

        return this.jsonData[`uid-${uid}`];
    }

    removeAllObjects(completion = () => {}) {
        let method = this.pTP_removeAllObjects.bind(this);
        this.queue.add_function(method, completion);
    }

    pTP_removeAllObjects(completion = () => {}) {
        let completionPromise = [];
        this.insertedElements.slice().reverse()
            .forEach((element, index) => {
                let promise = new Promise((resolve) => {
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

    pTP_CreateElementFromString(htmlString, uid = -1) {
        var div = document.createElement('div');
        div.innerHTML = htmlString;
        div.firstChild.setAttribute('uid', uid);
        return div.firstChild;
    }

    showNoDataElement(completion = () => {}) {
        let method = this.pTP_showNoDataElement.bind(this);
        this.queue.add_function(method, completion);
    }

    pTP_showNoDataElement(completion = () => {}) {
        this.noDataElement = this.pTP_CreateElementFromString(this.noDataTemplate, `no-data`);
        this.noDataElement.classList.add("animate-in");
        document.getElementById(this.wrapperId).appendChild(this.noDataElement);
        setTimeout(() => {
            this.noDataElement.classList.remove("animate-in");
            completion();
        }, this.animationTime, this);
    }

    removeNoDataElement(completion = () => {}) {
        let method = this.pTP_removeNoDataElement.bind(this);
        this.queue.add_function(method, completion);
    }

    pTP_removeNoDataElement(completion = () => {}) {
        if (this.noDataElement == null) return;
        this.noDataElement.classList.add("animate-out");
        setTimeout(() => {
            document.getElementById(this.wrapperId).removeChild(this.noDataElement);
            completion();
        }, this.animationTime, this);
    }

    showLoading(count = 1, completion = () => {}) {
        if (!this.isLoading) return;
        let method = this.pTP_showLoading.bind(this, count);
        this.queue.add_function(method, completion);
    }

    pTP_showLoading(count, completion = () => {}) {
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
                        resolve();
                    }, this.animationTime, element, this);
                }, this.delta * index, element);
            });
            completionPromise.push(promise);
        });

        Promise.all(completionPromise)
            .then(() => completion());
    }

    hideLoading(completion = () => {}) {
        let method = this.pTP_hideLoading.bind(this);
        this.queue.add_function(method, completion);
    }

    pTP_hideLoading(completion = () => {}) {
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