### Another JavaScript Templating Engine

# **Tea-Plates.js**

Tea-Plates accepts JSON and a creates a templating string from the provided JSON Object.

## Demo

https://an23lm.github.io/tea-plates.js/

## How to Install

- Download the `tea-plates.js` file from the `dist/` folder and import it to your project.

### OR

- CDN
  - Latest Release
    - `<script src="https://cdn.jsdelivr.net/gh/an23lm/tea-plates.js/dist/tea-plates.js"></script>`
  - Latest from a major version
    - `https://cdn.jsdelivr.net/gh/an23lm/tea-plates.js@{major-version-number}/dist/tea-plates.js`
  - Latest from a minor version
    - `https://cdn.jsdelivr.net/gh/an23lm/tea-plates.js@{major-version-number}.{minor-version-number}/dist/tea-plates.js`
  - Specific release
    - `https://cdn.jsdelivr.net/gh/an23lm/tea-plates.js@{major-version-number}.{minor-version-number}.{patch-number}/dist/tea-plates.js`

## Example

```
<div id='cars-list-wrapper'>
	<!-- Tea Plates will insert generated elements here -->
</div>
```

```
let carTemplate = data => {
	return `<div class="car">${data.name}</div>`
}

let carsLoadingTemplate = `<div class="cars-loading">Loading</div>`

let noCarsAvailableTemplate = `<div class="no-cars-available">No cars to see here</div>`

let carTemplateEngine = new TeaPlates('cars-list-wrapper', carTemplate, carsLoadingTemplate, noCarsAvailableTemplate)
```

<a name="TeaPlates"></a>

## TeaPlates Documentation

**Kind**: global class  
**Summary**: class constructor.  
**Access**: public

