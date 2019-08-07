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

<style>

    tk-web-component {
        --font-family: "Comic Sans MS";
        --font-size: 30px;
        --font-color: #e9e9eb;
        --bg-color: #3232cc;
        --tab-color: #222272;
        --station-padding: 20px;
        --divider-color: 1px solid red;
    }
</style>




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
