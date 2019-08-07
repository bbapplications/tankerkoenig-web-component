import Vue from 'vue';
import wrap from '@vue/web-component-wrapper';
import TkWebComponent from './components/TkWebComponent';

const WrappedElement = wrap(Vue, TkWebComponent);

window.customElements.define('tk-web-component', WrappedElement);
