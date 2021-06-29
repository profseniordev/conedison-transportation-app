/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircleCheckedFilled from '@material-ui/icons/CheckCircle';
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import Checkbox from '@material-ui/core/Checkbox';
import { EROLES } from '../../../Constants/user';
import authStore from '../../../Stores/authStore';
import { userAPI } from '../../../Services/API';

interface Props {
  onSelectRole?: (item: any) => void;
  onlyDispatcher?: boolean;
  defaultValue?: any;
  limitTags?: any;
  noLabel?: boolean;
  small?: boolean;
  disabledValue?: any;
}

export default function Asynchronous({ onSelectRole, onlyDispatcher, defaultValue, limitTags, noLabel, small, disabledValue }: Props) {
  const [open, setOpen] = React.useState(false);
  const [roles, setRoles] = React.useState<any[]>([]);
  const loading = open && roles.length === 0;

  React.useEffect(() => {
    if (!loading) {
      return undefined;
    }

    (async () => {
      const response: any = await userAPI.roles();

      if (response.data) {
        let roles = response.data.map((role) => ({
          label: role.name,
          value: role,
        }));

        if (onlyDispatcher) {
          const filterRoles = [EROLES.dispatcher, EROLES.dispatcher_supervisor];

          // If current user is dispatcher supervider include aslo workers
          //if (authStore.isDispatchSupervisor()) {
          //  filterRoles.push(EROLES.worker);
         // }

          roles = roles.filter((item) => filterRoles.includes(item.value.id));
          
        }
         // delete worker role
         roles = roles.filter((item) => item.value.id !== EROLES.worker);

        setRoles(roles);
      }
    })();
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setRoles([]);
    }
  }, [open]);

  return (
    <Autocomplete
      multiple
      size={small ? "small" : "medium"}
      limitTags={limitTags ? limitTags : 1}
      defaultValue={defaultValue ? defaultValue : []}
      id="asynchronous-demo"
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionDisabled={(option) => disabledValue && option.value.id === disabledValue.value.id}
      getOptionSelected={(option, value) => option.value.id === value.value.id}
      getOptionLabel={(option) => option.label}
      /*renderOption={(option, { selected }) => (
        <React.Fragment>
          <Checkbox
            icon={<CircleUnchecked/>}
            checkedIcon={<CircleCheckedFilled color='primary' />}
            checked={selected}
            style={{ marginRight: 8 }}
          />
          {option.label}
        </React.Fragment>
      )}*/
      options={roles}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={noLabel ? "" : "Select Roles"}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>{params.InputProps.endAdornment}</React.Fragment>
            ),
          }}
        />
      )}
      onChange={(event, value) => onSelectRole(value)}
    />
  );
}
