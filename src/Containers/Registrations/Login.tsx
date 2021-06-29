import * as React from 'react';
import { withFormik } from 'formik';
import { observer } from 'mobx-react';
import './login.scss';
import { LoginValidation } from './LoginValidation';
import authStore from '../../Stores/authStore';
import images1 from '../../Assets/login/loginimage1.jpg';
import images2 from '../../Assets/login/loginimage2.jpg';
import CircularProgress from '@material-ui/core/CircularProgress';

const images = [images1, images2];

@observer
export class LoginComponent extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      currentImageIndex: null,
    };
  }
  componentDidMount() {
    this.changeImage();
  }
  changeImage = () => {
    const randomNumber = Math.floor(Math.random() * 2);
    this.setState({ currentImageIndex: randomNumber });
  };
  onSubmit = (event) => {
    event.preventDefault();
    this.props.handleSubmit(event);
  };
  public render() {
    const { errors, touched, handleChange, handleBlur } = this.props;

    return (
      <div className="d-flex container-auth  layout">
        <div className="background-rectangle">
          <img src={images[this.state.currentImageIndex]} alt="" />
        </div>
        <form
          className="form-login d-flex align-items-center row-mobile justify-content-center "
          onSubmit={this.onSubmit}
        >
          <div className="icon" />
          <div className="login-container">
            <div className="form-login-header">
              <p className="text-roboto-28"> Let’s Sign You In</p>
            </div>
            <div className="form-login-body">
              <div className="form-group">
                <label className="d-block mtop-5">E-mail</label>
                <input
                  className="input-login"
                  name="email"
                  placeholder="Type your e-mail or phone number"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.email && touched.email && (
                  <p className="error">{errors.email}</p>
                )}
              </div>
              <div className="form-group">
                <label className="d-block">Password</label>
                <input
                  placeholder="Type your password"
                  className="input-login"
                  type="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.password && touched.password && (
                  <p className="error">{errors.password}</p>
                )}
              </div>
              <div className="forgot-password-block">
                <a className="text-link" href="/recovery">
                  Forgot Password
                </a>
              </div>
              <div className="sign-in-btn">
                <button type="submit" className="btn w-100 py-2">
                  {authStore.processing ? (
                    <CircularProgress size={30} style={{ color: '#fff' }} />
                  ) : (
                    <div className="p">
                      Sign In
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

export default withFormik({
  mapPropsToValues: () => ({
    email: '',
    password: '',
  }),
  validationSchema: LoginValidation,
  handleSubmit: (values, { props }) => {
    authStore.login(values);
  },
})(LoginComponent);
