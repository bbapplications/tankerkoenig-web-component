<template>
    <div>
        <h1>TK Vue Web Component</h1>
        <div class="message">{{ msg }}</div>
    </div>
</template>

<script>
    export default {
        props: ['msg']
    }
</script>
<style>
    h1 {
        color: var(--headline-text-color, red);
    }

    .message {
        color: var(--message-text-color, blue);
    }
</style>
