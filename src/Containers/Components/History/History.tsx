import React from 'react';
import * as CeIcon from '../../../Utils/Icon';
import moment from 'moment';
import { JOB_STATUSES } from '../../../Constants/job';
import { DEPARTMENTS } from '../../../Constants/user';
import UserSmallComponent from '../UserSmallComponent/UserSmallComponent';
import { WORKER_STATUS_HISTORY } from '../../../Constants/worker';
import { jobAPI } from '../../../Services/API';

interface Props {
  changesLog: Array<Object>;
}

export class History extends React.Component<any> {
  transformValue = (key, value) => {
    if (key.includes('workerStatus:')) {
      key = 'workerStatus';
    }

    try {
      value = JSON.parse(value);
    } catch (error) {}

    let render: any = null;
    switch (key) {
      case 'requestTime':
        render = moment(value).format('MM/DD/YY HH:mm');
        break;
      case 'locations':
        render = Array.isArray(value)
          ? value.map((item) => item.address).join(', ')
          : null;
        break;
      case 'municipality':
        render = value ? value.label : null;
        break;
      case 'jobStatus':
        render = JOB_STATUSES[value];
        break;
      case 'department':
        const department = DEPARTMENTS.find((dep) => {
          return dep.id === value;
        });
        render = department ? department.name : '';
        break;
      case 'workers':
        render = Array.isArray(value)
          ? value
              .map((item) =>
                item.worker
                  ? `${item.worker.firstName} ${item.worker.lastName}`
                  : ''
              )
              .join(', ')
          : null;
        break;
      case 'workerStatus':
        render = WORKER_STATUS_HISTORY[value]
          ? WORKER_STATUS_HISTORY[value]
          : '-';
        break;
      case 'requestor':
      case 'supervisor':
        // case 'requestor':
        render = <UserSmallComponent id={value} />;
        break;

      default:
        render = value || '';
        break;
    }

    return render || '-';
  };

  public render() {
    return (
      <div
        className="box-item-body"
        style={{
          overflowY: 'scroll',
          maxHeight: this.props.total_height - 170,
        }}
      >
        <div className="actions-save-file">
        {this.props.canDownload && 
          <span
            onClick={this.props.downloadHistoryPdf}
            className="btn-save-file d-flex align-items-center hover-line"
          >
            <CeIcon.DownloadIcon className="mr-2" />
            <span>Save to PDF</span>
          </span>
        }
        </div>
        <div className="job-history-page">
          {this.props.changesLog.length === 0 &&
           <div style={{textAlign: 'center', fontWeight: 600, fontSize: 14}}>No Timesheet History</div>}
          {this.props.changesLog.map((log, index) => (
            <div
              key={index}
              className="job-history-item pb-3"
              style={{
                borderBottom: '1px solid #dbdede',
                marginBottom: 20,
              }}
            >
              <div className="timeline">
                <div className="date">
                  {moment(log.updatedAt).format('MM/DD/YY')}
                  <br />
                  {moment(log.updatedAt).format('HH:mm:ss')}
                </div>
                <div className="circle">
                  <div className="point"></div>
                </div>
              </div>
              <div className="job-history-item-content">
                <div className="mb-4">
                  <span className="mr-3">
                    <span className="text-bold">Source</span>:{' '}
                    {log.source ? log.source : 'Web'}
                  </span>
                  <br className="d-block d-md-none" />
                  <span className="text-bold">Change Made By</span>:{' '}
                  {log.updaterName ? log.updaterName : ''}
                </div>
                <div>
                  {log.fields && log.fields.length > 0 && (
                    <table className="table table-history mb-0">
                      <thead>
                        <tr>
                          <th></th>
                          <th>Old Value</th>
                          <th>New Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {log.fields && log.fields.length > 0 && 
                          log.fields.map((field) => (
                            field.fieldName !== 'sign' &&
                            <tr>
                              <td>{field.fieldName}</td>
                              <td>
                                {this.transformValue(
                                  field.fieldName,
                                  field.oldValue
                                )}
                              </td>
                              <td>
                                {this.transformValue(
                                  field.fieldName,
                                  field.newValue
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  )}
                  {log.body && <td>{log.body}</td>}
                </div>
              </div>
              <div className="job-history-line-timeline"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
export default History;
