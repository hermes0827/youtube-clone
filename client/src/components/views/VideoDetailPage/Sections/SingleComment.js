import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Comment, Avatar, Button, Input } from "antd";
import Axios from "axios";
import LikeDislikes from './LikeDislikes'

const { TextArea } = Input;

function SingleComment(props) {
  const user = useSelector(state => state.user);
  const [OpenReply, setOpenReply] = useState(false);
  const [CommentValue, setCommentValue] = useState("");

  const onHandleChange = event => {
    setCommentValue(event.currentTarget.value);
  };

  const onClickReplyOpen = () => {
    setOpenReply(!OpenReply);
  };

  const actions = [
    <LikeDislikes userId={localStorage.getItem('userId')} commentId={props.comment._id}/>,
    <span onClick={onClickReplyOpen} key="comment-basic-reply-to">
      Reply To
    </span>
  ];

  const onSubmit = event => {
    event.preventDefault();

    const variables = {
      content: CommentValue,
      writer: user.userData._id,
      postId: props.postId,
      responseTo: props.comment._id
    };

    Axios.post("/api/comment/saveComment", variables).then(response => {
      if (response.data.success) {
        setCommentValue("");
        setOpenReply(false)
        props.refreshFunction(response.data.result);
      } else {
        alert("댓글을 저장하지 못하였습니다.");
      }
    });
  };

  return (
    <div>
      <Comment
        actions={actions}
        author={props.comment.writer.name}
        avatar={<Avatar src={props.comment.writer.image} alt />}
        content={<p> {props.comment.content} </p>}
      />

      {OpenReply && (
        <form style={{ display: "flex" }} onSubmit={onSubmit}>
          <textarea style={{ width: "100%", borderRadius: "5px" }} onChange={onHandleChange} value={CommentValue} placeholder="대댓글을 입력하세요" />
          <br />
          <button style={{ width: "20%", height: "52px" }} onClick={onSubmit}>
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

export default SingleComment;
