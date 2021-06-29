import * as React from 'react';
import './CheckboxComponent.scss';
import CircleCheckedFilled from '@material-ui/icons/CheckCircle';
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';

interface Props {
  name?: string;
  hasTitle?: string;
  onChange?: Function;
  checked?: boolean;
  className?: string;
  classNameIcon?: string;
  id: any;
  skipReceiveProps?: boolean;
  disabled?: boolean;
  style?: any;
  color?: string;
}

export class CheckboxComponent extends React.Component<Props> {
  checked: boolean = this.props.checked;

  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.skipReceiveProps) {
      this.checked = nextProps.checked;
      this.setState({ change: true });
    }
  }

  public render() {
    return (
      <div
        className={`ce-chk-control ml-0 ${this.props.disabled ? null : 'cursor-pointer '}` + this.props.className}
        onClick={(e) => {
          e.stopPropagation();
          if (!this.props.disabled) {
            this.checked = !this.checked;
            this.setState({ checked: true });
            if (this.props.onChange) {
              this.props.onChange(this.checked);
            }
          }
        }}

      style={this.props.style ? this.props.style : {}}>
        {
          this.checked
            ? (!this.props.disabled
              ? <CircleCheckedFilled style={{fill:  `${this.props.color ? this.props.color : '#2F80ED'}` }}/> 
              : <CircleUnchecked/> ) 
            : <CircleUnchecked /> 
        }

        <label className="ce-title no-margin" htmlFor={this.props.id}>
          {
            this.props.hasTitle &&
            <span className="ce-ml-10">{this.props.hasTitle}</span>
          }
        </label>
      </div>
    );
  }
}

export default CheckboxComponent;
