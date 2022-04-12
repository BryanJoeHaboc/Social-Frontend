import React, { Component } from "react";
import post from "../../../components/Feed/Post/Post";

import Image from "../../../components/Image/Image";
import "./SinglePost.css";

class SinglePost extends Component {
  state = {
    title: "",
    author: "",
    date: "",
    image: "",
    content: "",
  };

  componentDidMount() {
    const postId = this.props.match.params.postId;
    console.log(postId);
    const graphqlQuery = {
      query: `{
      getSinglePost(postId : "${postId}"){
       content
       title
       imageUrl
       creator {
        name
      }
       createdAt
    }
    }`,
    };

    fetch(`http://localhost:5000/graphql`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + this.props.token,
        "Content-type": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        if (resData.errors) {
          throw new Error("Unable to get Posts!");
        }
        this.setState({
          image: "http://localhost:5000/" + resData.data.getSinglePost.imageUrl,
          title: resData.data.getSinglePost.title,
          author: resData.data.getSinglePost.creator.name,
          date: new Date(
            resData.data.getSinglePost.createdAt
          ).toLocaleDateString("en-US"),
          content: resData.data.getSinglePost.content,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <section className="single-post">
        <h1>{this.state.title}</h1>
        <h2>
          Created by {this.state.author} on {this.state.date}
        </h2>
        <div className="single-post__image">
          <Image contain imageUrl={this.state.image} />
        </div>
        <p>{this.state.content}</p>
      </section>
    );
  }
}

export default SinglePost;
