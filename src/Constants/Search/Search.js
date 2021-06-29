import React, {Component} from 'react';
import {
    withStyles,
    TextField,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import classNames from 'classnames';

const styles = {
    root: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        height: '100%',
        padding: '15px',
        '& .MuiInput-underline.Mui-disabled:before': {
            borderBottom: 'none',
        },
        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
            borderBottom: 'none',
        },
        '& .MuiInput-underline:before': {
            borderBottom: 'none',
        },
        '& .MuiInput-underline.Mui-focused:after': {
            borderBottom: 'none',
        },
        '& .MuiInput-underline:after': {
            borderBottom: 'none',
        },
    },
    icon: {
        width: '30px',
        height: '30px',
        marginRight: '10px',
    },
    input:{
      fontSize: '14px',
      fontStyle: 'normal',
      fontWeight: 'normal',
      lineHeight: '24px',
    },
    '& input:placeholder': {
        fontSize: '14px',
        fontStyle: 'normal',
        fontWeight: 'normal',
        lineHeight: '24px',
        display: 'flex',
        alignItems: 'center',
        color: '#BDBDBD',
        fontFamily: 'Roboto',
    },
    dialog: {
        input : {
            borderRadius: "5px"
        }
    }
};

class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
            search_value: '',
            focused: false,
            instant: props.instant ? props.instant : false
        };
        this.handleBlur   = this._handleBlur.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.search_value &&  nextProps.search_value !== this.state.search_value){
            this.setState({
                search_value: nextProps.search_value
            })
        }
    }

    handleChange = (e) => {
        this.setState({
            search_value: e.target.value
        }, () => {
            if(this.props.instant) {
                this.props.updateFilters({search: this.state.search_value,  page: 1});
            }
        });
    }

    _handleBlur() {
        if (this.state.focused ) {
            this.props.updateFilters({search: this.state.search_value,  page: 1});
        }
        this.setState({ focused: false });
    }

    showSearch = () => {
        this.setState({ focused: true });
        document.addEventListener('keydown', this.enterFunction, false);
    };

    enterFunction = (event) => {
        if ( event.keyCode === 13 && this.state.focused) {
            let page = this.props.page;
            if(this.props.search_value !== this.state.search_value){
                page = 1;
            }
            this.props.updateFilters({search: this.state.search_value,  page: page});
        }
    };

    render() {
        const {classes, placeholder='Search', dialog, className} = this.props;

        if (dialog) {
            return (
                <div className={classNames("flex items-center w-full", className)}>
                    <div className="w-full relative">
                        <TextField
                            fullWidth
                            InputProps={{
                                placeholder    : placeholder,
                                value          : this.state.search_value,
                                onChange       : this.handleChange,
                                onFocus        : this.showSearch,
                                autoFocus      : false,
                                classes : {
                                    input         : classNames(classes.dialog.input, "py-0 px-14 h-40 pr-40"),
                                    notchedOutline: "rounded-8",
                                }
                            }}
                            variant="outlined"
                            onBlur={this.handleBlur}
                        />
                    </div>
                </div>
            )
        }

        return (
            <div className={classes.root}>
                <SearchIcon className={classes.icon}/>
                <TextField
                    fullWidth
                    InputProps={{
                        placeholder    : placeholder,
                        value          : this.state.search_value,
                        onChange       : this.handleChange,
                        onFocus        : this.showSearch,
                        autoFocus      : false,
                        classes : {
                            borderBottom: null,
                            input         : classNames(classes.input, 'py-0 px-14 h-40 pr-40'),
                        }
                    }}
                    onBlur={this.handleBlur}
                />
            </div>
        );
    }
}

export default withStyles(styles)(Search);
