import * as React from 'react';
import { withFormik, FormikProps } from 'formik';
import './login.scss';
import { ActivateValidation } from './ActivateValidation';
import authStore from '../../Stores/authStore';
import images1 from '../../Assets/login/loginimage1.jpg';
import CircularProgress from '@material-ui/core/CircularProgress';
import { actions } from '../../Services';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import history from '../../history';

class ActivateAccountComponent extends React.Component<FormikProps<any>> {

   constructor(props){
        super(props);
      }
  
  onSubmit = (event) => {
    event.preventDefault();
    this.props.handleSubmit(event);
  };
  public render() {

    const { errors, touched, handleChange, handleBlur } = this.props;

    return (
      <div className="d-flex container-auth  layout">
        <div className="background-rectangle">
          <img src={images1} alt="" />
        </div>
        <form
          className="form-login d-flex align-items-center row-mobile justify-content-center "
          onSubmit={this.onSubmit}
        >
          <div className="icon" />
          <div className="login-container">
            <div className="form-login-header">
              <p className="text-roboto-28">Your Account has been activated, please set you PW below</p>
            </div>
            <div className="form-login-body">
              <div className="form-group">
                <label className="d-block mtop-5">Password</label>
                <input
                  type="password"
                  className="input-login"
                  name="password"
                  placeholder="Type your password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.password && touched.password && (
                  <p className="error">{errors.password}</p>
                )}
              </div>
              <div className="form-group">
                <label className="d-block">Repeat Password</label>
                <input
                  placeholder="Type your password"
                  className="input-login"
                  type="password"
                  name="repeatPassword"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.repeatPassword && touched.repeatPassword && (
                  <p className="error">{errors.repeatPassword}</p>
                )}
              </div>
              <div className="sign-in-btn">
                <button type="submit" className="btn w-100 py-2">
                  {authStore.processing ? (
                    <CircularProgress size={30} style={{ color: '#fff' }} />
                  ) : (
                    <div className="p">
                      Activate
                      <div className="arrow" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}


function mapDispatchToProps(dispatch) {
    return {
      dispatch,
      activateAccount: (token, password) => dispatch(actions.AppActions.activateAccount(token, password)), 
    };
  }

export default connect(
    null,
    mapDispatchToProps
  )( withFormik({
        mapPropsToValues: () => ({
            password: '',
            repeatPassword: '',
        }),
        validationSchema: ActivateValidation,
        handleSubmit: async (values : any, { props } : any) => {
            //console.log(new URLSearchParams(props.location.search).get("token"))
            await props.activateAccount(new URLSearchParams(props.location.search).get("token"), values.password )
            .then(res => {
                toast.success('Account activated!', {
                  position: 'top-right',
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
                history.push('/login');
            })
            .catch(error => {
                toast.error(error.error, {
                  position: 'top-right',
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              });
        },
    })(ActivateAccountComponent));
