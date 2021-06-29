import React, { Component } from 'react';
import SelectAsync, { ISelectItem } from './AsyncSelect';
import { userAPI } from '../../../Services/API';

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
  creatable?: any;
  value?: any;
  usersNotAvailable?: string[];
  triggerReloadKey?: string;
}

export class UsersAsyncSearch extends Component<Props> {
  static defaultProps = {
    onSelect: undefined,
    onClear: undefined,
    isClearable: true,
    filterFunc: (item: any) => true,
    searchParams: {},
    disabled: false,
    triggerReloadKey: ''
  };

  find = async (value) => {
    // TODO: implement user search
    const response: any = await userAPI.users({
      ...this.props.searchParams, firstName: value,
    });
    if (response.data) {
      const workers = response.data.results.map((worker: any) => ({
        label: worker.name,
        value: worker,
      }));
      if (
        this.props.usersNotAvailable &&
        this.props.usersNotAvailable.some((userId) => userId !== null && userId !==undefined)
      ) {
        return workers.filter(
          (worker) =>
            this.props.usersNotAvailable.indexOf(worker.value.id) === -1
        );
      }

      return workers;
    }
    return [];
  };

  render() {
    return (
      <SelectAsync
        onBlur={this.props.handleBlur}
        triggerReloadKey={this.props.triggerReloadKey}
        defaultValue={this.props.defaultValue}
        defaultInputValue={this.props.defaultInputValue}
        isMulti={this.props.isMulti}
        onClear={this.props.onClear}
        isClearable={this.props.isClearable}
        promiseOptions={this.find}
        onSelect={this.props.onSelect}
        placeholder={this.props.placeholder}
        disabled={this.props.disabled} />
    );
  }
}
