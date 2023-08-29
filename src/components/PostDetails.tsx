import React, { useState, useEffect } from 'react';
import { Loader } from './Loader';
import { NewCommentForm } from './NewCommentForm';
import { Post } from '../types/Post';
import { client } from '../utils/fetchClient';
import { Comment } from '../types/Comment';
import { User } from '../types/User';

type Props = {
  currentUser: User | null;
  currentPost: Post | null;
};

export const PostDetails: React.FC<Props> = ({ currentUser, currentPost }) => {
  const [postComments, setPostComments] = useState<Comment[]>([]);
  const [loader, setLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [visibleForm, setVisibleForm] = useState(false);

  useEffect(() => {
    if (currentPost) {
      setVisibleForm(false);
      setErrorMessage(false);
      setLoader(true);
      client
        .get<Comment[]>(`/comments?postId=${currentPost?.id}`)
        .then(setPostComments)
        .catch(() => {
          setErrorMessage(true);
        })
        .finally(() => {
          setLoader(false);
        });
    }
  }, [currentUser, currentPost]);

  const handleDeleteComment = (commentId: number) => {
    client.delete(`/comments/${commentId}`);
    setPostComments(currentComments => currentComments
      .filter(currComment => currComment.id !== commentId));
  };

  return (
    <div className="content" data-cy="PostDetails">
      <div className="content" data-cy="PostDetails">
        <div className="block">
          <h2 data-cy="PostTitle">
            {`#${currentPost?.id}: ${currentPost?.title}`}
          </h2>

          <p data-cy="PostBody">{currentPost?.body}</p>
        </div>

        <div className="block">
          {loader && <Loader />}

          {errorMessage && (
            <div className="notification is-danger" data-cy="CommentsError">
              Something went wrong
            </div>
          )}

          {!loader && postComments.length === 0 && (
            <p className="title is-4" data-cy="NoCommentsMessage">
              No comments yet
            </p>
          )}

          {!loader && postComments.length > 0 && (
            <>
              <p className="title is-4">Comments:</p>

              {postComments.map((comment) => (
                <article
                  key={comment.id}
                  className="message is-small"
                  data-cy="Comment"
                >
                  <div className="message-header">
                    <a href={`mailto:${comment.email}`} data-cy="CommentAuthor">
                      {comment.name}
                    </a>
                    <button
                      data-cy="CommentDelete"
                      type="button"
                      className="delete is-small"
                      aria-label="delete"
                      onClick={() => {
                        handleDeleteComment(comment.id);
                      }}
                    >
                      delete button
                    </button>
                  </div>

                  <div className="message-body" data-cy="CommentBody">
                    {comment.body}
                  </div>
                </article>
              ))}
            </>
          )}

          {!loader && !visibleForm && (
            <button
              data-cy="WriteCommentButton"
              type="button"
              className="button is-link"
              onClick={() => {
                setVisibleForm(true);
              }}
            >
              Write a comment
            </button>
          )}
        </div>

        {visibleForm && (
          <NewCommentForm
            currentPost={currentPost}
            setPostComments={setPostComments}
          />
        )}
      </div>
    </div>
  );
};
