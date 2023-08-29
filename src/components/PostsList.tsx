import React from 'react';
import { Post } from '../types/Post';

type Props = {
  posts: Post[];
  currentPost: Post | null;
  setCurrentPost(post: Post | null): void;
};

export const PostsList: React.FC<Props> = ({
  posts,
  currentPost,
  setCurrentPost,
}) => (
  <div data-cy="PostsList">
    <p className="title">Posts:</p>

    <table className="table is-fullwidth is-striped is-hoverable is-narrow">
      <thead>
        <tr className="has-background-link-light">
          <th>#</th>
          <th>Title</th>
          <th> </th>
        </tr>
      </thead>

      <tbody>

        {posts.map((post) => (
          <tr key={post.id} data-cy="Post">
            <td data-cy="PostId">{post.id}</td>

            <td data-cy="PostTitle">{post.title}</td>

            <td className="has-text-right is-vcentered">
              <button
                type="button"
                data-cy="PostButton"
                className={
                  currentPost?.id === post.id
                    ? 'button is-link'
                    : 'button is-link is-light'
                }
                onClick={() => {
                  if (currentPost && currentPost.id === post.id) {
                    setCurrentPost(null);
                  }

                  setCurrentPost(post);
                }}
              >
                {currentPost?.id === post.id ? 'Close' : 'Open'}
              </button>
            </td>
          </tr>
        ))}

      </tbody>
    </table>
  </div>
);
