import React from 'react';
import BillingInfoRow from "./BillingInfoRow";


const billingTable = ({jobs ,checked , onCheckboxChange}) => {
  return (
    <div>
      {jobs && jobs.map((job, index) => {
        return (<BillingInfoRow  job={job}
                                 key={index}
                                 checked={checked}
                                 onCheckboxChange={onCheckboxChange} />);
      })}
    </div>
  );
};

export default billingTable;
