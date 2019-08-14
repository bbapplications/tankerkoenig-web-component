import Vue from 'vue';
import wrap from '@vue/web-component-wrapper';
import TkWebComponent from './components/TkWebComponent';


/*
if (navigator.appName == 'Microsoft Internet Explorer'
    || !!(navigator.userAgent.match(/Trident/)
    || navigator.userAgent.match(/rv:11/))
    || (/Edge\/\d./i.test(navigator.userAgent)) ) {
    alert("your browser sucks!")
}
*/

/*const WrappedElement = wrap(Vue, TkWebComponent);
window.customElements.define('tk-web-component', WrappedElement);*/


if(window.customElements) {
    const WrappedElement = wrap(Vue, TkWebComponent);
    window.customElements.define('tk-web-component', WrappedElement);
} else {
    var newDiv = document.createElement("div");
    var newContent = document.createTextNode("Tankerkönig Web Komponente unterstützt keine veralteten Browser.");
    newDiv.appendChild(newContent);

    document.getElementById('tkwidget').appendChild(newDiv);

}


