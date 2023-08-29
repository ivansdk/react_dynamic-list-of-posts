import React, { useEffect, useState } from 'react';
import 'bulma/bulma.sass';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';

import classNames from 'classnames';
import { PostsList } from './components/PostsList';
import { PostDetails } from './components/PostDetails';
import { UserSelector } from './components/UserSelector';
import { Loader } from './components/Loader';
import { Post } from './types/Post';
import { User } from './types/User';
import { client } from './utils/fetchClient';

export const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [loader, setLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  useEffect(() => {
    client.get<User[]>('/users')
      .then((response) => response.slice(0, 100))
      .then(setUsers);
  }, []);

  useEffect(() => {
    setCurrentPost(null);
    setErrorMessage(false);
    if (currentUser) {
      setLoader(true);
      client.get<Post[]>(`/posts?userId=${currentUser.id}`)
        .then(setUserPosts)
        .catch(() => {
          setErrorMessage(true);
        })
        .finally(() => {
          setLoader(false);
        });
    }
  }, [currentUser]);

  return (
    <main className="section">
      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                <UserSelector
                  users={users}
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                />
              </div>

              <div className="block" data-cy="MainContent">
                {!currentUser && (
                  <p data-cy="NoSelectedUser">No user selected</p>
                )}
                {loader && <Loader />}

                {errorMessage && (
                  <div
                    className="notification is-danger"
                    data-cy="PostsLoadingError"
                  >
                    Something went wrong!
                  </div>
                )}

                {!loader && currentUser && !userPosts.length && (
                  <div className="notification is-warning" data-cy="NoPostsYet">
                    No posts yet
                  </div>
                )}

                {!loader && currentUser && userPosts.length > 0 && (
                  <PostsList
                    posts={userPosts}
                    currentPost={currentPost}
                    setCurrentPost={setCurrentPost}
                  />
                )}
              </div>
            </div>
          </div>

          <div
            data-cy="Sidebar"
            className={classNames(
              'tile',
              'is-parent',
              'is-8-desktop',
              'Sidebar',
              {
                'Sidebar--open': currentPost !== null,
              },
            )}
          >
            <div className="tile is-child box is-success ">
              <PostDetails
                currentUser={currentUser}
                currentPost={currentPost}
              />
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};
