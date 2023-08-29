import React, { useState } from 'react';
import cn from 'classnames';
import { User } from '../types/User';

type Props = {
  users: User[];
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
};

export const UserSelector: React.FC<Props> = ({
  users,
  currentUser,
  setCurrentUser,
}) => {
  const [activeSelect, setActiveSelect] = useState(false);

  return (
    <div
      data-cy="UserSelector"
      className={cn('dropdown', {
        'is-active': activeSelect,
      })}
    >
      <div className="dropdown-trigger">
        <button
          type="button"
          className="button"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={() => {
            setActiveSelect(!activeSelect);
          }}
        >
          {currentUser !== null ? (
            <span>{currentUser.name}</span>
          ) : (
            <span>Choose a user</span>
          )}

          <span className="icon is-small">
            <i className="fas fa-angle-down" aria-hidden="true" />
          </span>
        </button>
      </div>

      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {users.map((user) => (
            <a
              key={user.id}
              href={`#user-${user.id}`}
              className={cn('dropdown-item', {
                'is-active': user.id === currentUser?.id,
              })}
              onClick={() => {
                setCurrentUser(user);
                setActiveSelect(false);
              }}
            >
              {user.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
