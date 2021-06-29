import React, { Component } from 'react';
import SelectAsync, { ISelectItem } from './AsyncSelect';
import { jobAPI } from '../../../Services/API';

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
  triggerReloadKey?: any;
}

export class ConfNumberAsyncSearch extends Component<Props> {
  selectAsync: React.RefObject<SelectAsync>;

  static defaultProps = {
    onSelect: undefined,
    onClear: undefined,
    isClearable: true,
    filterFunc: (item: any) => true,
    searchParams: {},
  };

  constructor(props) {
    super(props);
    this.selectAsync = React.createRef();
  }

  forceReload = () => {
    if (this.selectAsync && this.selectAsync.current) {
      this.selectAsync.current.forceReload();
    }
  };

  find = async (value = '') => {
    const response: any = await jobAPI.loadConfNumbers({
      ...this.props.searchParams,
      jobId: value,
    });
    if (response.data.jobs) {
      const confNumbers = response.data.jobs.map((job: any) => ({
        label: job.id,
        value: job,
      }));
      return confNumbers;
    }
    return [];
  };

  render() {
    return (
      <SelectAsync
        key={JSON.stringify(this.props)}
        ref={this.selectAsync}
        triggerReloadKey={this.props.triggerReloadKey}
        defaultValue={this.props.defaultValue}
        defaultInputValue={this.props.defaultInputValue}
        isMulti={this.props.isMulti}
        onClear={this.props.onClear}
        isClearable={this.props.isClearable}
        promiseOptions={this.find}
        onSelect={this.props.onSelect}
        placeholder={this.props.placeholder}
      />
    );
  }
}
