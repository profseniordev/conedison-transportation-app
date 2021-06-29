import React, { Component } from 'react';
import SelectAsync, { ISelectItem } from './AsyncSelect';
import { requestorAPI } from '../../../Services/API';

interface Props {
  onSelect?: (item: ISelectItem) => void;
  onClear?: () => void;
  placeholder?: string;
  isClearable?: boolean;
  filterFunc?: (item: ISelectItem) => boolean;
  searchParams?: any;
  defaultValue?: any;
  defaultInputValue?: string;
  isMulti?: boolean;
  triggerReloadKey?: string;
  departmentId?: number;
}

export class RequestorAsyncSearch extends Component<any> {

  static defaultProps = {
    onSelect: undefined,
    onClear: undefined,
    isClearable: true,
    filterFunc: (item: any) => true,
    searchParams: {},
    triggerReloadKey: '',
  };

  state = {
    triggerReloadKey: ''
  }

  componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<{}>, snapshot?: any): void {
    if(prevProps.departmentId !== this.props.departmentId) {
      this.setState({triggerReloadKey: this.props.triggerReloadKey});
    }
    
  }

  find = async (value = '') => {
    const response: any = await requestorAPI.loadRequestors({
      ...this.props.searchParams,
      firstName: value,
      department_id: this.props.departmentId,
    });
    if (response.data) {
      const requestors = response.data.results.map((requestors) => ({
        label: requestors.name,
        value: requestors,
      }));
      this.setState({triggerReloadKey: null});
      return requestors;
    }
    return [];
  };

  render() {
    return (
      <SelectAsync
        defaultValue={this.props.defaultValue}
        triggerReloadKey={this.state.triggerReloadKey}
        defaultInputValue={this.props.defaultInputValue}
        current_value={this.props.current_value}
        isMulti={this.props.isMulti}
        onClear={this.props.onClear}
        isClearable={this.props.isClearable}
        promiseOptions={this.find}
        onSelect={this.props.onSelect}
        placeholder={'Select requester'}
      />
  );
  }
}
