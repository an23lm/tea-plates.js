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

## Usage 
### Step 1 - Initialize
Initalize Tea-Plates on the `<div />` which should contain the dynamically loaded templates.

`new TeaPlates(<ID Attribute>, <data template>, <loading template>, <no data template>)`

#### Init requires four parameters
- **ID Attribute** (*String*) ID of the div on which tea-plates will be initalized on.
- **Data Template** (*Function*) This function is called when new "template strings" need to be generated. 
- **Loading Template** (*String*) Element which will be rendered when data is loading. (Needs to be a HTML String)
- **No Data Template** (*String*) Element which will be rendered when there is no data available. (Needs to be a HTML String)



#### Example
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

