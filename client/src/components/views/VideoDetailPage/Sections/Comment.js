import React, { useState } from "react";
import Axios from "axios";
import { useSelector } from "react-redux";
import SingleComment from "./SingleComment";
import ReplyComment from "./ReplyComment";

function Comment(props) {
  const user = useSelector(state => state.user);
  const videoId = props.postid;
  const [commentValue, setcommentValue] = useState("");

  const handleClick = event => {
    setcommentValue(event.currentTarget.value);
  };

  const onSubmit = event => {
    event.preventDefault();

    const variables = {
      content: commentValue,
      writer: user.userData._id,
      postId: videoId
    };

    Axios.post("/api/comment/saveComment", variables).then(response => {
      if (response.data.success) {
        setcommentValue("");
        props.refreshFunction(response.data.result);
      } else {
        alert("댓글을 저장하지 못하였습니다.");
      }
    });
  };

  return (
    <div>
      <br />
      <p> Replies </p>
      <hr />

      {/* Comment Lists */}
      {props.commentLists &&
        props.commentLists.map((comment, index) => (
            (!comment.responseTo && 
              <React.Fragment>
                <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={videoId} />
                <ReplyComment postId={videoId} parentCommentId={comment._id} commentLists={props.commentLists} refreshFunction={props.refreshFunction} />
              </React.Fragment>
            )
        ))}

      {/* Root Comment form */}

      <form style={{ display: "flex" }} onSubmit={onSubmit}>
        <textarea style={{ width: "100%", borderRadius: "5px" }} onChange={handleClick} value={commentValue} placeholder="댓글을 입력하세요" />
        <br />
        <button style={{ width: "20%", height: "52px" }} onClick={onSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default Comment;
