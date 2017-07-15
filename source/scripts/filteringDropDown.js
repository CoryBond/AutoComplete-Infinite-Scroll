import React from 'react';
import ReactDOM from 'react-dom';

import * as s from '../styles/component-styles.js';

export default class FilteringDropDown extends React.Component {
  constructor(props) {
    super(props);
    this.onOptionSelect = this.onOptionSelect.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onFocusOut = this.onFocusOut.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.updateScrollPosition = this.updateScrollPosition.bind(this)
    this.state = {
      options: [],
      value: '',
      focusedIndex: -1,
      scrollPosition: 0
    }
  }

  componentDidMount() {
    this.optionsView.addEventListener('scroll', this.updateScrollPosition)
  }
  componentWillUnmount() {
    this.optionsView.removeEventListener('scroll', this.updateScrollPosition)
  }

  updateScrollPosition() {
    const newScrollPosition = this.optionsView.scrollTop / this.props.optionHeight
    const difference = Math.abs(this.state.scrollPosition - newScrollPosition)

    if (difference >= this.props.maxOptionsToRender / 5) {
      this.setState({ 
        scrollPosition: newScrollPosition, 
      })
    }
  }

  onChange(e) {
    let newValue = e.target.value;
    this.setNewValue(newValue);
  }

  onOptionSelect(name) {
    this.setClearOptionsAndSetValue(name);
  }

  onMouseOver(i){
    this.setFocus(i);
  }

  //Useful code from: https://gist.github.com/pstoica/4323d3e6e37e8a23dd59
  onFocusOut(e) {
    this.updateOptions([]);
  }

  setFocus(index){
    this.setState({
      focusedIndex: index,
    });
  }

  onKeyDown(e) {
			let key = e.keyCode;
			if (key == 38) {
				this.changeItemFocus(FilteringDropDown.UP);
        e.preventDefault();
			}
			else if (key == 40) {
				this.changeItemFocus(FilteringDropDown.DOWN);
        e.preventDefault();
			} 
      // Enter
      else if(key == 13) {
        this.selectCurrentFocus();
        e.preventDefault();
      }
	}

  selectCurrentFocus(){
    let currentFocusedIndex = this.state.focusedIndex;
    let options = this.state.options;
    if(currentFocusedIndex < 0) return;
    let name = options[currentFocusedIndex].original;
    this.setState({
      value: name,
      options: [],
      focusedIndex: -1,
    });
  }

  setClearOptionsAndSetValue(newValue){
    this.setState({
      value: newValue,
      options: [],
      focusedIndex: -1,
    });
  }

  setNewValue(newValue){
    if(newValue){
      this.setState({
        value: newValue
      });
      var data = this.props.getData(newValue, this.updateOptions.bind(this));
      //getNames(newValue, this.updateOptions.bind(this));
    } else{
      this.setState({
        value: "",
        options: [],
        focusedIndex: -1,
      });
    }
  }

  updateOptions(filteredNames){
    //console.log("FilterNames AMOUNT: " + filteredNames.length);

    this.setState({
      options: filteredNames,
      focusedIndex: -1
    });
  }

  changeItemFocus(direction){
    let currentFocusedIndex = this.state.focusedIndex;
    let optionsSize = this.state.options.length;
    var finalFocusedIndex = 0;
    if(direction == FilteringDropDown.UP){
      currentFocusedIndex--;
      finalFocusedIndex = (currentFocusedIndex < 0) ? 0 : currentFocusedIndex;

      if(finalFocusedIndex * this.props.optionHeight <= (this.optionsView.scrollTop)){
        this.optionsView.scrollTop = ((finalFocusedIndex + 1) * this.props.optionHeight) - (this.props.optionsHeight / 2);
      }
    } else if(direction == FilteringDropDown.DOWN){
      currentFocusedIndex++;
      finalFocusedIndex = currentFocusedIndex >= this.state.options.length ? this.state.options.length - 1 : currentFocusedIndex;

      if(finalFocusedIndex * this.props.optionHeight >= (this.optionsView.scrollTop + this.props.optionsHeight)){
        this.optionsView.scrollTop = ((finalFocusedIndex - 1) * this.props.optionHeight) - (this.props.optionsHeight / 2);
      }
    }

    this.setState({
      focusedIndex: finalFocusedIndex
    });
  }

  render() {
    const startPosition = this.state.scrollPosition -
      this.props.maxOptionsToRender > 0
        ? this.state.scrollPosition - this.props.maxOptionsToRender
        : 0;

    const endPosition = this.state.scrollPosition +
      this.props.maxOptionsToRender >=
      this.state.options.length
      ? this.state.options.length
      : this.state.scrollPosition + this.props.maxOptionsToRender;

      let totalHeightOfAllOptions = this.state.options.length * this.props.optionHeight;
      let newHeight = (this.props.optionsHeight < totalHeightOfAllOptions) ? this.props.optionsHeight : totalHeightOfAllOptions;
      
      // The spacers between the list of data are used to adjust the scroll accordingly. 
      // They measure how much items are before and after the ones we are currently rendering
      // and add empty space so that the scroll reflects where we are in the underlying list.
      // The result?? a scroll that seems to scroll in accordance to all items in the options array.
    return (
        <s.FilterDropDown id="FilteringDropDown">
            <s.NameInput id="Input" onChange={this.onChange} value={this.state.value} onBlur={this.onFocusOut} onKeyDown={this.onKeyDown}/>
            <s.Options innerRef={(optionsView) => {this.optionsView = optionsView}} height={newHeight}>
              <div
                key="list-spacer-top"
                style={{
                  height: startPosition * this.props.optionHeight
                }}
              />
              {this.state.options.slice(startPosition,endPosition).map((option, i) =>
                <s.Option key={startPosition + i} height={this.props.optionHeight} onMouseOver={this.onMouseOver.bind(this, startPosition + i)} 
                onMouseDown={this.onOptionSelect.bind(this, option.original)} onKeyDown={this.onKeyDown} scrollColor={this.props.scrollColor}
                isFocused={this.state.focusedIndex === startPosition + i || this.state.focusedIndex === this.state.options.length } 
                >
                  {option.before}
                  <strong>{option.matched}</strong>
                  {option.after}
                </s.Option>
              )}
              <div
                key="list-spacer-bottom"
                style={{
                  height: this.state.options.length * this.props.optionHeight - endPosition * this.props.optionHeight
                }}
              />
            </s.Options>
        </s.FilterDropDown>
    );
  };
};

FilteringDropDown.DOWN = "DOWN";
FilteringDropDown.UP = "UP";


FilteringDropDown.defaultProps = {
    maxOptionsToRender : 100,
    optionHeight : 20,
    optionsHeight : 600,
    scrollColor : "#90EE90",
    getData : function(input, cb) {cb(getMockDatas(input))}
}

function getMockDatas(input){
  return[getMockData(1,input), getMockData(2,input),getMockData(3,input),getMockData(4,input)];
}

function getMockData(i, input){
  return {
    matched: input,
    before: i + ". ",
    after: " test",
    original: i + input + " test"
  };
}
