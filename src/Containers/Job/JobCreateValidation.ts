import * as Yup from 'yup';

const location = Yup.object().shape({
  address: Yup.string().required().label('Locations'),
  // lat: Yup.number().required(),
  // lng: Yup.number().required(),
});

const locationStructure = Yup.object().shape({
  address: Yup.string().required().label('Locations'),
  structure: Yup.string().required().label('Structures'),
});

const job = Yup.object().shape({
  jobType: Yup.number().required().label('Job type'),
  requestTime: Yup.date().required().label('Request Date'),
  requestor: Yup.object().required().label('Requester'),
  supervisor: Yup.object().required().label('Supervisor'),
  department: Yup.object().required().label('Department'),
  section: Yup.string().required().label('Section'),
  municipality: Yup.object().required().label('Municipality'),
  account: Yup.number().notRequired().label('Account'),
  maxWorkers: Yup.number().required().label('Max Workers'),
  locations: Yup.array().when('jobType', {
    is: (val) => val === 2,
    then: Yup.array().of(locationStructure),
    otherwise: Yup.array().of(location),
  }),
});

export const JobCreateValidation = Yup.object().shape({
  title: Yup.string().notRequired().label('Title'),
  jobs: Yup.array().of(job),
});

export const JobEditValidation = Yup.object().shape({
  jobType: Yup.number().required().label('Job type'),
  requestTime: Yup.date().required().label('Request Date'),
  requestor: Yup.object().required().label('Requester'),
  department: Yup.object().required().label('Department'),
  section: Yup.string().required().label('Section'),
  municipality: Yup.object().required().label('Municipality'),
  account: Yup.number().notRequired().label('Account'),
  locations: Yup.array().when('jobType', {
    is: (val) => val === 2,
    then: Yup.array().of(locationStructure),
    otherwise: Yup.array().of(location),
  }),
});

export const CreateApointerJobValudation = Yup.object().shape({
  job: Yup.object().required().label('Job'),
  startDate: Yup.date().required().label('Start Date'),
  location: Yup.object()
    .shape({
      address: Yup.string().notRequired(),
      lat: Yup.number().notRequired(),
      lng: Yup.number().notRequired(),
    })
    .label('Locations')
    .required(),
});
