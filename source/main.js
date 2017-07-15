import React from 'react';
import ReactDOM from 'react-dom';
import FilteringDropDown from './scripts/filteringDropDown';
import { getNames } from './scripts/resources/namesMockResource';

/*
  For this widget I have implemented virtual scrolling to handle possibly large amounts of data coming from the server.
  This way no matter how we filter the data to get optimal results for the user we can still reliably show that data
  to them even if the results give us back large amounts of data. My solution was inspired by jwarning's react-scrollable list:
  https://github.com/jwarning/react-scrollable-list, an MTA licensed scrollable react list that can handle 10,000+ items efficiently.

  If there are 10,000 Rachels in the name database... for.. some reason, we will be able to show every rachel in
  a scrollable way.

  Current filtering is simple... it currently matches any substring and has no awareness of first or last names.
  More optimal filtering may provide these as an option in future development. Right now though I think currently searching for 
  names feels natural for a user. if they type in "Rachel" its fast and reliable even with 10K worht of data.
  
  There are problems with this implementation though.
  Typing in something like "a" will return a large amount of data from the server (as one might expect with this simple filtering.)
  Not only would this data not be really useful but this can cause bandwidth problems on a network. We can't see it now because
  we are not using a network but that is an issue that needs to be handled. 

  Another feature that might be added to this component is to allow throttling. In other words if a user is typing a name
  really fast we don't want to send out multiple requests that the server doesn't need to process. We should wait an x
  amount of time waiting to see if the user is typing anything else out. If the user paused within this time range then send
  a request with the full substring out. This can improve user performance and network performance.

  Overall though with all issues taken into consideration I am proud of the component I made. I think its great for handling
  lots of data in a react component. I am aware of SAAS components that can do what I tried to do below and overall are better
  (AG Grid) but this is in house and free. 
*/

ReactDOM.render(
  <div>
    <label>Select a Name!</label>
    <FilteringDropDown maxOptionsToRender={50} optionHeight={30} optionsHeight={300} scrollColor={"#A675A2"} getData={getNames}/>
    <span>Test</span>
  </div>
, document.getElementById('content'));














/* NOTE / TODO:
  Many combinations of the props above work perfectly fine.... however some have scrolling issues.
  In particular if you do something like maxOptionsToRender={25} optionHeight={20} optionsHeight={100}
  then scrolling too much in one direction deselects rows and makes the select index be completely off.

  I think this has to due with the buffer we give the difference before we 
  change/affect the scroll position.

  Also if you make it maxOptionsToRender={25} optionHeight={100} optionsHeight={200} then scrolling works... 
  but scrolling down causes the selected index to be one after what is shown in the dropdown.

  These are all things that have to addressed to make it a more modular and flexable component.

  Defaults for these props can be found in the filteringDropDown.js file.
*/