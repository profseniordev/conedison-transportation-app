import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import MenuCE from '../../../src/Containers/Menus/MenuCE';

const mockStore = configureMockStore();
const store = mockStore({
  app: {
    user: {
      roles: [1],
    },
  },
  notifications: {
    notifications: [],
  },
});

const MockLink = ({ id, className, to, children }) => {
  return (
    <a className={className} id={id} href={to}>
      {children}
    </a>
  );
};

jest.mock('react-router-dom', () => ({
  __esModule: true,
  useLocation: jest.fn().mockReturnValue({
    pathname: '/job',
    search: '',
    hash: '',
    state: null,
    key: '5nvxpbdafa',
  }),
  NavLink: (props) => <MockLink {...props} />,
}));

it('renders correctly', () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <MenuCE />
      </Provider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
