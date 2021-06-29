import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import {FormControlLabel} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import CircleCheckedFilled from '@material-ui/icons/CheckCircle';
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import {connect} from "react-redux";

const TypesPopup = (props) => {


  return (
    <React.Fragment>
      <MenuItem>
        <FormControlLabel
          inpu
          control={<Checkbox
            name='job_types'
            value={'All Type'}
            checked={props.search_options.job_types.length === 0}
            onChange={_ => props.updateFilters({job_types: ''})}
            icon={<CircleUnchecked />}
            checkedIcon={<CircleCheckedFilled />}
            color='primary'
          />}
          label='All Type'
          labelPlacement="start"
        />
      </MenuItem>
      <hr style={{margin: '0'}}/>
      {props.types.map((item, index) => {
        return (
          <MenuItem key={index} style={{heght: '20px'}}>
            <FormControlLabel
              control={<Checkbox
                name='job_types'
                checked={props.search_options.job_types.indexOf(item.value) !== -1}
                value={item.value}
                onChange={props.updateJobTypes}
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

      <div className='reset' onClick={_ => props.onClose()}>Close</div>
    </React.Fragment>
  );
};
function mapStateToProps(state)
{
  return {
    search_options  : state.jobs.locations_search_options,
  }
}
export default connect(mapStateToProps, null)(TypesPopup);
