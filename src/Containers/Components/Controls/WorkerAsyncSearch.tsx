import React, { Component } from 'react';
import SelectAsync, { ISelectItem } from './AsyncSelect';
import { workerAPI } from '../../../Services/API';

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
}

export class WorkerAsyncSearch extends Component<any> {
  static defaultProps = {
    onSelect: undefined,
    onClear: undefined,
    isClearable: true,
    filterFunc: (item: any) => true,
    searchParams: {},
  };

  find = async (value = '') => {
    const response: any = await workerAPI.loadWorkers({
      ...this.props.searchParams,
      firstName: value,
    });
    if (response.data) {
      const workers = response.data.results.map((worker: any) => ({
        label: worker.name,
        value: worker,
      }));
      return workers;
    }
    return [];
  };

  render() {
    return (
      <SelectAsync
        defaultValue={this.props.defaultValue}
        defaultInputValue={this.props.defaultInputValue}
        current_value={this.props.current_value}
        isMulti={this.props.isMulti}
        onClear={this.props.onClear}
        isClearable={this.props.isClearable}
        promiseOptions={this.find}
        onSelect={this.props.onSelect}
        placeholder={'Select worker'}
      />
    );
  }
}
