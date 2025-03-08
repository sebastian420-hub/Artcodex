import React, { useState } from 'react';
import { useCommentManager } from '../hooks/useCommentManager';

export default function CommentSection({ postId }) {
  const { comments, submitComment } = useCommentManager(postId);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    await submitComment(newComment);
    setNewComment('');
  };

  return (
    <div className="card-comment comment-section" style={{ display: 'block' }}>
      <strong>Comments:</strong>
      <div id={`comment_del_${postId}`} className="col-md-8 mx-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="mt-2">
            <p>
              <strong>{comment.user.username}</strong>: {comment.comment}{' '}
              <small className="text-muted">
                ({new Date(comment.created).toLocaleString()})
              </small>
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-2">
        <input
          type="text"
          className="form-control mb-2"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Anything on your mind?"
          style={{ borderRadius: '4px' }}
        />
        <button type="submit" className="btn btn-primary btn-sm" style={{ borderRadius: '4px' }}>
          Submit
        </button>
      </form>
    </div>
  );
}
