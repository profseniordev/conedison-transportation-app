import React, { Component } from 'react';
import SelectAsync, { ISelectItem } from './AsyncSelect';
import Geocode from 'react-geocode';

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
  value?: any;
  isMulti?: boolean;
  disabled?: boolean;
  name?:string;
  current_value?: any;
}

export default class LocationsAsyncSearch extends Component<Props> {

  static defaultProps = {
    onSelect: undefined,
    onClear: undefined,
    isClearable: true,
    filterFunc: item => true,
    searchParams: {},
  };

  find = async (value) => {
    const response: any = await Geocode.fromAddress(value);
    if (Array.isArray(response.results)) {
      return response.results.map(location => ({
        label: location.formatted_address,
        value: {
          address: location.formatted_address,
          lat: location.geometry.location.lat,
          lng: location.geometry.location.lng,
        },
      }));
    }
    return [];
  };

  render() {
    return (
      <SelectAsync
        current_value={this.props.current_value}
        disabled={this.props.disabled}
        onBlur={this.props.handleBlur}
        onClear={this.props.onClear}
        isClearable={this.props.isClearable}
        placeholder={'Find locations'}
        promiseOptions={this.find}
        onSelect={this.props.onSelect}
        defaultValue={this.props.defaultValue}
        defaultInputValue={this.props.defaultInputValue}
        value={this.props.value}
        isMulti={this.props.isMulti} />
    );
  }
}
