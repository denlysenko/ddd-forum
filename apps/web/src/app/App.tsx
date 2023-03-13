import type React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.module.scss';
import IndexPage from './pages';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      {/* <Route path="/discuss/:slug">
        <DiscussionPage />
      </Route>
      <Route path="/comment/:commentId">
        <CommentPage />
      </Route>
      <Route path="/member/:username">
        <MemberPage />
      </Route>
      <AuthenticatedRoute
        path="/submit"
        component={SubmitPage}
      ></AuthenticatedRoute> */}
      {/* <Route path="/join">
        <JoinPage />
      </Route>
      <Route path="/login" element={<LoginPage />} /> */}
    </Routes>
  );
};

export default App;
