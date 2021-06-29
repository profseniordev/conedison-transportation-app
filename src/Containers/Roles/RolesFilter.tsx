import React from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import ListItemText from '@material-ui/core/ListItemText';
import CircleCheckedFilled from '@material-ui/icons/CheckCircle';
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import Checkbox from '@material-ui/core/Checkbox';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CETSearchRadiusInput from '../Components/Controls/SearchRadiusInput.Component';
import RolesMaterialAsyncSearch from '../Components/Controls/RolesMaterialAsyncSearch';
import './Roles.scss';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      minWidth: '100%',
      '& .MuiOutlinedInput-input': {
        padding: '12px 20px !important',
        color: '#808080',
      },
      '& .MuiAutocomplete-inputRoot': {
        paddingTop: 0,
        paddingBottom: 0,
      },
      '& .MuiAutocomplete-root': {
        width: '100% !important',
      },
      '& .MuiInputLabel-outlined': {
        transform: 'translate(14px, 14px)',
        fontSize: 14,
        backgroundColor: '#FFFFFF',
      },
      '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
        transform: 'translate(14px, -6px) scale(0.75)',
      },
      '& .MuiAutocomplete-input': {
        width: '0px !important'
      }
    },
  })
);

const USER_STATUS = [
  {
    label: 'Approved',
    value: 'active',
  },
  {
    label: 'Rejected',
    value:  'rejected',
  },
  {
    label: 'Waiting Approval',
    value: 'waiting_for_approval',
  },
];

const RolesFilter = ({
  handleChangeSearchParams,
  handleRoleChange,
  onlyDispatcher,
}) => {
  const classes = useStyles();

  const [selectedStatuses, setUserStatus] = React.useState([]);

  const handleChangeStatus = (event) => {
    setUserStatus(event.target.value);
    handleChangeSearchParams(event);
  };

  const getSelectedUserStatusNames = (items) => {
    let selectedBillingStatusNames = [];
    if (items.length > 0) {
      USER_STATUS.forEach((status) => {
        if (items.indexOf(status.value) > -1) {
          selectedBillingStatusNames.push(status.label);
        }
      });
    }
    return selectedBillingStatusNames;
  };

  return (
    <div style={styles.filtersStyles}>
      <div>
        <CETSearchRadiusInput
          name="searchUsers"
          placeholder="Search by name or email"
          onChange={handleChangeSearchParams}
        />
      </div>
      <div>
        <FormControl className={classes.formControl}>
            <RolesMaterialAsyncSearch
              onSelectRole={handleRoleChange}
              onlyDispatcher={onlyDispatcher}
            />
          </FormControl>
      </div>
      <div>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel>Status</InputLabel>
          <Select
           MenuProps={{
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left"
            },
            getContentAnchorEl: null
          }}
            labelId="simple-select-outlined-label"
            id="simple-select-outlined"
            name="statuses"
            onChange={handleChangeStatus}
            value={selectedStatuses}
            multiple
            renderValue={(selected) =>
              getSelectedUserStatusNames(selected).join(', ')
            }
          >
            {USER_STATUS.map((status, index) => (
              <MenuItem key={index} value={status.value}>
                <Checkbox
                  icon={<CircleUnchecked />}
                  checkedIcon={<CircleCheckedFilled color='primary'/>}
                  checked={selectedStatuses.indexOf(status.value) > -1}
                />
                <ListItemText primary={status.label} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

const styles = {
  filtersStyles: {
    backgroundColor: '#fff',
    borderRadius: '1rem',
    display: 'grid',
    gridTemplateColumns: '1fr 1.5fr 1fr',
    alignItems: 'end',
    gridGap: 20,
  },
  disabledFilterBtn: {
    background: '#BDBDBD',
    color: '#fff',
  },
};

export default RolesFilter;
