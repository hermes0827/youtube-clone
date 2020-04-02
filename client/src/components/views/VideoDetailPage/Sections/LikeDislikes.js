import React, { useEffect, useState } from "react";
import { Tooltip, Icon } from "antd";
import Axios from "axios";

function LikeDislikes(props) {
  const [Likes, setLikes] = useState(0);
  const [LikeAction, setLikeAction] = useState(null);
  const [Dislikes, setDislikes] = useState(0);
  const [DislikeAction, setDislikeAction] = useState(null);

  let variables = {};
  if (props.video) {
    variables = { videoId: props.videoId, userId: props.userId };
  } else {
    variables = { commentId: props.commentId, userId: props.userId };
  }

  useEffect(() => {
    Axios.post("/api/like/getLikes", variables).then(response => {
      if (response.data.success) {
        // 좋아요 수
        setLikes(response.data.likes.length);
        // 사용자가 좋아요 눌렀는지 확인
        response.data.likes.map(like => {
          if (like.userId === props.userId) {
            setLikeAction("liked");
          }
        });
      } else {
        alert("좋아요 정보를 가져오는 데 실패했습니다.");
      }
    });

    Axios.post("/api/like/getDislikes", variables).then(response => {
      if (response.data.success) {
        // 싫어요 수
        setDislikes(response.data.dislikes.length);
        // 사용자가 싫어요를 눌렀는지 확인
        response.data.dislikes.map(dislike => {
          if (dislike.userId === props.userId) {
            setDislikeAction("disliked");
          }
        });
      } else {
        alert("싫어요 정보를 가져오는 데 실패했습니다.");
      }
    });
  }, []);

  const onLike = () => {
    if (LikeAction === null) {
      Axios.post("/api/like/upLike", variables).then(response => {
        if (response.data.success) {
          setLikes(Likes + 1);
          setLikeAction("liked");
          if (DislikeAction !== null) {
            setDislikes(Dislikes - 1);
            setDislikeAction(null);
          }
        } else {
          alert("좋아요 실패!");
        }
      });
    } else {
      Axios.post("/api/like/unLike", variables).then(response => {
        if (response.data.success) {
          setLikes(Likes - 1);
          setLikeAction(null);
        } else {
          alert("좋아요 취소 실패!");
        }
      });
    }
  };

  const onDislike = () => {
    if (DislikeAction !== null) {
      Axios.post("/api/like/unDislike", variables).then(response => {
        if (response.data.success) {
          setDislikes(Dislikes - 1);
          setDislikeAction(null);
        } else {
          alert("싫어요 취소 실패!");
        }
      });
    } else {
      Axios.post("/api/like/upDislike", variables).then(response => {
        if (response.data.success) {
          setDislikes(Dislikes + 1);
          setDislikeAction("disliked");
          if (LikeAction !== null) {
            setLikeAction(null);
            setLikes(Likes - 1);
          }
        } else {
          alert("싫어요 실패!");
        }
      });
    }
  };

  return (
    <div>
      <span key="comment-basic-like">
        <Tooltip title="Like">
          <Icon
            type="like"
            theme={LikeAction === "liked" ? "filled" : "outlined"}
            onClick={onLike}
          />
        </Tooltip>
        <span style={{ paddingLeft: "8px", cursor: "auto" }}>{Likes}</span>
      </span>
      <span key="comment-basic-dislike">
        <Tooltip title="Dislike">
          <Icon
            type="dislike"
            theme={DislikeAction === "disliked" ? "filled" : "outlined"}
            onClick={onDislike}
          />
        </Tooltip>
        <span style={{ paddingLeft: "8px", cursor: "auto" }}>{Dislikes}</span>
      </span>
    </div>
  );
}

export default LikeDislikes;
