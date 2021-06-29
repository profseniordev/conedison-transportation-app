import React, { Component } from 'react';
import { LinearProgress } from '@material-ui/core'
import { connect } from "react-redux";

class Loading extends Component {

    render() {
        const props = this.props;

        if (!props.processing) {
            return null;
        }
        return (<LinearProgress className={'linear-progress'} />)
    }
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    }
}

function mapStateToProps(state) {
    return {
        processing: state.jobs.locations_processing
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Loading);
