import React from 'react';
import {
    TableCell,
    TableRow,
    Icon
} from '@material-ui/core';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';

const before_icon = {
    content: 'close-quote',
    position: 'absolute',
    width: '20px',
    height: '20px',
    top: '1px',
    left: '1px',
    borderRadius: '50%',
    zIndex: -1
};

const useStyles = makeStyles(theme => ({
    asap: {
        backgroundColor: '#FAB6B6',
        '&.Mui-selected': {
            backgroundColor: '#FAB6B6',
        },
        '&:hover': {
            backgroundColor: '#FAB6B6 !important'
        }
    },
    pending: {
        backgroundColor: '#FFECB3',
        '&.Mui-selected': {
            backgroundColor: '#FFECB3',
        },
        '&:hover': {
            backgroundColor: '#FFECB3 !important'
        }
    },
    assigned: {
        backgroundColor: '#FFECB3',
        '&.Mui-selected': {
            backgroundColor: '#FFECB3'
        },
        '&:hover': {
            backgroundColor: '#FFECB3 !important'
        }
    },
    en_route: {
        backgroundColor: '#E8F5E9',
        '&.Mui-selected': {
            backgroundColor: '#E8F5E9',
        },
        '&:hover': {
            backgroundColor: '#E8F5E9 !important'
        }
    },
    secured: {
        backgroundColor: 'rgba(70,152,224,.12)',
        '&.Mui-selected': {
            backgroundColor: 'rgba(70,152,224,.12)',
        },
        '&:hover': {
            backgroundColor: 'rgba(70,152,224,.12) !important'
        }
    },
    crew_arrived: {
        backgroundColor: 'rgba(70,152,224,.12)',
        '&.Mui-selected': {
            backgroundColor: 'rgba(70,152,224,.12)',
        },
        '&:hover': {
            backgroundColor: 'rgba(70,152,224,.12) !important'
        }
    },
    finished: {
        backgroundColor: '#F5F5F5',
        '&.Mui-selected': {
            backgroundColor: '#F5F5F5',
        },
        '&:hover': {
            backgroundColor: '#F5F5F5 !important'
        }
    },
    on_location: {
        backgroundColor: '#C7F09D',
        '&.Mui-selected': {
            backgroundColor: '#C7F09D',
        },
        ':hover': {
            backgroundColor: '#C7F09D'
        }
    },
    cannot_secure: {
        backgroundColor: '#FCE4EC',
        '&.Mui-selected': {
            backgroundColor: '#FCE4EC',
        },
        '&:hover': {
            backgroundColor: '#FCE4EC !important'
        }
    },
    status_icon: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTOp: '5px',
        marginRight: '10px',
        alignItems: 'center',
        '& .pending': {
            color: '#FFB300',
        },
        '& .assigned': {
            color: '#d69926',
        },
        '& .driver-canceled': {
            transform: 'rotate(90deg)',
            color: '#D0021B',
        },
        '& .user-canceled': {
            transform: 'rotate(90deg)',
            color: 'rgba(0,0,0,0.25)',
        },
        '& .company-canceled': {
            transform: 'rotate(90deg)',
            color: 'rgba(0,0,0,0.25)',
        },
        '& .finished': {
            color: '#9E9E9E',
        },
        '& .dropoff': {
            color: '#fff',
            position: 'relative',
            fontSize: '22px',
            zIndex: 1,
        },
        '& .dropoff:before': {
            ...before_icon,
            background: '#4d6cc8',
        },
        '& .pickup': {
            color: '#fff',
            position: 'relative',
            fontSize: '22px',
            zIndex: 1,
        },
        '& .pickup:before': {
            ...before_icon,
            background: '#4CAF50',
        },
        '& .arriving': {
            color: '#fff',
            position: 'relative',
            fontSize: '22px',
            zIndex: 1,
        },
        '& .arriving:before': {
            ...before_icon,
            background: '#4CAF50',

        },
        '& .accepted': {
            color: '#FFFFFF',
            position: 'relative',
            fontSize: '22px',
            zIndex: 1,
        },
        '& .accepted:before': {
            ...before_icon,
            background: '#4CAF50',
        },
        '& .alert': {
            color: 'red',
            position: 'relative',
            fontSize: '22px',
            zIndex: 1,
        },
        '& .alert:before': {
            ...before_icon,
            background: '#FFFFFF'
        },
    }
}));

