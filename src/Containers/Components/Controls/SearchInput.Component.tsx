import * as React from 'react';

interface Props {
  title?: string;
  onChange?: (event) => void;
  checked?: boolean;
  className?: string;
  name?: string;
  placeholder?: string;
}

export class CETSearchInput extends React.Component<Props> {
  public render() {
    return (
      <div className="ce-search-control">
        <input
          className="ce-search-control-input"
          name={this.props.name}
          value={this.props.title}
          placeholder={this.props.placeholder}
          onChange={this.props.onChange}
        />
      </div>
    );
  }
}

export default CETSearchInput;
