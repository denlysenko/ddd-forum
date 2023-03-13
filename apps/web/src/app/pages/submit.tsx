import React from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { bindActionCreators } from 'redux';
import PostSubmission from '../modules/forum/components/comments/components/PostSubmission';
import type { PostType } from '../modules/forum/models/Post';
import * as forumOperators from '../modules/forum/redux/operators';
import type { ForumState } from '../modules/forum/redux/states';
import { PostUtil } from '../modules/forum/utils/PostUtil';
import { ProfileButton } from '../modules/users/components/profileButton';
import withLogoutHandling from '../modules/users/hocs/withLogoutHandling';
import type { User } from '../modules/users/models/user';
import * as usersOperators from '../modules/users/redux/operators';
import type { UsersState } from '../modules/users/redux/states';
import Header from '../shared/components/header/components/Header';
import { FullPageLoader } from '../shared/components/loader';
import { Layout } from '../shared/layout';
import { TextUtil } from '../shared/utils/TextUtil';

interface SubmitPageProps
  extends usersOperators.IUserOperators,
    forumOperators.IForumOperations {
  users: UsersState;
  forum: ForumState;
  history: any;
}

interface SubmitPageState {
  title: string;
  text: string;
  link: string;
  postType: PostType;
}

class SubmitPage extends React.Component<SubmitPageProps, SubmitPageState> {
  constructor(props: SubmitPageProps) {
    super(props);

    this.state = {
      title: '',
      text: '',
      link: '',
      postType: 'text',
    };
  }

  updateFormField(fieldName: string, value: string) {
    this.setState({
      ...this.state,
      [fieldName]: value,
    });
  }

  onPostTypeChanged(t: PostType) {
    this.setState({
      ...this.state,
      postType: t,
    });
  }

  isFormValid(): boolean {
    const { title, text, link, postType } = this.state;

    const titlePresent = !!title === true;
    const textPresent = !!text === true;
    const linkPresent = !!link === true;

    if (
      !titlePresent ||
      TextUtil.atLeast(title, PostUtil.minTitleLength) ||
      TextUtil.atMost(title, PostUtil.maxTitleLength)
    ) {
      toast.error(
        `Yeahhhhh, title should be ${PostUtil.minTitleLength} to ${PostUtil.maxTitleLength} characters. Yours was ${title.length}. 🤠`,
        {
          autoClose: 3000,
        }
      );
      return false;
    }

    if (postType === 'text') {
      if (
        !textPresent ||
        TextUtil.atLeast(text, PostUtil.minTextLength) ||
        TextUtil.atMost(text, PostUtil.maxTextLength)
      ) {
        toast.error(
          `Yeahhhhh, text posts should be ${PostUtil.minTextLength} to ${PostUtil.maxTextLength} characters. Yours was ${text.length}. 🤠`,
          {
            autoClose: 3000,
          }
        );
        return false;
      }
    } else {
      if (
        !linkPresent ||
        TextUtil.atLeast(link, PostUtil.minLinkLength) ||
        TextUtil.atMost(link, PostUtil.maxLinkLength)
      ) {
        toast.error(
          `Yeahhhhh, link posts should be ${PostUtil.minLinkLength} to ${PostUtil.maxLinkLength} characters. Yours was ${text.length}. 🤠`,
          {
            autoClose: 3000,
          }
        );
        return false;
      }
    }
    return true;
  }

  onSubmit() {
    if (this.isFormValid()) {
      const { title, postType, text, link } = this.state;
      this.props.submitPost(title, postType, text, link);
    }
  }

  afterSuccessfulPost(prevProps: SubmitPageProps) {
    const currentProps: SubmitPageProps = this.props;
    if (
      currentProps.forum.isSubmittingPostSuccess ===
      !prevProps.forum.isSubmittingPostSuccess
    ) {
      toast.success(`Done-zo! 🤠`, {
        autoClose: 2000,
      });
      setTimeout(() => {
        this.props.history.push('/?show=new');
      }, 2000);
    }
  }

  afterFailedPost(prevProps: SubmitPageProps) {
    const currentProps: SubmitPageProps = this.props;
    if (
      currentProps.forum.isSubmittingPostFailure ===
      !prevProps.forum.isSubmittingPostFailure
    ) {
      const error: string = currentProps.users.error;
      return toast.error(`Yeahhhhh, ${error} 🤠`, {
        autoClose: 3000,
      });
    }
  }

  componentDidUpdate(prevProps: SubmitPageProps) {
    this.afterSuccessfulPost(prevProps);
    this.afterFailedPost(prevProps);
  }

  render() {
    return (
      <Layout>
        <div className="header-container flex flex-row flex-center flex-even">
          <Header title="New submission" subtitle="" />
          <ProfileButton
            isLoggedIn={this.props.users.isAuthenticated}
            username={
              this.props.users.isAuthenticated
                ? (this.props.users.user as User).username
                : ''
            }
            onLogout={() => this.props.logout()}
          />
        </div>
        <br />
        <br />
        <PostSubmission
          updateFormField={(f: string, val: string) =>
            this.updateFormField(f, val)
          }
          onPostTypeChanged={(type: PostType) => this.onPostTypeChanged(type)}
          postType={this.state.postType}
          textValue={this.state.text}
          titleValue={this.state.title}
          linkValue={this.state.link}
          onSubmit={() => this.onSubmit()}
        />

        {this.props.forum.isSubmittingPost ? <FullPageLoader /> : ''}
      </Layout>
    );
  }
}

function mapStateToProps({
  users,
  forum,
}: {
  users: UsersState;
  forum: ForumState;
}) {
  return {
    users,
    forum,
  };
}

function mapActionCreatorsToProps(dispatch: any) {
  return bindActionCreators(
    {
      ...usersOperators,
      ...forumOperators,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapActionCreatorsToProps
)(withLogoutHandling(SubmitPage));
