import reqwest from 'reqwest'
import mainHTML from './text/main.html!text'
import share from './lib/share'
import { Animal } from './modules/animal'
import ejs from 'ejs'
var animal;

export function init(el, context, config, mediator) {

  	el.innerHTML = ejs.render(mainHTML, { assetPath: config.assetPath });

	reqwest({
	  url: 'https://interactive.guim.co.uk/docsdata-test/1VyDVzE70O_WmToLd1qTheV2t1riqDrC_JDNQyZZbTJM.json',
	  type: 'json',
	  crossOrigin: true,
	  success: (resp) =>  { 
	  	handleData(resp) 
	  }
	});
    
}

function handleData(data) {
  animal = new Animal(data)
}