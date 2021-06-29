import React, {Component} from 'react';
import {
    withStyles,
} from '@material-ui/core';
import {actions} from "../../../../Services";
import {connect} from "react-redux";
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

const statuses = [
    {value: 'pending',         label: 'Pending',    color: '#FFB300'},
    {value: 'assigned',        label: 'Assigned',   color: '#d69926'},
    {value: 'en_route',        label: 'En-Route',   color: '#4CAF50'},
    {value: 'on_location',     label: 'On Location',color: '#4CAF50'},
    {value: 'secured',         label: 'Secured',    color: 'rgba(70,152,224,.12)'},
    {value: 'crew_arrived',    label: 'Crew',       color: 'rgba(70,152,224,.12)'},
    {value: 'cannot_secure',   label: 'Unsecured',  color: '#D0021B'},
    {value: 'review',          label: 'Review',     color: '#FFFFFF'},
    {value: 'finished',        label: 'Completed',  color: '#FFFFFF'},
    {value: 'cancelled',       label: 'Cancel',     color: '#FFFFFF'},
];

const styles = theme => (
    {
        root: {
            backgroundColor: '#F5F6FB',
            height: '48px',
            marginRight: '-1px',
            borderBottom: '1.5px solid #e9ecf1',
            display: 'flex',
            justifyContent: 'space-between',
            '& .MuiButtonBase-root':{
                flex: 'auto',
                minWidth: '40px',
                border: '0.5px solid rgba(191,193,201,0.20)',
            },

            '& .MuiBottomNavigationAction-label':{
                whiteSpace: 'nowrap',
                textTransform: 'uppercase',
                fontSize: '10px',
                letterSpacing: '0.33px',
                fontWeight: 700,
                lineHeight: '16px',
                color: '#828282'
               
            },
            '& .selected': {
                backgroundColor: '#FFFFFF',
                border: 'none',
                '& .MuiBottomNavigationAction-label':{
                    color: 'rgba(0,0,0,0.87)'
                }
            },
        },
    }
);

class JobsFilter extends Component {

    updateFilter = (filters, type = 'search_options') => {
        if(type === 'search_options'){
            this.props.updateFilters(filters);
        }
    };

    render() {
        const { classes , search_options} = this.props;
        const status = search_options.worker_statuses;

        return (
            <BottomNavigation
                value={status}
                onChange={(event, newValue) => {
                    if (newValue === 0) {
                        this.updateFilter({'worker_statuses': '', page: 0});
                        return;
                    }
                    newValue = newValue -1;
                    let new_statuses = status;
                    new_statuses = new_statuses.replace(',,', ',');
                    new_statuses = new_statuses.replace(',_', ',');
                    if (status.indexOf(statuses[newValue].value) === -1) {
                        new_statuses = new_statuses + ',' + statuses[newValue].value
                    } else {
                        new_statuses = new_statuses.replace(statuses[newValue].value, '')
                    }
                    this.updateFilter({'worker_statuses': new_statuses, page: 0})
                }}
                className={classes.root}
                showLabels
            >
                {/*<BottomNavigationAction label={'Reset'} className={'reset-btn'}/>*/}
                <BottomNavigationAction label={'All'} className={status === '' ? 'selected' : ''}/>
                {
                    statuses.map((stat, index) => (
                        <BottomNavigationAction key={index}
                                                label={stat.label}
                                                className={status.indexOf(stat.value) !== -1 || status === '' ? 'selected' : ''}
                                                style={{
                                                    borderTop: stat.color ? `5px solid ${stat.color}` : ''
                                                }}
                        />
                    ))
                }
            </BottomNavigation>
        )
    }
}


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        // updateSearchOption: (filters) => dispatch(actions.JobsActions.updateSearchOption(filters)),
        updateFilters: (filters) => dispatch(actions.JobsActions.updateLocationsFilters(filters)),
    }
}

function mapStateToProps(state)
{
    return {
        search_options      : state.jobs.locations_search_options,
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(JobsFilter));
