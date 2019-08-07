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
    h1 {
        color: var(--headline-text-color, red);
    }

    .message {
        color: var(--message-text-color, blue);
    }
</style>

```
customers can overwerite these styles on their page i.e with a style tag in head

<style>
    tk-web-component {
        --headline-text-color: green;
        --message-text-color: purple;
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
