import React  from 'react';
import AsyncSelect from 'react-select/async';

export interface ISelectItem {
  value: any;
  label: string;
}

export default class SelectAsync extends React.Component<any> {
  asyncSelect: React.RefObject<any>;

  constructor(props) {
    super(props);
    this.asyncSelect = React.createRef();
  }

  static defaultProps = {
    onSelect: undefined,
    onClear: undefined,
    isClearable: true,
    promiseOptions: inputValue => new Promise(resolve => {
        resolve([]);
    })
  };

  componentDidUpdate(prevProps): void {
    if(prevProps.current_value !== this.props.current_value) {

    }
  }

  forceReload = () => {
    if (this.asyncSelect && this.asyncSelect.current) {
      this.asyncSelect.current.loadOptions('');
    }
  };

  render() {
    return (
      <AsyncSelect
        key={JSON.stringify(this.props.triggerReloadKey)}
        ref={this.asyncSelect}
        {...this.props}
        onClear={this.props.onClear}
        isClearable={this.props.isClearable}
        placeholder={this.props.placeholder}
        cacheOptions
        defaultOptions
        isDisabled={this.props.disabled}
        defaultValue={this.props.defaultValue}
        loadOptions={this.props.promiseOptions}
        onChange={this.props.onSelect}
        defaultInputValue={this.props.defaultInputValue}
        value={this.props.current_value}
        isOptionDisabled={this.props.disabledOption ? (option) => option.value.id === this.props.disabledOption : null}
        isMulti={this.props.isMulti} />
    );
  }
}