- [TeaPlates](#TeaPlates)
  - [new TeaPlates(wrapperId, template, loadingTemplate, noDataTemplate)](#new_TeaPlates_new)
  - [.setData(jdata)](#TeaPlates+setData)
  - [.removeData()](#TeaPlates+removeData)
  - [.insertObjects(completion)](#TeaPlates+insertObjects)
  - [.registerEventListeners(eventType, eventHandler, options)](#TeaPlates+registerEventListeners) ⇒
  - [.unregisterEventListeners(eventListenerId)](#TeaPlates+unregisterEventListeners) ⇒
  - [.updateDataForUid(uid, callback)](#TeaPlates+updateDataForUid)
  - [.reloadObjectAtUid(uid)](#TeaPlates+reloadObjectAtUid)
  - [.removeObjectAtIndex(index, completion)](#TeaPlates+removeObjectAtIndex)
  - [.removeObjectWithUID(uid, completion)](#TeaPlates+removeObjectWithUID)
  - [.removeAllObjects(completion)](#TeaPlates+removeAllObjects)
  - [.showNoDataElement(completion)](#TeaPlates+showNoDataElement)
  - [.removeNoDataElement(completion)](#TeaPlates+removeNoDataElement)
  - [.showLoading(count, completion)](#TeaPlates+showLoading)
  - [.hideLoading(completion)](#TeaPlates+hideLoading)

<a name="new_TeaPlates_new"></a>

### new TeaPlates(wrapperId, template, loadingTemplate, noDataTemplate)

| Param           | Type                  | Description                                                                         |
| --------------- | --------------------- | ----------------------------------------------------------------------------------- |
| wrapperId       | <code>String</code>   | wrapper ID to insert template objects in.                                           |
| template        | <code>function</code> | template function which will be called with data and should return template string. |
| loadingTemplate | <code>String</code>   | template function which will be called to get a loading template string.            |
| noDataTemplate  | <code>String</code>   | template function which will be called to get "no data" template string.            |

<a name="TeaPlates+setData"></a>

### teaPlates.setData(jdata)

**Kind**: instance method of [<code>TeaPlates</code>](#TeaPlates)  
**Summary**: jdata is parased and templates objects are created.  
**Access**: public

| Param | Type               | Description                    |
| ----- | ------------------ | ------------------------------ |
| jdata | <code>Array</code> | data used to create template/s |

<a name="TeaPlates+removeData"></a>

### teaPlates.removeData()

**Kind**: instance method of [<code>TeaPlates</code>](#TeaPlates)  
**Summary**: remove all the data.  
**Access**: public  
<a name="TeaPlates+insertObjects"></a>

### teaPlates.insertObjects(completion)

**Kind**: instance method of [<code>TeaPlates</code>](#TeaPlates)  
**Summary**: hide loading elements and queue insert objects into the wrapper div.  
**Access**: public

| Param      | Type                  | Description                                                          |
| ---------- | --------------------- | -------------------------------------------------------------------- |
| completion | <code>function</code> | function is called when all objects are inserted and done animating. |

<a name="TeaPlates+registerEventListeners"></a>

### teaPlates.registerEventListeners(eventType, eventHandler, options) ⇒

**Kind**: instance method of [<code>TeaPlates</code>](#TeaPlates)  
**Summary**: register an event listner on the top level div on the template.  
**Returns**: ID for of the registered event listener, use this to unregister the listener.  
**Access**: public  
**Link**: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener

| Param        | Type                  | Default            | Description                                         |
| ------------ | --------------------- | ------------------ | --------------------------------------------------- |
| eventType    | <code>String</code>   |                    | type of event listener.                             |
| eventHandler | <code>function</code> |                    | event handler function.                             |
| options      | <code>Object</code>   | <code>false</code> | specifies characteristics about the event listener. |

<a name="TeaPlates+unregisterEventListeners"></a>

### teaPlates.unregisterEventListeners(eventListenerId) ⇒

**Kind**: instance method of [<code>TeaPlates</code>](#TeaPlates)  
**Summary**: unregister an event listener  
**Returns**: the removed event listener object  
**Access**: public

| Param           | Type            | Description                                                         |
| --------------- | --------------- | ------------------------------------------------------------------- |
| eventListenerId | <code>\*</code> | the event listener ID received while registering the event listener |

<a name="TeaPlates+updateDataForUid"></a>

### teaPlates.updateDataForUid(uid, callback)

**Kind**: instance method of [<code>TeaPlates</code>](#TeaPlates)  
**Summary**: update the data for template object with UID  
**Access**: public

| Param    | Type                  | Description                                                                                                |
| -------- | --------------------- | ---------------------------------------------------------------------------------------------------------- |
| uid      | <code>Number</code>   | Unique ID of the template object                                                                           |
| callback | <code>function</code> | calls callback function with json data at the UID. Callback function should return the modified json data. |

<a name="TeaPlates+reloadObjectAtUid"></a>

### teaPlates.reloadObjectAtUid(uid)

**Kind**: instance method of [<code>TeaPlates</code>](#TeaPlates)  
**Summary**: after updateDataForUid use this function to reload the dom object  
**Access**: public

| Param | Type                | Description                      |
| ----- | ------------------- | -------------------------------- |
| uid   | <code>Number</code> | Unique ID of the template object |

<a name="TeaPlates+removeObjectAtIndex"></a>

### teaPlates.removeObjectAtIndex(index, completion)

**Kind**: instance method of [<code>TeaPlates</code>](#TeaPlates)  
**Summary**: queues remove a template object from DOM at index  
**Access**: public

| Param      | Type                  | Description      |
| ---------- | --------------------- | ---------------- |
| index      | <code>Number</code>   | of object in DOM |
| completion | <code>function</code> |                  |

<a name="TeaPlates+removeObjectWithUID"></a>

### teaPlates.removeObjectWithUID(uid, completion)

**Kind**: instance method of [<code>TeaPlates</code>](#TeaPlates)  
**Summary**: queues remove a template object from DOM with UID  
**Access**: public

| Param      | Type                  | Description         |
| ---------- | --------------------- | ------------------- |
| uid        | <code>Number</code>   | of the DOM elements |
| completion | <code>function</code> |                     |

<a name="TeaPlates+removeAllObjects"></a>

### teaPlates.removeAllObjects(completion)

**Kind**: instance method of [<code>TeaPlates</code>](#TeaPlates)  
**Summary**: remove all template objects.  
**Access**: public

| Param      | Type                  | Description |
| ---------- | --------------------- | ----------- |
| completion | <code>function</code> | callback    |

<a name="TeaPlates+showNoDataElement"></a>

### teaPlates.showNoDataElement(completion)

**Kind**: instance method of [<code>TeaPlates</code>](#TeaPlates)  
**Summary**: show no data element.  
**Access**: public

| Param      | Type                  | Description |
| ---------- | --------------------- | ----------- |
| completion | <code>function</code> | callback.   |

<a name="TeaPlates+removeNoDataElement"></a>

### teaPlates.removeNoDataElement(completion)

**Kind**: instance method of [<code>TeaPlates</code>](#TeaPlates)  
**Summary**: remove no data element.  
**Access**: public

| Param      | Type                  | Description |
| ---------- | --------------------- | ----------- |
| completion | <code>function</code> | callback.   |

<a name="TeaPlates+showLoading"></a>

### teaPlates.showLoading(count, completion)

**Kind**: instance method of [<code>TeaPlates</code>](#TeaPlates)  
**Summary**: show loading elements.  
**Access**: public

| Param      | Type                  | Default        | Description                 |
| ---------- | --------------------- | -------------- | --------------------------- |
| count      | <code>Number</code>   | <code>1</code> | number of loading elements. |
| completion | <code>function</code> |                | callback.                   |

<a name="TeaPlates+hideLoading"></a>

### teaPlates.hideLoading(completion)

**Kind**: instance method of [<code>TeaPlates</code>](#TeaPlates)  
**Summary**: hide loading elements.  
**Access**: public

| Param      | Type                  | Description |
| ---------- | --------------------- | ----------- |
| completion | <code>function</code> | callback.   |
