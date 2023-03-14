import type React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.module.scss';
import IndexPage from './pages';
import CommentPage from './pages/comment';
import DiscussionPage from './pages/discussion';
import JoinPage from './pages/join';
import LoginPage from './pages/login';
import MemberPage from './pages/member';
import SubmitPage from './pages/submit';
import AuthenticatedRoute from './shared/infra/router/AuthenticatedRoute';

const App: React.FC = () => {
  return (
    <Router>
      <Route path="/" exact component={IndexPage} />
      <Route path="/discuss/:slug" component={DiscussionPage} />
      <Route path="/comment/:commentId" component={CommentPage} />
      <Route path="/member/:username" component={MemberPage} />
      <AuthenticatedRoute path="/submit" component={SubmitPage} />
      <Route path="/join" component={JoinPage} />
      <Route path="/login" component={LoginPage} />
    </Router>
  );
};

export default App;
