import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { FormControlLabel } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import CircleCheckedFilled from '@material-ui/icons/CheckCircle';
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import { connect } from 'react-redux';

const ZonesPopup = ({ search_options, update, zones, onClose }) => {
  return (
    <>
      {zones.map((region) => {
        return region.zones.map((zone) => (
          <MenuItem
            key={3 + zone.id}
            value={zone.id}
            style={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  name="zones"
                  checked={search_options.zones.indexOf(zone.id) !== -1}
                  value={zone.id}
                  onChange={update}
                  icon={<CircleUnchecked />}
                  checkedIcon={<CircleCheckedFilled />}
                  color="primary"
                />
              }
              label={
                <span
                  style={{
                    display: 'flex',
                    flex: 1,
                    justifyContent: 'space-between',
                  }}
                >
                  {zone.name}
                  <span>
                    {zone.today_jobs_count > 0 ? (
                      <span
                        style={{
                          border: '3px solid #4caf50', // 3px solid #4caf50  rgb(198 229 199)
                          backgroundColor: '#4caf50',
                          color: '#FFFFFF',
                          borderRadius: 20,
                          marginLeft: 5,
                          padding: 1,
                        }}
                      >
                        {zone.today_jobs_count}
                      </span>
                    ) : (
                      ''
                    )}
                    {zone.today_late_jobs_count > 0 ? (
                      <span
                        style={{
                          border: '3px solid red', // 3px solid #4caf50  rgb(198 229 199)
                          backgroundColor: 'red',
                          color: '#FFFFFF',
                          borderRadius: 20,
                          marginLeft: 5,
                          padding: 1,
                        }}
                      >
                        {zone.today_late_jobs_count}
                      </span>
                    ) : (
                      ''
                    )}
                    {zone.tomorrow_jobs_count > 0 ? (
                      <span
                        style={{
                          border: '3px solid #ffb300',
                          backgroundColor: '#ffb300',
                          color: '#FFFFFF',
                          borderRadius: 20,
                          marginLeft: 5,
                          padding: 1,
                        }}
                      >
                        {zone.tomorrow_jobs_count}
                      </span>
                    ) : (
                      ''
                    )}
                    {zone.tomorrow_unconfirmed_workers_count > 0 ? (
                      <span
                        style={{
                          border: '3px solid #536dfe',
                          backgroundColor: '#536dfe',
                          color: 'rgb(255 255 255)',
                          borderRadius: 20,
                          marginLeft: 5,
                          padding: 1,
                        }}
                      >
                        {zone.tomorrow_unconfirmed_workers_count}
                      </span>
                    ) : (
                      ''
                    )}
                    {zone.total_unconfirmed_jobs > 0 ? (
                      <span
                        style={{
                          border: '3px solid rgb(255 46 249)',
                          backgroundColor: 'rgb(255 46 249)',
                          color: 'rgb(255 255 255)',
                          borderRadius: 20,
                          marginLeft: 5,
                          padding: 1,
                        }}
                      >
                        {zone.total_unconfirmed_jobs}
                      </span>
                    ) : (
                      ''
                    )}
                    {zone.today_unconfirmed_asap_shifts > 0 ? (
                      <span
                        style={{
                          border: '3px solid rgb(142 68 255)',
                          backgroundColor: 'rgb(142 68 255)',
                          color: 'rgb(255 255 255)',
                          borderRadius: 20,
                          marginLeft: 5,
                          padding: 1,
                        }}
                      >
                        {zone.today_unconfirmed_asap_shifts}
                      </span>
                    ) : (
                      ''
                    )}
                  </span>
                </span>
              }
              labelPlacement="start"
            ></FormControlLabel>
          </MenuItem>
        ));
      })}
      <div className="reset" onClick={(_) => onClose()}>
        Close
      </div>
    </>
  );
};
function mapStateToProps(state) {
  return {
    search_options: state.jobs.locations_search_options,
  };
}
export default connect(mapStateToProps, null)(ZonesPopup);
