import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { jobAPI } from '../../../Services/API';


interface Props {
  onSelect?: (item: any) => void;
  searchParams?: any;
  defaultValue?: any;
}

export default function Asynchronous({onSelect, searchParams, defaultValue}: Props) {
  const [open, setOpen] = React.useState(false);
  const [numbers, setNumbers] = React.useState<any[]>([]);
  const loading = open && numbers.length === 0;

  React.useEffect(() => {
    if (!loading) {
      return undefined;
    }

    (async (value = '') => {
      let search = {}; 
      if(searchParams) {
        search = searchParams;
      }
      const response: any = await jobAPI.loadConfNumbers({
        ...search,
        confirmNumber: value,
      });
      
      if (response.data) {
        let numbers = response.data.jobs.map(job => ({
            label: job.confirmNumber,
            value: job,
        }));

        setNumbers(numbers);
      }
    })();
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
        setNumbers([]);
    }
  }, [open]);

  return (
    <Autocomplete
      multiple
      limitTags={1}
      size="small"
      id="asynchronous-demo"
      style={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option, value) => option.value.id === value.value.id}
      getOptionLabel={(option) => option.label}
      options={numbers}
      loading={loading}
      defaultValue={defaultValue ? defaultValue : []}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Confirmation Number"
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