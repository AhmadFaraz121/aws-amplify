import { Component } from "react";
import {API, graphqlOperation } from "@aws-amplify/api";
import {createPost} from '../graphql/mutations'
import Auth from "@aws-amplify/auth";

class CreatePost extends Component{
    state = {
        postOwnerId: "",
        postOwnerUsername: "",
        postTitle: "",
        postBody: ""
    }
    componentDidMount = async () => {
        await Auth.currentUserInfo()
        .then(user => {
            this.setState({
                postOwnerId: user.attributes.sub,
                postOwnerUsername: user.username

            })
        })
    }
    handleChangePost = event => this.setState({
        [event.target.name] : event.target.value 
        })

    handleAddPost = async event => {
        event.preventDefault()

        const input = {
            postOwnerId: this.state.postOwnerId,
            postOwnerUsername: this.state.postOwnerUsername,
            postTitle: this.state.postTitle,
            postBody: this.state.postBody,
            createdAt: new Date().toISOString()
        }
        await API.graphql(graphqlOperation(createPost, { input }))
        this.setState({ postTitle: "", postBody: ""})
    }

    render(){
        return(
            <form className="add-post"onSubmit={this.handleAddPost} >
                <input type="text" placeholder="Title" name="postTitle" required value={this.state.postTitle} onChange={this.handleChangePost} style={{font: '19px'}} />
                <textarea type="text" name="postBody" rows= "3" cols="40" required value={this.state.postBody} onChange={this.handleChangePost} placeholder="New Blog Post" />
                <input type="submit" className="btn" value="Post" style={{fontSize:"19px"}} />
            </form>
        )
    }
}
export default CreatePost;