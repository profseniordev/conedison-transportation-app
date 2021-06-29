import React, { Component } from 'react';
import { InputAdornment, TextField, IconButton } from '@material-ui/core';
import { connect } from 'react-redux';
import Send from '@material-ui/icons/Send';
import './job_notes.scss';
import moment from 'moment';
import { actions } from '../../../../Services';
import HistoryIcon from '@material-ui/icons/History';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import {FormControlLabel} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import CircleCheckedFilled from '@material-ui/icons/CheckCircle';
import CircleUnchecked from '@material-ui/icons/RadioButtonUnchecked';
import { checkIfStateReadsAreAllowed } from 'mobx/lib/internal';
import { threadId } from 'worker_threads';

class JobNotes extends Component<any> {
  state: any;

  constructor(props) {
    super(props);
    this.state = {
      note: '',
      focused: false,
      anchorElFilter: null,
      open: false,
      authors: [],
      checkedAuthors: [],
      note_events: [],
      activeBtn: false,
    };
  }

  componentDidMount() {
    this.setState({note_events: [...this.props.job.notes]});
    this.getAuthors();
  }

  componentDidUpdate(prevProps) {
    if(this.props.job.id !== prevProps.job.id)
    {
      this.setState({note_events: [...this.props.job.notes], checkedAuthors: [], activeBtn: false});
      this.getAuthors();
    }
  }

  enterFunction = (event) => {
    if (this.state.note !== '' && event.keyCode === 13 && this.state.focused) {
      this.props.updateJobStatus(this.props.job.id, {
        status: 'note',
        note: this.state.note,
      });
      // document.querySelector('#note').blur();
      this.setState({
        focused: false,
        note: '',
      });
      event.preventDefault();
    }
  };

  addNote = () => {
    if (this.state.note !== '') {
      this.props.updateJobStatus(this.props.job.id, {
        status: 'note',
        note: this.state.note,
      });
      // document.querySelector('#note').blur();
      this.setState({
        focused: false,
        note: '',
      });
    }
  };

  getAuthors = () => {
    let authors = this.props.job.notes.map(a=> {

      let author = {
        id: a.user_id,
        name: a.user_first_name + ' ' + a.user_last_name
      }
      return author;

    });

    authors = authors.filter((thing, index, self) =>
        index === self.findIndex((t) => (
            t.id === thing.id && t.id !== null
        ))
    )

    this.setState({authors: authors});
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleBlur = () => {
    this.setState({ focused: false });
  };

  showSearch = () => {
    this.setState({ focused: true });
    document.addEventListener('keydown', this.enterFunction, false);
  };

  handleClick = (event) => {
    this.setState({anchorElFilter: event.currentTarget, open: Boolean(event.currentTarget)});
  };

  handleClose = () => {
    this.setState({anchorElFilter: null, open: false});
  };

  checkAll = (event) => {
    console.log(event.currentTarget.checked);
    const checked = event.currentTarget.checked;
    if(checked){
      this.setState({checkedAuthors: this.state.authors.map(a => a.id)},
      this.applyFilters);}
    else{
      this.setState({checkedAuthors: []},
      this.applyFilters);
    }
  }

  handleCheck = (event) => {
    console.log(event.currentTarget.checked);
    const checked = event.currentTarget.checked;
    if(checked) {
      this.setState({checkedAuthors: [...this.state.checkedAuthors,parseInt(event.target.value) ]},
          this.applyFilters)
    }
    else {
      let aut = this.state.checkedAuthors;
      aut = aut.filter(a => a !== parseInt(event.target.value));
      this.setState({checkedAuthors: aut}, this.applyFilters)
    }
  }

  applyFilters = () => {
    let notes = this.props.job.notes;
    const authors = this.state.checkedAuthors;
    if(this.state.checkedAuthors.length > 0) {
      notes = notes.filter((n) => authors.includes(n.user_id));
      this.setState({activeBtn: true});
    } else {
      this.setState({activeBtn: false});
    }
    this.setState({note_events: notes});
  }

  render() {
    if (!this.props.has_access) {
      return null;
    }
    const job = this.props.job;
    if (!Array.isArray(job.notes)) {
      return null;
    }
    //let note_events = [...job.notes]; //.filter((event) => event.user_id !== null);
    const note_events = this.state.note_events;
    const note = this.state.note;
    const authors = this.state.authors;

    return (
        <div className="note-container">
          <div className="note-title">
            <div className='mt-9'>
              <HistoryIcon />
              Activity Log & Comments
            </div>
            <div>
              <div className={this.state.activeBtn ? 'note-filter active' : 'note-filter'} onClick={this.handleClick}>
                <div className='numbers'>{authors.length}</div>
                <AccountCircleOutlinedIcon style={{marginTop: '-9px'}} />
              </div>
              <Menu
                  id="fade-menu"
                  anchorEl={this.state.anchorElFilter}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  keepMounted
                  open={this.state.open}
                  onClose={this.handleClose}
                  TransitionComponent={Fade}
              >
                <MenuItem>
                  <FormControlLabel
                      control={<Checkbox
                          name='authors'
                          checked={this.state.checkedAuthors.length === authors.length}
                          value={''}
                          onChange={this.checkAll}
                          icon={<CircleUnchecked />}
                          checkedIcon={<CircleCheckedFilled />}
                          color='primary'
                      />}
                      label='All Authors'
                  />
                </MenuItem>
                <hr style={{margin: '0'}}/>
                {authors.map(item => {

                  return (
                      <MenuItem key={item.id}>
                        <FormControlLabel
                            control={<Checkbox
                                name='authors'
                                checked={this.state.checkedAuthors.indexOf(item.id) !== -1}
                                value={item.id}
                                onChange={this.handleCheck}
                                icon={<CircleUnchecked />}
                                checkedIcon={<CircleCheckedFilled />}
                                color='primary'
                            />}
                            label={item.name}
                        />
                      </MenuItem>
                  )
                })}
              </Menu>
            </div>
          </div>
          <div className="note-body flex flex-col items-center">
            <div className={'pickup_note'}>
              {note_events.length > 0 ? (
                  note_events.map((event) => {
                    return (
                        <div className="container" key={event.id}>
                          <div className={'date'}>
                            {moment(event.created_at).format('MM/DD h:mm A')}
                          </div>
                          <div className={'body'}>{event.body}</div>
                          <div className={'admin'}>{event.user_first_name}</div>
                        </div>
                    );
                  })
              ) : (
                  <div>No note</div>
              )}
            </div>
            <TextField
                fullWidth
                className={'textFieldNote'}
                variant="outlined"
                type={'text'}
                placeholder="Leave comment..."
                value={note}
                InputProps={{
                  onChange: this.handleChange,
                  onFocus: this.showSearch,
                  onBlur: this.handleBlur,
                  name: 'note',
                  id: 'note',
                  endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                            edge="end"
                            aria-label="Toggle password visibility"
                            onClick={this.addNote}
                        >
                          {<Send />}
                        </IconButton>
                      </InputAdornment>
                  ),
                }}
            />
          </div>
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    has_access: state.app.user
        ? ![1, 2, 3, 4].some((r) => state.app.user.roles.includes(r))
        : false,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    updateJobStatus: (job_id, data) =>
        dispatch(actions.JobsActions.updateJobStatus(job_id, data)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(JobNotes);
