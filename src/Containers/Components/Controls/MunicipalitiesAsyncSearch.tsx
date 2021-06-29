import React, { Component } from 'react';
import SelectAsync, { ISelectItem } from './AsyncSelect';
import { MUNICIPALITY } from '../../../Constants/job';

interface Props {
  onSelect?: (item: ISelectItem) => void;
  onClear?: () => void;
  placeholder?: string;
  isClearable?: boolean;
  filterFunc?: (item: ISelectItem) => boolean;
  searchParams?: any;
  defaultValue?: any;
  handleBlur?: any;
  defaultInputValue?: string;
  isMulti?: boolean;
  disabled?: boolean;
  value?: any;
  current_value?: any;
}

export default class MunicipalitiesAsyncSearch extends Component<Props> {

  static defaultProps = {
    onSelect: undefined,
    onClear: undefined,
    isClearable: true,
    filterFunc: item => true,
    searchParams: {},
    disabled: false,
  };

  find = async () => {
    return MUNICIPALITY;
  };

  render() {
    return (
      <SelectAsync
        disabled={this.props.disabled}
        onBlur={this.props.handleBlur}
        onClear={this.props.onClear}
        isClearable={this.props.isClearable}
        placeholder={'Select municipality'}
        promiseOptions={this.find}
        onSelect={this.props.onSelect}
        current_value={this.props.value}
        defaultValue={this.props.defaultValue}
        defaultInputValue={this.props.defaultInputValue}
        isMulti={this.props.isMulti}/>
    );
  }
}
