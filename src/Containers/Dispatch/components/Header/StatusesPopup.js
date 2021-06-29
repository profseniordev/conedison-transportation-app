import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import {FormControlLabel} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import CircleCheckedFilled from '@material-ui/icons/CheckCircle';
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import {connect} from "react-redux";

const StatusesPopup = (props) => {


  return (
    <React.Fragment>
      <MenuItem>
        <FormControlLabel
          input
          control={<Checkbox
            name='job_statuses'
            value={'All Status'}
            checked={props.search_options.job_statuses.length === 0}
            onChange={_ => props.updateFilters({job_statuses: ''})}
            icon={<CircleUnchecked />}
            checkedIcon={<CircleCheckedFilled />}
            color='primary'
          />}
          label='All Status'
          labelPlacement="start"
        />
      </MenuItem>
      <hr style={{margin: '0'}}/>
      {props.statuses.map(item => {
        return (
          <MenuItem key={item.value} style={{heght: '20px'}}>
            {console.log(props.search_options.job_statuses)}
            <FormControlLabel
              control={<Checkbox
                name='job_statuses'
                checked={props.search_options.job_statuses.includes(`,${item.value},`)}
                value={item.value}
                onChange={props.updateJobStatus}
                icon={<CircleUnchecked />}
                checkedIcon={<CircleCheckedFilled />}
                color='primary'
              />}
              label={item.label}
              labelPlacement="start"
            />
          </MenuItem>
        )
      })}

      <div className='reset' onClick={_=>props.onClose()}>Close</div>
    </React.Fragment>
  );
};
function mapStateToProps(state)
{
  return {
    search_options  : state.jobs.locations_search_options,
  }
}
export default connect(mapStateToProps, null)(StatusesPopup);
