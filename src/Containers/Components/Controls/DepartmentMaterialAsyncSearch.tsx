import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { userAPI } from '../../../Services/API';
import authStore from '../../../Stores/authStore';
//import './MaterialAsync.scss';

interface Props {
  onSelect?: (item: any) => void;
  width?: any;
  defaultValue?: any;
  limitTags?: any;
  noLabel?: boolean;
}

export default function Asynchronous({onSelect, width, defaultValue, limitTags, noLabel}: Props) {
  const [open, setOpen] = React.useState(false);
  const [departments, setDepartments] = React.useState<any[]>([]);
  const loading = open && departments.length === 0;

  React.useEffect(() => {
    if (!loading) {
      return undefined;
    }

    (async () => {
      const response: any = await userAPI.departments();
      
      if (response.data) {
        let departments = response.data.map(department => ({
            label: department.name,
            value: department,
        }));

        setDepartments(departments);
      }
    })();
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
        setDepartments([]);
    }
  }, [open]);

  return (
    <Autocomplete
      multiple
      limitTags={limitTags ? limitTags : 1}
      size="small"
      defaultValue={defaultValue ? defaultValue : []}
      id="asynchronous-demo"
      style={{ width: width ? width : 300, minWidth: 150 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option, value) => option.value.id === value.value.id}
      getOptionLabel={(option) => option.label}
      options={departments}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={noLabel ? "" : "Departments"}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
      onChange={(event, value) => onSelect(value)}
    />
  );
}