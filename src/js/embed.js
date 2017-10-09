import iframeMessenger from 'guardian/iframe-messenger'
import reqwest from 'reqwest'
import embedHTML from './text/embed.html!text'
import { Animal } from './modules/animal'
import ejs from 'ejs'
var animal;

var startTime, endTime, downloadSize, duration, bitsLoaded, speedBps, maxbitrate;


window.init = function init(el, config) {

    iframeMessenger.enableAutoResize();
    
    el.innerHTML = ejs.render(embedHTML, { assetPath: config.assetPath });

	reqwest({
	  url: 'https://interactive.guim.co.uk/docsdata-test/1VyDVzE70O_WmToLd1qTheV2t1riqDrC_JDNQyZZbTJM.json',
	  type: 'json',
	  crossOrigin: true,
	  success: (resp) =>  { 
	  	handleData(resp) 
	  }
	});

};

function handleData(data) {
  animal = new Animal(data)
}