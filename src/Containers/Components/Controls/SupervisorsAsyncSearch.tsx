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
  departmentId?: number;
}

export class SupervisorsAsyncSearch extends Component<any> {
  static defaultProps = {
    onSelect: undefined,
    onClear: undefined,
    isClearable: true,
    filterFunc: (item: any) => true,
    searchParams: {},
    disabled: false,
    triggerReloadKey: ''
  };

  state = {
    triggerReloadKey: '',
    current_value: null,
  }

  componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<{}>, snapshot?: any): void {
    if(prevProps.departmentId !== this.props.departmentId || prevProps.triggerReloadKey !== this.props.triggerReloadKey ) {
      //this.find('');
      this.setState({triggerReloadKey: this.props.triggerReloadKey});
    }
  }

  hundleUpdate = () => {
    this.setState({workers: []})
  }

  find = async (value) => {
    // TODO: implement user search
    const response: any = await userAPI.supervisors({
      department_id: this.props.departmentId,
      firstName: value
    });
    if (response.data) {
      const workers = response.data.supervisors.map((worker: any) => ({
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
      this.setState({triggerReloadKey: null});
      return workers;
    }
    return [];
  };

  render() {
    return (
      <SelectAsync
        current_value={this.props.current_value}
        onBlur={this.props.handleBlur}
        triggerReloadKey={this.state.triggerReloadKey}
        defaultValue={this.props.defaultValue}
        defaultInputValue={this.props.defaultInputValue}
        isMulti={this.props.isMulti}
        onClear={this.props.onClear}
        isClearable={this.props.isClearable}
        promiseOptions={this.find}
        onSelect={this.props.onSelect}
        disabled={this.props.disabled}
         />
    );
  }
}
