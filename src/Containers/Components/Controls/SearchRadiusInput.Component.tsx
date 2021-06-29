import * as React from 'react';
import search from '../../../Images/search.png';
import './search-radius.scss';

interface Props {
  value?: string;
  onChange?: (event) => void;
  checked?: boolean;
  className?: string;
  name?: string;
  placeholder?: string;
}

export class CETSearchRadiusInput extends React.Component<Props> {

  public render() {
    return (

      <div className="form-control-search">
        <img src={search} alt="" />
        <input
          className="ce-form-control"
          name={this.props.name}
          value={this.props.value}
          placeholder={this.props.placeholder}
          onChange={this.props.onChange} />
      </div>

    );
  }
}

export default CETSearchRadiusInput;
