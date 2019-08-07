<template>
    <div>
        <h1>TK Vue Web Component</h1>
        <div class="message">{{ msg }}</div>
        <tabs>
            <tab title="Benzin">
                E10
            </tab>
            <tab title="Super">
                E5
            </tab>
            <tab title="Diesel">
                Diesel
            </tab>
        </tabs>
    </div>
</template>

<script>
    import axios from 'axios';
    import { Tabs, Tab } from 'vue-slim-tabs';
    export default {
        props: ['msg'],
        components: {
            Tabs, Tab
        }
    }
</script>
<style>

    .vue-tablist {
        list-style: none;
        display: flex;
        padding-left: 0;
        border-bottom: 1px solid #e2e2e2;
    }

    .vue-tab {
        padding: 5px 10px;
        cursor: pointer;
        user-select: none;
        border: 1px solid transparent;
        border-bottom-color: #e2e2e2;
        border-radius: 3px 3px 0 0;
        background-color: white;
        position: relative;
        bottom: -1px;
    }

    .vue-tab[aria-selected="true"] {
        border-color: #e2e2e2;
        border-bottom-color: transparent;
    }

    .vue-tab[aria-disabled="true"] {
        cursor: not-allowed;
        color: #999;
    }

    h1 {
        color: var(--headline-text-color, red);
    }

    .message {
        color: var(--message-text-color, blue);
    }
</style>
