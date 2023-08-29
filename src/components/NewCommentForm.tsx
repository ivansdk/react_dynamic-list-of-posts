import React, { useState } from "react";
import cn from "classnames";
import { client } from "../utils/fetchClient";
import { Post } from "../types/Post";
import { Comment } from "../types/Comment";

type Props = {
  currentPost: Post | null;
  setPostComments: React.Dispatch<React.SetStateAction<Comment[]>>;
};

export const NewCommentForm: React.FC<Props> = ({
  currentPost,
  setPostComments,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [hasNameError, setHasNameError] = useState(false);
  const [hasEmailError, setHasEmailError] = useState(false);
  const [hasBodyError, setHasBodyError] = useState(false);
  const [loader, setLoader] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setHasNameError(!name);
    setHasEmailError(!email);
    setHasBodyError(!body);

    if (!name || !email || !body) {
      return;
    }

    setLoader(true);

    if (currentPost === null) {
      return;
    }

    const newComment: Omit<Comment, "id"> = {
      postId: currentPost.id,
      name,
      email,
      body,
    };

    client
      .post<Comment>("/comments", newComment)
      .then((currentComment) => {
        setBody("");
        setPostComments((currentComments) => [
          ...currentComments,
          currentComment,
        ]);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const clear = () => {
    setName("");
    setEmail("");
    setBody("");
    setHasNameError(false);
    setHasEmailError(false);
    setHasBodyError(false);
  };

  return (
    <form data-cy="NewCommentForm" onSubmit={handleSubmit}>
      <div className="field" data-cy="NameField">
        <label className="label" htmlFor="comment-author-name">
          Author Name
        </label>

        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="name"
            id="comment-author-name"
            placeholder="Name Surname"
            className={cn("input", {
              "is-danger": hasNameError,
            })}
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setHasNameError(false);
            }}
          />

          <span className="icon is-small is-left">
            <i className="fas fa-user" />
          </span>

          {hasNameError && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>

        {hasNameError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Name is required
          </p>
        )}
      </div>

      <div className="field" data-cy="EmailField">
        <label className="label" htmlFor="comment-author-email">
          Author Email
        </label>

        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="email"
            id="comment-author-email"
            placeholder="email@test.com"
            className={cn("input", {
              "is-danger": hasEmailError,
            })}
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setHasEmailError(false);
            }}
          />

          <span className="icon is-small is-left">
            <i className="fas fa-envelope" />
          </span>

          {hasEmailError && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>
        {hasEmailError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Email is required
          </p>
        )}
      </div>

      <div className="field" data-cy="BodyField">
        <label className="label" htmlFor="comment-body">
          Comment Text
        </label>

        <div className="control">
          <textarea
            id="comment-body"
            name="body"
            placeholder="Type comment here"
            className={cn("textarea", {
              "is-danger": hasBodyError,
            })}
            value={body}
            onChange={(event) => {
              setBody(event.target.value);
              setHasBodyError(false);
            }}
          />
        </div>

        {hasBodyError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Enter some text
          </p>
        )}
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button
            type="submit"
            className={cn("button is-link", {
              "is-loading": loader,
            })}
          >
            Add
          </button>
        </div>

        <div className="control">
          {/* eslint-disable-next-line react/button-has-type */}
          <button
            type="reset"
            className="button is-link is-light"
            onClick={clear}
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  );
};
