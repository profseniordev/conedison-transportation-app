import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { subcontractorsAPI } from '../../../Services/API';

interface Props {
  onSelectSubcontractor?: (item: any) => void;
}

export default function Asynchronous({onSelectSubcontractor}: Props) {
  const [open, setOpen] = React.useState(false);
  const [subcontractors, setSubcontractors] = React.useState<any[]>([]);
  const loading = open && subcontractors.length === 0;

  React.useEffect(() => {
    if (!loading) {
      return undefined;
    }

    (async () => {
      const response: any = await subcontractorsAPI.loadSubcontractors({});
      
      if (response.data) {
        const subcontractors = response.data.results.filter(subcontractor => subcontractor.subcontractor != null).map(subcontractor => ({
          label: subcontractor.subcontractor.subcontractorName,
          value: subcontractor,
        }));

        setSubcontractors(subcontractors);
      }
    })();
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setSubcontractors([]);
    }
  }, [open]);

  return (
    <Autocomplete
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
      options={subcontractors}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Subcontractor"
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
      onChange={(event, value) => onSelectSubcontractor(value)}
    />
  );
}