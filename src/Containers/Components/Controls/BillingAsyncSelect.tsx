import React, { Component } from 'react';
import SelectAsync, { ISelectItem } from './AsyncSelect';
import { subcontractorsAPI } from '../../../Services/API';

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
  withNone?: boolean;
  value?: any;
}

export default class BillingAsyncSelect extends Component<Props> {
  static defaultProps = {
    onSelect: undefined,
    onClear: undefined,
    isClearable: true,
    filterFunc: (item) => true,
    searchParams: {},
    withNone: false,
  };

  findSubcontractors = async (value) => {
    let result = [];
    if (this.props.withNone) {
      result = [
        { label: 'Pending Biller Approval', value: 1 },
        { label: 'Timesheet Verified - Pending Con-Ed Approval', value: 2 },
        { label: 'Coned Disputed,\n' + 'Pending Verification', value: 3 },
        { label: 'Coned Approved,\n' + 'Pending to be Billed', value: 4 },
        { label: 'Billed', value: 5 },
      ];
    }
    // const response: any = await subcontractorsAPI.loadSubcontractors(
    //     { ...this.props.searchParams, firstName: value });
    // if (response.data) {
    //     const subcontractors = response.data.results.filter(subcontractor => subcontractor.subcontractor != null).map(subcontractor => ({
    //         label: subcontractor.subcontractor.name,
    //         value: subcontractor,
    //     })).filter(this.props.filterFunc);
    //
    //     return [...result, ...subcontractors];
    // }
    return [...result];
  };

  render() {
    return (
      <SelectAsync
        onClear={this.props.onClear}
        isClearable={this.props.isClearable}
        placeholder={'Select Billing'}
        promiseOptions={this.findSubcontractors}
        onSelect={this.props.onSelect}
        defaultValue={this.props.defaultValue}
        defaultInputValue={this.props.defaultInputValue}
        isMulti={this.props.isMulti}
        value={this.props.value}
      />
    );
  }
}
