# tk-web-component

## Project preparation

using vue cli > 3

initial setup following this post on medium

https://medium.com/@royprins/get-started-with-vue-web-components-593b3d5b3200
```
vue create tk-web-component
npm install @vue/web-component-wrapper --save-dev

```


## Styling
inside the component use css varibales with default values as fallback
```html
<style>
    .tankerkoenig-info {
        font-family: var(--font-family, 'Open Sans,Arial,Helvetica,sans-serif');
        font-size: var(--font-size, 14px);
        color: var(--font-color, black);
        background: var(--bg-color, white);
    }
</style>

```
customers can overwerite these styles on their page i.e with a style tag in head
```html
<style>
    tk-web-component {
        --widget-with: 320px;
        --widget-height: 500px;
        --font-family: "Arial";
        --font-size: 16px;
        --price-fontsize: 32px;
        --price-color: #304156;
        --time-fontsize: 12px;
        --font-color: rgba(0, 0, 0, 0.99);
        --bg-color: #ffc828;
        --tab-color: rgba(183, 142, 17, 0.98);
        --station-padding: 20px;
        --divider: 5px solid #dbdbdb
    }
</style>
```

or something like this 
```html
<style>
    tk-web-component {
        --font-family: "Comic Sans MS";
        --font-size: 24px;
        --font-color: #e9e9eb;
        --brand-color: white;
        --price-color: #08ff06;
        --price-fontsize: 60px;
        --bg-color: #34495D;
        --tab-color: #203444;
        --station-padding: 20px;
        --time-fontsize: 16px;
    }
</style>
```

or this 
```html
<style>
    tk-web-component {
        --widget-with: 320px;
        --widget-height: 500px;
        --font-family: "Helvetica";
        --font-size: 14px;
        --price-fontsize: 24px;
        --price-color: #ffc828;
        --time-fontsize: 8px;
        --font-color: white;
        --brand-color: #2096ff;
        --bg-color: #34495D;
        --tab-color: rgba(48, 65, 86, 0.98);
        --station-padding: 20px;
        --divider: 1px solid #000000
    }
</style>
```
hipster style 
```html
<style>
    tk-web-component {
        --font-family: "Courier";
        --brand-color: #8bafa1;
        --font-size: 14px;
        --font-color: #837970;
        --bg-color: #e8e7d4;
        --divider: 1px solid #cdc9b2;
        --station-padding: 25px;
    }
</style>

```
some mogelesbrown

```html
<style>
    tk-web-component {
        --tab-color: #584848;
        --brand-color: #f4b557;
        --font-size: 18px;
        --font-color: #d8d9de;
        --price-color: #6e7888;
        --price-fontsize: 50px;
        --bg-color: #393b44;
        --divider: 1px solid #584848;
        --station-padding: 25px;
        --time-fontsize: 14px;
    }
</style>
```



## How to use this component

```html
<script src="https://unpkg.com/vue"></script>
<script src="./tk-web-component.min.js"></script>

<style>
    tk-web-component {
      ...
    }
</style>

```

```html
<tk-web-component
    apikey="00000000-0000-0000-0000-000000000002"
    stations="83d5ac80-4f23-4106-b054-7c7704bfcb95,944d2525-4cb4-4a53-9cbe-d80f6a9bbd3a,8eb4ceb1-abbe-4ac1-b23a-77b890fa1d89,508b5f83-1d68-4695-9e4c-5bfeac7e13a9"
    plz="88400"
    lat="48.8"
    lng="9.24"
    rad="2"></tk-web-component>
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