const Ride = (props) => {
    const classes = useStyles(props);
    const row = props.row;

    // let revive = () => {
    //    props.updateRide(props.ride.id, {status: 'revive'});
    // };

    const calendarStrings = {
        lastDay: 'M/D h:mm A',
        sameDay: 'M/D h:mm A', // 'h:mm A',
        nextDay: 'M/D h:mm A',
        lastWeek: 'M/D h:mm A',
        nextWeek: 'M/D h:mm A',
        sameElse: 'M/D h:mm A'
    };


    let arrival_time = moment().add(row.eta, 'minutes');
    let pickup_at = moment(row.start_at);
    let difference = arrival_time.diff(pickup_at, 'minutes');
    let start_at = moment(row.start_at).calendar(calendarStrings);

    let is_late = ['assigned', 'en_route'].indexOf(row.status) !== - 1 && difference > 0 && difference < 1200;

    let ride_eta = null;
    if (['assigned', 'en_route', 'on_location', 'secured', 'crew_arrived', 'cannot_secure'].indexOf(row.status) !== -1) {
        if (row.eta !== null && row.eta !== '') {
            ride_eta = <p style={{ textAlign: 'left', fontFamily: 'Roboto' }}>{row.eta.toFixed(0)} min</p>
        }
    }

    let ride_eta_late = null;
    if (is_late) {
        ride_eta_late = <p style={{ color: 'red', fontWeight: 600, fontSize: 12, textAlign: 'left', fontFamily: 'Roboto' }}>{difference} min</p>
    }

    // address
    let start_street = '';
    let start_city = '';
    let address_components = row.address ? row.address.split(',') : [];
    if (address_components.hasOwnProperty(0)) {
        start_street = address_components[0].trim().substr(0, 10).toUpperCase();
    }
    if (address_components.hasOwnProperty(1)) {
        start_city = address_components[1].trim().substr(0, 10).toUpperCase();
    }

    let worker_name = row.worker_name;

    const handleClick = () => {
        props.handleClick(row);
    };

    return (
        <TableRow
            hover
            selected={props.isSelected}
            onClick={handleClick}
            tabIndex={-1}
            className={props.asap ? classes["asap"] : classes[row.status] }
            style={{
                // borderRight: is_late ? '10px solid red' : null,
                filter: (
                    row.status === 'pending' && (row.available_for_workers === false || row.available_for_workers === 0)
                ) ? 'grayscale(50%)' : null,
                borderTop: props.has_red_line ? '3px solid grey' : null
            }}
        >
            <TableCell align='left' className={'id-display-name'} style={{ borderLeft: props.isSelected ? '10px solid #029bd8' : '' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'left' }}>
                    <div>{row.job_id.toString().length > 5 ? row.job_id.toString().substr(row.job_id.toString().length - 5, 5) : row.job_id}-{row.shift_id}</div>
                    <div style={{ fontSize: 10, whiteSpace: 'nowrap' }}>{row.job_type}</div>
                </div>
            </TableCell>
            <TableCell align='left' className={'worker_information'}>
                {worker_name && <p style={{
                    textDecoration: row.worker_confirmed === 1 ? 'underline' : ''
                }
                }>{worker_name}</p>}
                {row.company_name && <p style={{ textDecoration: row.worker_confirmed === 1 ? 'underline' : '' }}>{`${row.company_name.substr(0, 17)}`}</p>}
            </TableCell>
            <TableCell align='left' className={'address'}>
                <p style={{ fontSize: 12 }}> {start_street} {start_city}</p>
                <p>
                    {row.start_at && <b>{start_at}</b>}
                    {row.status === 'en_route' && <span className='accepted'>({arrival_time.format('h:mm A')})</span>}
                </p>
            </TableCell>
            <TableCell align='right' className={'eta'}>
                {ride_eta}
                {ride_eta_late}
            </TableCell>
            <TableCell align='right' className={'status'}>
                <div className={classes.status_icon}>
                    {row.wav === 1 && <Icon className='wav'>accessible</Icon>}
                    {row.status === 'pending' && <Icon className='pending' style={{
                        animation: (row.available_for_workers === true || row.available_for_workers === 1) ? 'pulse 3s infinite' : null,
                        borderRadius: '50%'
                    }}>track_changes</Icon>}
                    {row.status === 'assigned' && <Icon className='assigned'>turned_in</Icon>}
                    {row.status === 'en_route' && <Icon className='accepted'>moving</Icon>}
                    {row.status === 'on_location' && <Icon className='arriving'>share_location</Icon>}
                    {row.status === 'secured' && <Icon className='dropoff'>security</Icon>}
                    {row.status === 'crew_arrived' && <Icon className='dropoff'>security</Icon>}
                    {row.status === 'cannot_secure' && <Icon className='driver-canceled'>gpp_bad</Icon>}
                    {row.status === 'review' && <Icon className='pending'>remove_red_eye</Icon>}
                    {row.status === 'finished' && <Icon className='finished'>check_circle</Icon>}
                    {row.status === 'review_finished' && <Icon className='finished'>assignment_turned_in</Icon>}
                    {row.status === 'cancelled' && <Icon className='user-canceled'>not_interested</Icon>}
                    {row.status === 'company_canceled' && <Icon className='company-canceled'>not_interested</Icon>}
                </div>
            </TableCell>
        </TableRow>         
    );
};


export default React.memo(Ride);
